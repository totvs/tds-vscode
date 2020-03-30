*Read this in other languages: [English](LOCALIZATION.md), [Portuguese](LOCALIZATION.pt-BR.md)*

# Localizing TDS-VSCode

Tds-vscode allows translation by two different ways.

## Translation using Transifex

Transifex is a proprietary and free globalization management system for Open Source projects.

* create translation user
* request access to the project: https://www.transifex.com/totvs/tds-vscode
* Open issue in the project https://github.com/totvs/tds-vscode/issues with the transifex user to be approved as a translator.

During all Releases the translations are updated.

## Tranbslation using Pull Request for Devs

### Generate "XLF" file

Generation of the XLF file for translation in any market application.

```
> mkdir totvs-tds
> cd tds-totvs
> git clone <branch dev>
> cd <branch dev>
> npm install
> npm install --global gulp-cli
> gulp clean
> gulp translations-export
```

The tds-vscode.xlf file will be generated in the directory "totvs-tds\tds-vscode-translations-export\vscode-extensions"

### Import translated "XLF" file.

Importing tds-vscode.xlf file, translated into any language.

```
> mkdir totvs-tds
> cd tds-totvs
> mkdir tds-vscode-import
> cd tds-vscode-import
> mkdir <language> (ru,pt-br,es)
(Copy tds-vscode.xlf to the directory)
> cd ../
> git clone <branch dev>
> cd <branch dev>
> npm install
> npm install --global gulp-cli
> gulp translations-import
```

The translation files will be updated.