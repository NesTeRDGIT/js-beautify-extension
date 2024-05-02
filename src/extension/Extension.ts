import * as vscode from 'vscode';
import { Document } from "../document/Document";
import { Formatters } from "../formatters/Formatters";
import { IOptionsPersistent } from '../options/IOptionsPersistent';
import * as path from 'path';
import * as fs from 'fs';
import { OptionsVsCodePersistent } from '../options/OptionsVsPersistent';
import { OptionsFilePersistent } from '../options/OptionsFilePersistent';
import { Options } from 'src/options/Options';

export class Extension implements Disposable {
    private readonly configFileName = '.jsbeautifyrc.json';
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
        sub.push(vscode.workspace.onDidOpenTextDocument(() => this.checkOptionsPersistent()));
    }

    /** Форматировать текущий документ */
    private beautifyHandler(isSelection: boolean) {
        const active = vscode.window.activeTextEditor;
        if (!active || !active.document) return;
        const document = active.document;
        const formatter = this.formatters.getFormatter(document);
        if(formatter && this.optionsPersistent){
            const doc = new Document(active.document, formatter);
            this.optionsPersistent.getOptionAsync(formatter.type).then((option)=>{
                const vsCodeConfig = vscode.workspace.getConfiguration();
                const vsOptions: vscode.FormattingOptions = vsCodeConfig.editor;
                option = this.mergeOptions(option,vsOptions);

                if (isSelection) {
                    if (active.selection) {
                        const ranges = active.selections.filter(selection => !selection.isEmpty);
                        doc.formatSelection(ranges, option).then(texts => {
                            this.replaceEditorText(active, texts);
                        });
                    }
                } else {
                    doc.formatFullAsync(option).then(texts => {
                        if (texts != null) {
                            this.replaceEditorText(active, [texts])
                        }
                    })
                }
            })
        }
        return Promise.resolve();
    }

    private saveTextDocumentHandler(document: vscode.TextDocument) {
        if (this.optionsPersistent instanceof OptionsFilePersistent && this.optionsPersistent.filename == document.fileName) {
            this.optionsPersistent.reset();
        }
    }

        private changeConfigurationHandler() {
            //При изменении конфигурации сбрасываем конфигурацию если она OptionsVsCodePersistent
        if (this.optionsPersistent instanceof OptionsVsCodePersistent) {
            this.optionsPersistent.reset();
        }
    }

    /** Проверить конфигурацию
     * Файл конфигурации появился или пропал
     */
    private checkOptionsPersistent() {
        const pathConfigFile = this.getConfigFilePath();
        if(pathConfigFile != null && this.optionsPersistent instanceof OptionsVsCodePersistent){
            this.optionsPersistent = new OptionsFilePersistent(pathConfigFile);
        }
        if(pathConfigFile == null && this.optionsPersistent instanceof OptionsFilePersistent){
            this.optionsPersistent = new OptionsVsCodePersistent()
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
            const fullPath = path.join(root, this.configFileName);
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
                provideDocumentRangeFormattingEdits: (document, range, options) => {
                    return this.provideDocumentRangeFormattingEdits(document, range, options)
                }
            });

            const registerDocumentFormattingEditProvider = vscode.languages.registerDocumentFormattingEditProvider(x.selector, {
                provideDocumentFormattingEdits: (document, options) => {
                    return this.provideDocumentFormattingEdits(document, options)
                }
            });

            this.vsCodeDispose.push(registerDocumentRangeFormattingEditProvider);
            this.vsCodeDispose.push(registerDocumentFormattingEditProvider);
        })
    };

    private provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, vsOptions: vscode.FormattingOptions): vscode.ProviderResult<vscode.TextEdit[]> {
      
        return new Promise<vscode.TextEdit[]>((resolve) => {           
            if (this.optionsPersistent) {              
                const formatter = this.formatters.getFormatter(document);
                if(formatter){
                    const doc = new Document(document, formatter);                   
                    return this.optionsPersistent.getOptionAsync(formatter.type).then((option)=>{                       
                        option = this.mergeOptions(option, vsOptions);
                        return doc.formatSelection([range], option).then(result => {
                            const replaces = result.map(x => vscode.TextEdit.replace(x.range, x.text));
                            resolve(replaces);
                        })
                    })
                }
            }
            return;
        });
    }

    private provideDocumentFormattingEdits(document: vscode.TextDocument, vsOptions: vscode.FormattingOptions): vscode.ProviderResult<vscode.TextEdit[]> {
        return new Promise<vscode.TextEdit[]>((resolve) => {
            if (this.optionsPersistent) {
                const formatter = this.formatters.getFormatter(document);
                if(formatter){
                    const doc = new Document(document, formatter);
                    return this.optionsPersistent.getOptionAsync(formatter.type).then((option)=>{
                        option = this.mergeOptions(option, vsOptions);
                        return doc.formatFullAsync(option).then(result => {
                            resolve(result ? [new vscode.TextEdit(result.range, result.text)] : [])
                        });
                    });                
                }
            }
            return;
        });

        
    }

    /** Смешать параметры хранилища и параметры от VsCode */
    private mergeOptions(options: Options, vsOptions: vscode.FormattingOptions):Options{
        options.indent_with_tabs = options.indent_with_tabs || !vsOptions.insertSpaces;
        options.indent_size = options.indent_size || vsOptions.tabSize;
        options.indent_char = options.indent_char || vsOptions.insertSpaces ? ' ': '\t';
        return options;
    }

    [Symbol.dispose](): void {
        this.vsCodeDispose.forEach(x=>x.dispose());
        this.vsCodeDispose = [];
    }
}