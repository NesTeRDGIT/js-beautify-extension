VsCode by default uses [js-beautify](https://github.com/beautifier/js-beautify) to format the code, but not all js-beautify settings can be edited in VSCode

This extension uses either the VSCode settings for the js-beautify configuration or the .jsbeautifyrc.json file. If the .jsbeautifyrc.json file is present in the project root, then the settings from .jsbeautifyrc will be used, if not, then the VSCode settings will be used

## .jsbeautifyrc.json
    {
        html: HTMLBeautifyOptions,
        css: CSSBeautifyOptions,
        js: JSBeautifyOptions
    }
HTMLBeautifyOptions/CSSBeautifyOptions/JSBeautifyOptions are [js-beautify](https://github.com/beautifier/js-beautify) settings
## VSCode Settings
Matching VSCode settings to js-beautify settings<br />
mask: *[js-beautify-parameter] : [vs-code-parameter]*

**for all:**<br />
[indent_with_tabs]: [editor.insertSpaces];<br />
[indent_size]: [editor.tabSize];<br />
[indent_char]: [editor.insertSpaces(true - ' ' else - '\t')];<br />
[end_with_newline]: [files.insertFinalNewline];<br />
[eol]: [files.eol];<br />

**html:**<br />
[templating]: [js-beautify-for-vscode:html.templating];<br />
[extra_liners]: [html.format.extraLiners];<br />
[indent_handlebars]: [html.format.extraLiners];<br />
[indent_inner_html]: [html.format.indentInnerHtml];<br />
[max_preserve_newlines]: [html.format.maxPreserveNewLines];<br />
[preserve_newlines]: [html.format.preserveNewLines];<br />
[wrap_attributes]: [html.format.wrapAttributes];<br />
[unformatted]: [html.format.unformatted];<br />
[wrap_line_length]: [html.format.wrapLineLength];<br />

**css**<br />
[templating]: [js-beautify-for-vscode:css.templating];<br />

**js**<br />
[templating]: [js-beautify-for-vscode:css.templating];<br />
[space_after_anon_function]: [javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions];<br />
[space_in_paren]: [format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis];<br />

**Support for Angular control flow formatting:**
*set parameters:* <br />
[js-beautify-for-vscode:html.templating] = ['angular']<br />
[html.format.indentHandlebars]: true<br />