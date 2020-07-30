*Also available in [Inglês](LOCALIZATION.md), [Português](LOCALIZATION.pt-BR.md)*

# Translation TDS-VSCode

The TDS-VSCODE uses English as the default language and we need collaboration for translation and revision of the translated material, which can be:

- text files, identified with the extension ``MD``;
- messages and texts used in the source files.

* The review can be orthographic, grammatical and procedural. Make the one you feel most comfortable with. *

## Translation or review of texts (text files)

### Procedures

* Clone the TDS-VSCode project, preferably the `` Dev`` branch. Optionally, transfer it to your workstation;
* Duplicate the file to be translated according to the environment (_web_ or _local_), adding the extension ``.<locale>.MD``. Where, ``<locale>`` is the language code of [supported by VSCode] (https://code.visualstudio.com/docs/getstarted/locales#_available-locales);
* Open the file for editing according to the environment;
* Do the translation or review;
* At the end of the process:
  - If the environment is local, confirm the changes made;
  - Request the reintegration of your clone to the original project.

### Recommendations to translators and reviewers

* Avoid using foreign terms. Use it only when there is no translation or to improve understanding, italicizing or translating and placing the original in parentheses. For example, "mouse click" is "acione o _mouse_" or "acione o rato (_mouse_)";
* Before starting the translation, read the texts already translated by other collaborators. That way, you get used to the terms used and maintain a language standard;
* In case of links (_links_), check if there is a file with the translation for the language being work and adjust it, otherwise, keep the original;
* Do not translate commands or codes. Usually these will be in the formatted as code, which is indicated by the mark ``;
* Do not translate names of products, users, brands and the like, unless directed to do so.
* The names of files and folders must always be in English.
* When using acronyms that are repeated in the text, in the first occurrence of this, put it in full and the acronym in parentheses. For example, "The Protheus Object Repositories (RPO, _Repository Protheus Objects_) is used for ...".
* Whenever possible, adjust the text to the learned standards of the language.
* In the case of numerals, use the rules/recommendations of the working language. In the case of Portuguese, numbers (cardinal or ordinal) up to ten, one hundred, one thousand, at the beginning of sentences and fractional numbers (two thirds, one quarter), must be in full.
* In messages for translation, a number can appear between braces, e.g. ``{0} attribute required.``. These keys indicate that it is an argument that will be used in the final presentation and should be considered in the translation and placed in the correct position of the translated text.

## Translation or review of messages and texts (source files)

### Procedures for translators or reviewers

* Access the [Transifex] website (https://www.transifex.com). _Transifex_ is a proprietary and free globalization management system for open source projects (_Open Source_);
* Create translation user;
* Request access to the [TDS-VSCode] project (https://www.transifex.com/brodao/tds-vscode-brodao), with a translator and/or reviewer profile;
* After receiving notification that access has been granted, choose a language and start the translation and/or review work.
* If your language is not available, open a [ticket] (https://github.com/totvs/tds-vscode/issues) and we will review your request.

The translated or revised translations will be published in the next release of the **TDS-VSCode** extension.

### Procedures for developers

* Clone the TDS-VSCode project from the `` Dev`` branch, transfer it to your workstation and finish setting up the environment;
`` bat
> npm install --global gulp-cli
> md tds-totvs
> cd tds-totvs
> git clone <branch dev>
> cd <branch dev>
> npm install
``
* Give your contribution to the extension code. Pay attention to the recommendations;
* Access the [Transifex] website (https://www.transifex.com);
* Create translation user;
* Request access to the [TDS-VSCode] project (https://www.transifex.com/brodao/tds-vscode-brodao), with a translation coordinator profile;
> The coordinator profile is strictly controlled, so access can be denied.
* After receiving notification that access has not been released:
  - Confirm the changes made;
  - Request the reintegration of your clone to the original project;
  - And the approver of your request for reinstatement, will take care of the rest of the process.
* After receiving notification that access has been released:
  - Create an access key to [API Transifex] (https://docs.transifex.com/account/authentication);
  - Install the file transfer program [TX] (https://docs.transifex.com/client/installing-the-client);
  - Edit the file `` .transifexrc`` and enter your _token_ in the key `` password``.
  - Generate and publish the translation file in the XML interchange file format (XLIFF, from the English _XML Interchange File Format_):
    `` bat
    cd <branch dev>
    gulp build
    gulp export-i18n
    gulp transifex-upload
    ``
  - Transfer the XLIFF translation files to your local environment and import them:
    `` bat
    cd <branch dev>
    gulp transifex-download
    gulp 18n-import
    gulp build
    ``
  - Confirm the changes made;
  - Request the reintegration of your clone to the original project.

* If your language is not available, open a [ticket] (https://github.com/totvs/tds-vscode/issues) and we will review your request.

### Recommendations to the developer

* The default language is English, so any _string_ must be written in English, regardless of whether it will be translated or not;
* All _strings_ to be translated must be used with the function [`` localize``] (https://github.com/microsoft/vscode-nls);
* Try to use generic text and if necessary with arguments. For example, instead of writing:
  `` typescript
  ...
  if (productCode === '') {
msgErro.push (locate ("productCode", "Required product code."))
  }
  if (productName === '') {
msgErro.push (find ("productName", "Required product name."))
  }
  console.log (`Validation with $ {msgErro.length} errors`);
  ...
  ``
  Write:
  `` typescript
  ...
  if (productCode === '') {
msgErro.push (locate ("ATTRIBUTE_REQUIRED", "{0} attribute required.", locate ("productCode", "Product Code")));
  }
  if (productName === '') {
msgErro.push (locate ("ATTRIBUTE_REQUIRED", "{0} attribute required.", locate ("productName", "Product Name")));
  }
  console.log (find ("ERROR_LEN", "Validation with {0} errors", msgErro.length);
  ...
  ``
- In longer texts, you must use the ``localize`` per paragraph;
- Do not use variables of any type or scope, instead of the _string_ to be translated. For example:
  `` typescript
  const ATT_REQ = "{0} attribute required.";
  ...
  if (productCode === '') {
msgErro.push (locate ("ATTRIBUTE_REQUIRED", ATT_REQ, locate ("productCode", "Product Code")));
  }
  if (productName === '') {
msgErro.push (locate ("ATTRIBUTE_REQUIRED", ATT_REQ, locate ("productName", "Product Name")));
  }
  ...
  ``
  The code snippet above is wrong and will not work in the translation process. The correct is:
  `` typescript
  const ATT_REQ = (attribute) => locate ("ATTRIBUTE_REQUIRED", "{0} attribute required.", attribute);
  ...
  if (productCode === '') {
msgErro.push (ATT_REG (locate ("productCode", "Product Code")));
  }
  if (productName === '') {
msgErro.push (ATT_REQ (find ("productName", "Product Name")));
  }
  ...
  ``

## Support VSCode extensions (local only)

These extensions can help you in the process:

* [Code Spell Checker] (https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) and the dictionary extension for the language being worked on.
* [VSCode Google Translate] (https://marketplace.visualstudio.com/items?itemName=funkyremi.vscode-google-translate).