import { FormatType } from "../formatters/FormatType";
import { Options } from "./Options";

export interface IOptionsPersistent{
    /** Получить параметры */
    getOptionAsync(type: FormatType): Promise<Options>;

    /** Сбросить параметры */
    reset():void;
}
