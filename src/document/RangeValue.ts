import * as vscode from 'vscode';

/** Диапазон с текстом */
export interface RangeValue {
    /** Диапазон */
    range: vscode.Range

    /** Текст */
    text: string
}