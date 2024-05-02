import { Options } from './../options/Options';
import * as vscode from 'vscode';
import { RangeValue } from './RangeValue';
import { Formatter } from 'src/formatters/Formatter';

/** Документ */
export class Document {
    private formatter: Formatter;

    constructor(private doc: vscode.TextDocument, formatter: Formatter) {
        this.formatter = formatter;
    }

    /** Получить диапазон всего текста  */
    getFullRange = () => this.doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));

    /** Форматировать весь документ */
    formatFullAsync = (options: Options): Promise<RangeValue | null> => {
        return new Promise<RangeValue | null>((resolve) => {
            if (this.formatter) {
                const range = this.getFullRange();
                const text = this.doc.getText(range);
                const formatText = this.formatter!.formate(text, options);
                resolve({ range: range, text: formatText });
            } else {
                resolve(null);
            }
        });
    }

     /** Форматировать выделение */
    formatSelection = (selections: vscode.Selection[] | vscode.Range[], options: Options): Promise<RangeValue[]> => {
        return new Promise<RangeValue[]>((resolve) => {
            const ranges = selections.filter(selection => !selection.isEmpty).map(range => {
                const text = this.doc.getText(range);
                const formatText = this.formatter!.formate(text, options);
                return { range: range, text: formatText };
            });
            resolve(ranges);
        });
    }
}