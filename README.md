# Easy AutoSave

A lightweight VS Code extension that periodically saves dirty text documents in the current VS Code window. It is enabled by default and runs a save pass every **5 minutes**. Saving is limited to open, dirty text documents: clean files are not written, and binary/custom editors are not touched.

## Features

- Periodic save pass (default: 5 minutes).
- Status-bar indicator for unsaved changes, successful saves, and disabled state. Click the indicator to toggle the extension.
- Enable/disable with the `Easy AutoSave: Toggle` command or the `easyAutosave.enabled` setting.
- Configure interval in VS Code Settings (`easyAutosave.intervalMinutes`, 1–1440 minutes).
- No file watching or background polling between save passes; one timer and a small number of VS Code event subscriptions are used.

## Installation

The extension is not published to the VS Code Marketplace yet. To install it from this repository:

1. Clone the repository and open a terminal in its folder:

   ```sh
   git clone https://github.com/isidrolv/easy-autosave-plugin.git
   cd easy-autosave-plugin
   ```

2. Install the VS Code Extension Manager CLI if needed, then package the extension:

   ```sh
   npm install --global @vscode/vsce
   vsce package
   ```

   This creates `easy-autosave-plugin-0.1.0.vsix` in the project folder.

3. Install the generated VSIX using either method:

   - **Command line:** `code --install-extension easy-autosave-plugin-0.1.0.vsix`
   - **VS Code UI:** open the Extensions view, select **...** → **Install from VSIX...**, and choose the generated file.

4. Reload VS Code if prompted. Easy AutoSave is enabled by default. To verify or configure it, open Settings and search for **Easy AutoSave**.

For development without packaging, open the project folder in VS Code and press **F5** to launch an Extension Development Host; this does not install the extension into your regular VS Code profile.

## Configuration

Settings are contributed by the extension and are stored in the normal VS Code user/workspace `settings.json` (or can be set in the Settings UI). For example:

```json
{
  "easyAutosave.enabled": true,
  "easyAutosave.intervalMinutes": 5
}
```

To change the interval for only the current project, place the same settings in `.vscode/settings.json`. The interval is in minutes; values outside 1–1440 are rejected by VS Code's setting schema. Changes take effect immediately. Disabling the extension stops its timer; re-enable it using the command or setting.

## Status bar

- `N unsaved`: one or more open text documents are dirty and waiting for the next timer.
- `Saved N files`: the most recent timer pass saved files successfully.
- `All saved`: no dirty text documents are currently open.
- `AutoSave off`: saving is disabled.
- `AutoSave failed`: a save pass encountered an error; the tooltip contains the error.

## Development

Requires Node.js 18+ and VS Code 1.85+.

```sh
npm test
npm run lint
```

To run the extension locally, open this folder in VS Code and press **F5** to launch an Extension Development Host. Tests use Node's built-in test runner and do not require VS Code or third-party test dependencies.

## Behavior and limitations

The extension does not change VS Code's global `files.autoSave` setting. It saves only dirty text documents exposed through the VS Code workspace API. If a document requires user input (for example, a conflict resolution), VS Code may be unable to save it automatically; the extension reports a failed save pass in the status bar. The timer is active only while the extension host is running, so VS Code must remain open for timed saves to occur.

## License

MIT
