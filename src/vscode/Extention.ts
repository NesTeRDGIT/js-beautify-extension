import * as vscode from 'vscode';
import { Document } from "../document/Document";
import { Formatters } from "../formatters/Formatters";
import { IOptionsPersistent } from '../options/IOptionsPersistent';
import * as path from 'path';
import * as fs from 'fs';
import { OptionsVsCodePersistent } from '../options/OptionsVsPersistent';
import { OptionsFilePersistent } from '../options/OptionsFilePersistent';

export class Extention implements Disposable {
    
    private formatters = new Formatters();
    private optionsPersistent?: IOptionsPersistent;
    private vsCodeDispose: vscode.Disposable[] = [];

    activate(context: vscode.ExtensionContext) {
        this[Symbol.dispose]();
        
        const pathConfigFile = this.getConfigFilePath();
        this.optionsPersistent = pathConfigFile == null ? new OptionsVsCodePersistent() : new OptionsFilePersistent(pathConfigFile);
        this.register();

        let sub = context.subscriptions;
        sub.push(vscode.commands.registerCommand('js-beautify-ext.beautify', () => this.beautifyHandler(true)));
        sub.push(vscode.commands.registerCommand('js-beautify-ext.beautifyFile', () => this.beautifyHandler(false)));
        
        sub.push(vscode.workspace.onDidSaveTextDocument((document) => this.saveTextDocumentHandler(document)));
        sub.push(vscode.workspace.onDidChangeConfiguration(() => this.changeConfigurationHandler()));
    }

    /** Форматировать текущий документ */
    private beautifyHandler(isSelection: boolean) {
        const active = vscode.window.activeTextEditor;
        if (!active || !active.document) return;
        const document = active.document;
        const doc = new Document(active.document, this.formatters, this.optionsPersistent!);
        const formatter = this.formatters.getFormatter(document);
        if (formatter) {
            if (isSelection) {
                if (active.selection) {
                    const ranges = active.selections.filter(selection => !selection.isEmpty);
                    doc.formatSelection(ranges).then(texts => {
                        this.replaceEditorText(active, texts);
                    });
                }
            } else {
                doc.formatFullAsync().then(texts => {
                    if (texts != null) {
                        this.replaceEditorText(active, [texts])
                    }
                })
            }
        }
        return Promise.resolve();
    }

    private saveTextDocumentHandler(document: vscode.TextDocument) {
        if (this.optionsPersistent instanceof OptionsFilePersistent && this.optionsPersistent.filename == document.fileName) {
            this.optionsPersistent.reset();
        }
    }

    private changeConfigurationHandler() {
        if (this.optionsPersistent instanceof OptionsVsCodePersistent) {
            this.optionsPersistent.reset();
        }
    }

    /** Заменить текст в редакторе */
    private replaceEditorText(editor: vscode.TextEditor, values: ({ range: vscode.Range, text: string })[]) {
        values.forEach(r => {
            editor.edit(e => {
                e.replace(r.range, r.text);
            })
        })
    };

    /** Получить путь к файлу конфигурации */
    private getConfigFilePath(): string | null {
        const root = this.getWorkspaceRoot();
        if (root != null) {
            const fullPath = path.join(root, '.jsbeautifyrc');
            return fs.existsSync(fullPath) ? fullPath : null
        }
        return null;
    }

    /** Получить корень проекта */
    private getWorkspaceRoot(): string | null {
        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            return null;
        }
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    };

    /** Регистрация форматеров для событий */
    register = () => {
        this.formatters.formats.forEach(x => {
            const registerDocumentRangeFormattingEditProvider = vscode.languages.registerDocumentRangeFormattingEditProvider(x.selector, {
                provideDocumentRangeFormattingEdits: (document, range) => {
                    return this.provideDocumentRangeFormattingEdits(document, range)
                }
            });

            const registerDocumentFormattingEditProvider = vscode.languages.registerDocumentFormattingEditProvider(x.selector, {
                provideDocumentFormattingEdits: (document) => {
                    return this.provideDocumentFormattingEdits(document)
                }
            });

            this.vsCodeDispose.push(registerDocumentRangeFormattingEditProvider);
            this.vsCodeDispose.push(registerDocumentFormattingEditProvider);
        })
    };

    private provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.ProviderResult<vscode.TextEdit[]> {
        if (this.optionsPersistent) {
            const doc = new Document(document, this.formatters, this.optionsPersistent);
            return new Promise<vscode.TextEdit[]>((resolve) => {
                doc.formatSelection([range]).then(result => {
                    resolve(result.map(x => new vscode.TextEdit(x.range, x.text)));
                })
            });
        }
        return [];
    }

    private provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.ProviderResult<vscode.TextEdit[]> {
        if (this.optionsPersistent) {
            const doc = new Document(document, this.formatters, this.optionsPersistent);
            return new Promise<vscode.TextEdit[]>((resolve) => {
                doc.formatFullAsync().then(result => {
                    if (result) {
                        resolve([new vscode.TextEdit(result.range, result.text)])
                    }
                    resolve([]);
                })
            })
        }
        return [];
    }

    [Symbol.dispose](): void {
        this.vsCodeDispose.forEach(x=>x.dispose());
        this.vsCodeDispose = [];
    }
}