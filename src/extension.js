'use strict';

const vscode = require('vscode');
const { saveDirtyDocuments } = require('./autosave');

function activate(context) {
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
  status.command = 'easyAutosave.toggle';
  context.subscriptions.push(status);

  let timer;
  let disposed = false;
  const config = () => vscode.workspace.getConfiguration('easyAutosave');

  function refreshStatus(savedCount) {
    const enabled = config().get('enabled', true);
    const dirtyCount = vscode.workspace.textDocuments.filter(doc => doc.isDirty).length;
    if (!enabled) {
      status.text = '$(circle-slash) AutoSave off';
      status.tooltip = 'Click to enable Easy AutoSave';
    } else if (savedCount > 0) {
      status.text = `$(check) Saved ${savedCount} file${savedCount === 1 ? '' : 's'}`;
      status.tooltip = 'Easy AutoSave completed';
    } else if (dirtyCount > 0) {
      status.text = `$(warning) ${dirtyCount} unsaved`;
      status.tooltip = 'Dirty text files will be saved on the next timer';
    } else {
      status.text = '$(check) All saved';
      status.tooltip = 'Easy AutoSave is enabled';
    }
    status.show();
  }

  async function savePass() {
    if (disposed || !config().get('enabled', true)) return;
    try {
      const count = await saveDirtyDocuments(vscode.workspace.textDocuments);
      refreshStatus(count);
    } catch (error) {
      status.text = '$(error) AutoSave failed';
      status.tooltip = String(error);
      status.show();
    }
  }

  function restartTimer() {
    if (timer) clearInterval(timer);
    timer = undefined;
    if (config().get('enabled', true)) {
      const minutes = config().get('intervalMinutes', 5);
      timer = setInterval(savePass, minutes * 60 * 1000);
    }
    refreshStatus();
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => refreshStatus()),
    vscode.workspace.onDidOpenTextDocument(() => refreshStatus()),
    vscode.workspace.onDidCloseTextDocument(() => refreshStatus()),
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('easyAutosave')) restartTimer();
    }),
    vscode.commands.registerCommand('easyAutosave.toggle', async () => {
      const next = !config().get('enabled', true);
      await config().update('enabled', next, vscode.ConfigurationTarget.Global);
      restartTimer();
    }),
    { dispose: () => { disposed = true; if (timer) clearInterval(timer); } }
  );

  restartTimer();
}

function deactivate() {}

module.exports = { activate, deactivate };
