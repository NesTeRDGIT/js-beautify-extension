import * as vscode from 'vscode';
import { Formatters } from '../formatters/Formatters';
import { RangeValue } from './RangeValue';
import { IOptionsPersistent } from 'src/options/IOptionsPersistent';
import { Formatter } from 'src/formatters/Formatter';

/** Документ */
export class Document {
    private formatter: Formatter | null;

    constructor(private doc: vscode.TextDocument, formatters: Formatters, private optionsPersistent: IOptionsPersistent) {
        this.formatter = formatters.getFormatter(doc);
    }

    /** Получить диапозон всего текста  */
    getFullRange = () => this.doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));

    /** Форматировать весь документ */
    formatFullAsync = (): Promise<RangeValue | null> => {
        return new Promise<RangeValue | null>((resolve)=>{
            if (this.formatter) {
                const range = this.getFullRange();
                const text = this.doc.getText(range);
                this.optionsPersistent.getOptionAsync(this.formatter.type).then(options=>{
                    const formatText = this.formatter!.formate(text, options);
                    resolve({ range: range, text: formatText});
                });
            } else {
                resolve(null);
            }
        });
    }

     /** Форматировать выделение */
    formatSelection = (selections: vscode.Selection[] | vscode.Range[]): Promise<RangeValue[]> => {
        return new Promise<RangeValue[]>((resolve) => {
            if (this.formatter) {
                this.optionsPersistent.getOptionAsync(this.formatter.type).then((options) => {
                    const ranges = selections.filter(selection => !selection.isEmpty).map(range => {
                        const text = this.doc.getText(range);
                        const formatText = this.formatter!.formate(text, options);
                        return { range: range, text: formatText };
                    });
                    resolve(ranges);
                })
            } else {
                resolve([]);
            }
        });
    }
}