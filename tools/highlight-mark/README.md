# Highlight Mark

This local VS Code extension wraps selected Markdown text with `<mark>` tags.

## Use

- Select text in a Markdown file.
- Right-click and choose **Highlight Mark: Toggle Selection**.
- Or press `Ctrl+Alt+H`.

Running the command again on a selection that already includes `<mark>` and `</mark>` removes those tags.

## Install in VS Code

From the repository root, run:

```powershell
code --install-extension .\tools\highlight-mark
```

Then reload VS Code. The extension is intentionally kept in the repository so it can be installed again on another development machine.