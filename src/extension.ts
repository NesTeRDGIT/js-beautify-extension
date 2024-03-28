import * as vscode from 'vscode';
import { Extention } from './vscode/Extention';

const extention = new Extention();

export function activate(context: vscode.ExtensionContext) {
  extention.activate(context);
};