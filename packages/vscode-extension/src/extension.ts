import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

/**
 * Melon VS Code Extension
 */

export function activate(context: vscode.ExtensionContext) {
  console.log('Melon extension activated');

  // Register compile command
  const compileCommand = vscode.commands.registerCommand('melon.compile', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const document = editor.document;
    if (document.languageId !== 'melon') {
      vscode.window.showErrorMessage('Current file is not a Melon file');
      return;
    }

    await document.save();

    const config = vscode.workspace.getConfiguration('melon');
    const compilerPath = config.get('compiler.path', 'melonc');

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Compiling Melon file...',
      cancellable: false
    }, async (progress) => {
      return new Promise((resolve, reject) => {
        const proc = spawn(compilerPath, ['build', document.fileName]);

        let output = '';
        let errorOutput = '';

        proc.stdout.on('data', (data) => {
          output += data.toString();
        });

        proc.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        proc.on('close', (code) => {
          if (code === 0) {
            vscode.window.showInformationMessage('✓ Compilation successful');
            resolve(null);
          } else {
            vscode.window.showErrorMessage(`Compilation failed: ${errorOutput}`);
            reject(new Error(errorOutput));
          }
        });
      });
    });
  });

  // Register validate command
  const validateCommand = vscode.commands.registerCommand('melon.validate', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'melon') {
      vscode.window.showErrorMessage('No active Melon file');
      return;
    }

    await editor.document.save();

    const config = vscode.workspace.getConfiguration('melon');
    const compilerPath = config.get('compiler.path', 'melonc');

    const proc = spawn(compilerPath, ['validate', editor.document.fileName]);

    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        vscode.window.showInformationMessage('✓ Validation successful');
      } else {
        vscode.window.showErrorMessage('Validation failed');
      }
    });
  });

  // Register init command
  const initCommand = vscode.commands.registerCommand('melon.init', async () => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace folder open');
      return;
    }

    const template = await vscode.window.showQuickPick(['basic', 'advanced'], {
      placeHolder: 'Select template'
    });

    if (!template) return;

    const config = vscode.workspace.getConfiguration('melon');
    const compilerPath = config.get('compiler.path', 'melonc');

    const proc = spawn(compilerPath, ['init', '.', '--template', template], {
      cwd: workspaceFolder.uri.fsPath
    });

    proc.on('close', (code) => {
      if (code === 0) {
        vscode.window.showInformationMessage('✓ Project initialized');
      } else {
        vscode.window.showErrorMessage('Initialization failed');
      }
    });
  });

  // Register compile on save
  const onSaveHandler = vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (document.languageId !== 'melon') return;

    const config = vscode.workspace.getConfiguration('melon');
    const compileOnSave = config.get('compileOnSave', false);

    if (compileOnSave) {
      vscode.commands.executeCommand('melon.compile');
    }
  });

  context.subscriptions.push(compileCommand, validateCommand, initCommand, onSaveHandler);
}

export function deactivate() {}
