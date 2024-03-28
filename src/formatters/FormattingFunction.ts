/** Функция форматирования
 * @source_text - сходный текст
 * @options - параметры
 */
export type FormattingFunction = (source_text: string, options?: js_beautify.CoreBeautifyOptions) => string;
