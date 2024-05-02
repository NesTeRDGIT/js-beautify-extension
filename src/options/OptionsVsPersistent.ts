import { IOptionsPersistent } from "./IOptionsPersistent";
import { JSBeautifyOptions, HTMLBeautifyOptions, CSSBeautifyOptions, CoreBeautifyOptions } from 'js-beautify';
import * as vscode from 'vscode';
import { FormatType } from "../formatters/FormatType";
import { Options } from "./Options";

/** Хранилище параметров в VsCode */
export class OptionsVsCodePersistent implements IOptionsPersistent {
    private optionsMap?: Map<FormatType, Options>;

    constructor() {
    }

    reset(): void {
        this.optionsMap = undefined;
    }

    getOptionAsync = (type: FormatType): Promise<Options> => {
        return new Promise<Options>((resolve) => {
            if (this.optionsMap) {
                const option = this.optionsMap.get(type);
                resolve( option ? Object.assign({}, option) : {});
            } else {
                this.loadAsync().then(() => {
                    this.getOptionAsync(type).then(v => resolve(v));
                });
            }
        });
    }

    /** Загрузить параметры */
    private loadAsync = (): Promise<void> => {
        return new Promise((resolve) => {
            const vsCodeConfig = vscode.workspace.getConfiguration();
            const extensionConfig = vscode.workspace.getConfiguration('js-beautify-for-vscode');
            
            const options: CoreBeautifyOptions = {
                end_with_newline: vsCodeConfig.files.insertFinalNewLine,
                eol: vsCodeConfig.files.eol
            };

            this.optionsMap = new Map();
            this.createHtmlOptions(vsCodeConfig, extensionConfig, {...options});
            this.createJsOptions(vsCodeConfig, extensionConfig, {...options});
            this.createCssOptions(vsCodeConfig, extensionConfig, {...options});
            resolve();
        });
    }

    /** Создать параметры для html */
    private createHtmlOptions = (vsCodeConfig: vscode.WorkspaceConfiguration, extentionConfig: vscode.WorkspaceConfiguration, optionBase: JSBeautifyOptions) => {
        const options: HTMLBeautifyOptions = optionBase;

        const templating = extentionConfig.get('html.templating');
        if (Array.isArray(templating) && templating.every(x => typeof x == 'string')) {
            options.templating = templating;
        }
        const extraLiners = vsCodeConfig.html.format.extraLiners;
        if (typeof extraLiners === 'string') {
            options.extra_liners = extraLiners.split(',').map(s => s.trim());
        }
        options.indent_handlebars = vsCodeConfig.html.format.indentHandlebars;
        options.indent_inner_html = vsCodeConfig.html.format.indentInnerHtml;
        options.max_preserve_newlines = vsCodeConfig.html.format.maxPreserveNewLines;
        options.preserve_newlines = vsCodeConfig.html.format.preserveNewLines;
        options.wrap_attributes = vsCodeConfig.html.format.wrapAttributes;

        const unformatted = vsCodeConfig.html.format.unformatted;
        if (typeof unformatted === 'string') {
            options.unformatted = unformatted.split(',').map(s => s.trim());
        }
        options.wrap_line_length = vsCodeConfig.html.format.wrapLineLength;

        this.optionsMap!.set(FormatType.html, options);
    }

    /** Создать параметры для js */
    private createJsOptions = (vsCodeConfig: vscode.WorkspaceConfiguration, extensionConfig: vscode.WorkspaceConfiguration, optionBase: JSBeautifyOptions) => {
        const options: JSBeautifyOptions = optionBase;

        const templating = extensionConfig.get('js.templating');
        if (Array.isArray(templating) && templating.every(x => typeof x == 'string')) {
            options.templating = templating;
        }
        options.space_after_anon_function = vsCodeConfig.javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions;
        options.space_in_paren = vsCodeConfig.javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis;
        this.optionsMap!.set(FormatType.js, options);
    }

    /** Создать параметры для css */
    private createCssOptions = (vsCodeConfig: vscode.WorkspaceConfiguration, extensionConfig: vscode.WorkspaceConfiguration, optionBase: JSBeautifyOptions) => {
        const options: CSSBeautifyOptions = optionBase;
        const templating = extensionConfig.get('css.templating');
        if (Array.isArray(templating) && templating.every(x => typeof x == 'string')) {
            options.templating = templating;
        }
        this.optionsMap!.set(FormatType.css, options);
    }
}