const vscode = require('vscode');

const openingTag = '<mark>';
const closingTag = '</mark>';

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

function activate(context) {
  const disposable = vscode.commands.registerTextEditorCommand(
    'highlightMark.toggle',
    toggleSelection,
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};