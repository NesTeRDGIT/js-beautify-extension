VSCode by default uses [js-beautify](https://github.com/beautifier/js-beautify) to format the code, but not all js-beautify settings can be edited in VSCode

This extension uses either the VSCode settings for the js-beautify configuration or the .jsbeautifyrc.json file. If the .jsbeautifyrc.json file is present in the project root, then the settings from .jsbeautifyrc will be used, if not, then the VSCode settings will be used
<br/>
<br/>
[Marketplace Visual Studio](https://marketplace.visualstudio.com/items?itemName=nesterenok.js-beautify-extentions)


## Usage
<p align="center">
    <img src="https://github.com/NesTeRDGIT/js-beautify-extension/blob/main/raw/DemoActivate.gif?raw=true" alt="DemoActivate"/>
</p>

## VSCode Settings
Matching VSCode settings to js-beautify settings<br />
<i>You can find VSCode parameters using the search bar in the VSCode settings window</i><br />

**for all:**<br />
<table>
    <tr>
        <th>js-beautify-parameter</th>
        <th>vs-code-parameter</th>
    </tr>
    <tr>
        <td>indent_with_tabs</td>
        <td>editor.insertSpaces</td>
    </tr>
    <tr>
        <td>indent_size</td>
        <td>editor.tabSize <a href="https://code.visualstudio.com/docs/editor/codebasics#_autodetection">#?</a>
        </td>
    </tr>
    <tr>
        <td>indent_char</td>
        <td>editor.insertSpaces(true - ' ' else - '\t')</td>
    </tr>
    <tr>
        <td>end_with_newline</td>
        <td>files.insertFinalNewline</td>
    </tr>
    <tr>
        <td>eol</td>
        <td>files.eol</td>
    </tr>
</table>

**html:**<br />
<table>
    <tr>
        <th>js-beautify-parameter</th>
        <th>vs-code-parameter</th>
    </tr>
    <tr>
        <td>templating</td>
        <td>js-beautify-for-vscode:html.templating</td>
    </tr>
    <tr>
        <td>extra_liners</td>
        <td>html.format.extraLiners</td>
    </tr>
    <tr>
        <td>indent_handlebars</td>
        <td>html.format.indentHandlebars</td>
    </tr>
    <tr>
        <td>indent_inner_html</td>
        <td>html.format.indentInnerHtml</td>
    </tr>
    <tr>
        <td>max_preserve_newlines</td>
        <td>html.format.maxPreserveNewLines</td>
    </tr>
    <tr>
        <td>preserve_newlines</td>
        <td>html.format.preserveNewLines</td>
    </tr>
    <tr>
        <td>wrap_attributes</td>
        <td>html.format.wrapAttributes</td>
    </tr>
    <tr>
        <td>unformatted</td>
        <td>html.format.unformatted</td>
    </tr>
    <tr>
        <td>wrap_line_length</td>
        <td>html.format.wrapLineLength</td>
    </tr>
</table>

**css**<br />

<table>
    <tr>
        <th>js-beautify-parameter</th>
        <th>vs-code-parameter</th>
    </tr>
    <tr>
        <td>templating</td>
        <td>js-beautify-for-vscode:css.templating</td>
    </tr>
</table>

**js**<br />

<table>
    <tr>
        <th>js-beautify-parameter</th>
        <th>vs-code-parameter</th>
    </tr>
    <tr>
        <td>templating</td>
        <td>js-beautify-for-vscode:js.templating</td>
    </tr>
    <tr>
        <td>space_after_anon_function</td>
        <td>javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions</td>
    </tr>
    <tr>
        <td>space_in_paren</td>
        <td>format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis</td>
    </tr>
</table>

## File Settings (.jsbeautifyrc.json)
    {
        html: HTMLBeautifyOptions,
        css: CSSBeautifyOptions,
        js: JSBeautifyOptions
    }
HTMLBeautifyOptions/CSSBeautifyOptions/JSBeautifyOptions are [js-beautify](https://github.com/beautifier/js-beautify) settings<br />
JSON Schema: [beautifyrc.json](https://github.com/NesTeRDGIT/js-beautify-extension/blob/main/schema/beautifyrc.json)

## Support for Angular control flow formatting
Set parameters: <br />
- js-beautify-for-vscode:html.templating = ['angular']<br />
- html.format.indentHandlebars = true<br />
<p align="center">
    <img src="https://github.com/NesTeRDGIT/js-beautify-extension/blob/main/raw/DemoActivateAngular.gif?raw=true" alt="DemoActivateAngular"/>
</p>