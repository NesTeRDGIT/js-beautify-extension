import * as vscode from 'vscode';
import { FormatType } from './FormatType';
import { FormattingFunction } from './FormattingFunction';

/** Форматер */
export class Formatter {
    constructor(selector: vscode.DocumentSelector, format: FormatType, formatter: FormattingFunction) {
      this.selector = selector;
      this.formate = formatter;
      this.type = format;
    }
  
    /** Селектор документа */
    selector: vscode.DocumentSelector;

    /** Тип файла */
    type: FormatType;

    /** Функция форматирования */
    formate: FormattingFunction;
  }