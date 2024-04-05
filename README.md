VsCode by default uses [js-beautify](https://github.com/beautifier/js-beautify) to format the code, but not all js-beautify settings can be edited in VSCode

This extension uses either the VSCode settings for the js-beautify configuration or the .jsbeautifyrc.json file. If the .jsbeautifyrc.json file is present in the project root, then the settings from .jsbeautifyrc will be used, if not, then the VSCode settings will be used
<br/>
[Marketplace Visual Studio](https://marketplace.visualstudio.com/items?itemName=nesterenok.js-beautify-extentions)


## Using
<p align="center">
    <img src="https://github.com/NesTeRDGIT/js-beautify-extentions/blob/main/raw/DemoActivate.gif?raw=true" alt="DemoActivate"/>
</p>

## VSCode Settings
Matching VSCode settings to js-beautify settings<br />
<i>You can find VSCode parameters using the search bar in the VSCode settings window</i><br />

**for all:**<br />
| js-beautify-parameter  |  vs-code-parameter |
|---|---|
|indent_with_tabs|editor.insertSpaces
|indent_size|editor.tabSize [#?](https://code.visualstudio.com/docs/editor/codebasics#_autodetection)
|indent_char|editor.insertSpaces(true - ' ' else - '\t')
|end_with_newline|files.insertFinalNewline
|eol|files.eol

**html:**<br />
| js-beautify-parameter  |  vs-code-parameter |
|---|---|
|templating|js-beautify-for-vscode:html.templating
|extra_liners|html.format.extraLiners
|indent_handlebars|html.format.indentHandlebars
|indent_inner_html|html.format.indentInnerHtml
|max_preserve_newlines|html.format.maxPreserveNewLines
|preserve_newlines|html.format.preserveNewLines
|wrap_attributes|html.format.wrapAttributes
|unformatted|html.format.unformatted
|wrap_line_length|html.format.wrapLineLength

**css**<br />

| js-beautify-parameter  |  vs-code-parameter |
|---|---|
|templating|js-beautify-for-vscode:css.templating

**js**<br />
| js-beautify-parameter  |  vs-code-parameter |
|---|---|
|templating|js-beautify-for-vscode:js.templating
|space_after_anon_function|javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions
|space_in_paren|format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis

## .jsbeautifyrc.json
    {
        html: HTMLBeautifyOptions,
        css: CSSBeautifyOptions,
        js: JSBeautifyOptions
    }
HTMLBeautifyOptions/CSSBeautifyOptions/JSBeautifyOptions are [js-beautify](https://github.com/beautifier/js-beautify) settings

**Support for Angular control flow formatting:**
*set parameters:* <br />
js-beautify-for-vscode:html.templating = ['angular']<br />
html.format.indentHandlebars = true<br />
<p align="center">
    <img src="https://github.com/NesTeRDGIT/js-beautify-extentions/blob/main/raw/DemoActivateAngular.gif?raw=true" alt="DemoActivateAngular"/>
</p>