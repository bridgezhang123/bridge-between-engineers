const vscode = require('vscode');
const fs = require('node:fs');
const path = require('node:path');

const openingTag = '<mark>';
const closingTag = '</mark>';
const lastImageDirectoryKey = 'insertFigures.lastImageDirectory';
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'bmp', 'tif', 'tiff', 'svg'];
const admonitionTypes = [
  'note',
  'abstract',
  'info',
  'tip',
  'success',
  'question',
  'warning',
  'failure',
  'danger',
  'bug',
  'example',
  'quote',
];

function toggleSelection(editor) {
  const selections = editor.selections;

  return editor.edit((editBuilder) => {
    for (const selection of selections) {
      const selectedText = editor.document.getText(selection);

      if (selectedText.startsWith(openingTag) && selectedText.endsWith(closingTag)) {
        const contentRange = new vscode.Range(
          selection.start.translate(0, openingTag.length),
          selection.end.translate(0, -closingTag.length),
        );
        editBuilder.replace(selection, editor.document.getText(contentRange));
      } else {
        editBuilder.replace(selection, `${openingTag}${selectedText}${closingTag}`);
      }
    }
  });
}

function wrapSelectionInAdmonition(editor, type) {
  const { document } = editor;
  const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';

  return editor.edit((editBuilder) => {
    for (const selection of editor.selections) {
      const selectedText = document.getText(selection);
      const startOfLine = new vscode.Position(selection.start.line, 0);
      const endOfLine = new vscode.Position(
        selection.end.line,
        document.lineAt(selection.end.line).text.length,
      );
      const prefix = document.getText(new vscode.Range(startOfLine, selection.start));
      const suffix = document.getText(new vscode.Range(selection.end, endOfLine));
      const content = selectedText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n+$/, '')
        .split('\n')
        .map((line) => (line ? `    ${line}` : ''))
        .join(eol);
      const hasPreviousLineContent = selection.start.line > 0
        && document.lineAt(selection.start.line - 1).text.trim();
      const leadingEols = prefix.trim()
        ? `${eol}${eol}`
        : selection.start.character === 0 && hasPreviousLineContent
          ? eol
          : '';
      const separatesFollowingText = suffix.trim() || /(?:\r\n|\r|\n)$/.test(selectedText);
      const trailingEols = separatesFollowingText ? `${eol}${eol}` : eol;

      editBuilder.replace(
        selection,
        `${leadingEols}!!! ${type}${eol}${eol}${content}${trailingEols}`,
      );
    }
  });
}

function escapeMarkdownAltText(text) {
  return text.replace(/\\/g, '\\\\').replace(/\]/g, '\\]');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getFigureName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const lastSeparator = fileName.lastIndexOf('_');

  if (lastSeparator < 0 || lastSeparator === fileName.length - 1) {
    return fileName;
  }

  return fileName.slice(lastSeparator + 1);
}

function getMarkdownImagePath(documentPath, imagePath) {
  const relativePath = path.relative(path.dirname(documentPath), imagePath);
  if (path.isAbsolute(relativePath)) {
    throw new Error('The Markdown document and selected image must be on the same drive.');
  }

  return relativePath
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment).replace(/[!'()*]/g, (character) => (
      `%${character.charCodeAt(0).toString(16).toUpperCase()}`
    )))
    .join('/');
}

function createFigure(imagePath, documentPath, indentation = '    ', markdownAttribute = 'span') {
  const name = getFigureName(imagePath);
  const image = getMarkdownImagePath(documentPath, imagePath);

  return [
    `<figure markdown="${markdownAttribute}">`,
    `${indentation}![${escapeMarkdownAltText(name)}](${image}){ width="720" }`,
    `${indentation}<figcaption>${escapeHtml(name)}</figcaption>`,
    '</figure>',
  ].join('\n');
}

function createSingleFigure(imagePath, documentPath) {
  return createFigure(imagePath, documentPath);
}

function createTwoParallelFigures(imagePaths, documentPath) {
  return [
    '<div class="two-parallel-figures-grid" markdown="1">',
    createFigure(imagePaths[0], documentPath, '  ', '1'),
    '',
    createFigure(imagePaths[1], documentPath, '  ', '1'),
    '</div>',
  ].join('\n');
}

function addBlockAtPosition(editor, block) {
  const { document, selection } = editor;
  if (document.uri.scheme !== 'file') {
    return vscode.window.showErrorMessage('Save the Markdown document before inserting figures.');
  }

  const position = selection.active;
  const line = document.lineAt(position.line);
  const startOfLine = new vscode.Position(position.line, 0);
  const endOfLine = new vscode.Position(position.line, line.text.length);
  const prefix = document.getText(new vscode.Range(startOfLine, position));
  const suffix = document.getText(new vscode.Range(position, endOfLine));
  const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
  const hasPreviousLineContent = position.line > 0
    && document.lineAt(position.line - 1).text.trim();
  const leadingEols = prefix.trim()
    ? `${eol}${eol}`
    : position.character === 0 && hasPreviousLineContent
      ? eol
      : '';
  const trailingEols = suffix.trim() ? `${eol}${eol}` : eol;
  const insertion = `${leadingEols}${block.replace(/\n/g, eol)}${trailingEols}`;

  return editor.edit((editBuilder) => {
    editBuilder.insert(position, insertion);
  }).then((applied) => {
    if (!applied) {
      return vscode.window.showErrorMessage('Could not insert the figure block into the Markdown document.');
    }
    return undefined;
  });
}

async function insertFigures(editor, context, count) {
  const { document } = editor;
  if (document.uri.scheme !== 'file') {
    await vscode.window.showErrorMessage('Save the Markdown document before inserting figures.');
    return;
  }

  const rememberedDirectory = context.globalState.get(lastImageDirectoryKey);
  const documentDirectory = path.dirname(document.uri.fsPath);
  const defaultDirectory = typeof rememberedDirectory === 'string'
    && fs.existsSync(rememberedDirectory)
    ? rememberedDirectory
    : documentDirectory;
  const selectedFiles = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: count > 1,
    defaultUri: vscode.Uri.file(defaultDirectory),
    filters: { Images: imageExtensions },
    openLabel: count === 1 ? 'Insert Figure' : 'Insert Figures',
    title: count === 1 ? 'Select an image' : 'Select two images',
  });

  if (!selectedFiles || selectedFiles.length === 0) {
    return;
  }
  if (selectedFiles.length !== count) {
    await vscode.window.showErrorMessage(`Select exactly ${count} image${count === 1 ? '' : 's'}.`);
    return;
  }

  await context.globalState.update(
    lastImageDirectoryKey,
    path.dirname(selectedFiles[0].fsPath),
  );

  try {
    const imagePaths = selectedFiles.map((file) => file.fsPath);
    const block = count === 1
      ? createSingleFigure(imagePaths[0], document.uri.fsPath)
      : createTwoParallelFigures(imagePaths, document.uri.fsPath);
    await addBlockAtPosition(editor, block);
  } catch (error) {
    await vscode.window.showErrorMessage(
      error instanceof Error ? error.message : 'Could not create the figure block.',
    );
  }
}

function activate(context) {
  const disposable = vscode.commands.registerTextEditorCommand(
    'highlightMark.toggle',
    toggleSelection,
  );

  context.subscriptions.push(disposable);

  for (const type of admonitionTypes) {
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand(
        `admonitions.${type}`,
        (editor) => wrapSelectionInAdmonition(editor, type),
      ),
    );
  }

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      'insertFigures.single',
      (editor) => insertFigures(editor, context, 1),
    ),
    vscode.commands.registerTextEditorCommand(
      'insertFigures.twoParallel',
      (editor) => insertFigures(editor, context, 2),
    ),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  wrapSelectionInAdmonition,
  createSingleFigure,
  createTwoParallelFigures,
  addBlockAtPosition,
};
