import { FormatType } from "../formatters/FormatType";
import { IOptionsPersistent } from "./IOptionsPersistent";
import { Options } from "./Options";
import { JSBeautifyOptions, HTMLBeautifyOptions, CSSBeautifyOptions } from 'js-beautify';
import * as fs from 'fs';

/** Хранилище параметров в файлах */
export class OptionsFilePersistent implements IOptionsPersistent {
    private optionsMap?: Map<FormatType, Options>;
    private _filename: string;

    constructor(filename: string) {
        this._filename = filename;
    }
    
    get filename():string {
        return this._filename;
    }
    
    reset(): void;
    reset(filename?:string): void {
        if(filename){
            this._filename = filename;
        }
        this.optionsMap = undefined;
    }

    getOptionAsync = (type: FormatType): Promise<Options> => {
        return new Promise<Options>((resolve) => {
            if (this.optionsMap) {
                resolve(this.optionsMap.has(type) ? this.optionsMap.get(type)! : {});
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
            fs.readFile(this._filename, 'utf8', (e, data) => {
                const optionFromFile: JsBeautifyOptionFile = JSON.parse(data);
                this.optionsMap = new Map();
                this.optionsMap.set(FormatType.js, optionFromFile.js);
                this.optionsMap.set(FormatType.css, optionFromFile.css);
                this.optionsMap.set(FormatType.html, optionFromFile.html);
                resolve();
            })
        })
    }
}

/** Формат файла .jsbeautifyrc */
export interface JsBeautifyOptionFile {
    html: HTMLBeautifyOptions;
    js: JSBeautifyOptions;
    css: CSSBeautifyOptions;
}