import * as vscode from 'vscode';
import { Extension } from './extension/Extension';

const extension = new Extension();

export function activate(context: vscode.ExtensionContext) {
  extension.activate(context);
};