import { html, css, js, } from 'js-beautify';
import { Formatter } from './Formatter';
import * as vscode from 'vscode';
import { FormatType } from './FormatType';

/** Доступные форматеры */
export class Formatters {
  private _formats = new Map<FormatType, Formatter>();

  constructor() {
    const jsData = new Formatter(['javascript', 'typescript', 'json', 'jsonc'], FormatType.js, js);
    const htmlData = new Formatter(['html', 'htm'], FormatType.html, html);
    const cssData = new Formatter(['css', 'scss', 'less'], FormatType.css, css);

    this._formats.set(jsData.type, jsData);
    this._formats.set(htmlData.type, htmlData);
    this._formats.set(cssData.type, cssData);
  }

  get formats(): ReadonlyMap<FormatType, Formatter> {
    return this._formats;
  }

  /** Получить тип документа */
  getType(doc: vscode.TextDocument): FormatType | null {
    for (let [format, data] of this._formats) {
      if (vscode.languages.match(data.selector, doc)) {
        return format;
      }
    }
    return null;
  }

  /** Получить форматер */
  getFormatter(format: FormatType): Formatter | null;
  getFormatter(doc: vscode.TextDocument): Formatter | null;
  getFormatter(formatOrDoc: vscode.TextDocument | FormatType): Formatter | null {
    const format = this.isFormatEnum(formatOrDoc) ? formatOrDoc : this.getType(formatOrDoc);
    if (format !== null) {
      return this._formats.get(format) ?? null;
    }
    return null;
  }

  private isFormatEnum(value: any): value is FormatType {
    return Object.values(FormatType).includes(value);
  }
}