*Leia isto em outros idiomas: [Inglês](LOCALIZATION.md), [Português](LOCALIZATION.pt-BR.md)*

# Localizando TDS-VSCode

O tds-vscode permite a tradução de duas formas.

## Tradução via Transifex

Transifex é um sistema de gerenciamento da globalização proprietário e gratuito para projetos Open Source.

* criar usuário de tradução
* solicitar acesso no projeto: https://www.transifex.com/totvs/tds-vscode
* Abir issue no projeto https://github.com/totvs/tds-vscode/issues com o usuário do transifex a ser aprovado como tradutor.

Durante todas as Releases as traduções são atualizadas.

## Tradução via Pull Request para Devs

### Geração do arquivo "XLF"

Geração do arquivo XLF para tradução em qualquer aplicação de mercado.

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

O Arquivo tds-vscode.xlf será gerado no diretório "totvs-tds\tds-vscode-translations-export\vscode-extensions"

### Importação do arquivo "XLF" já traduzido.

Importação do arquivo tds-vscode.xlf, já traduzido para algum idioma.

```
> mkdir totvs-tds
> cd tds-totvs
> mkdir tds-vscode-import
> cd tds-vscode-import
> mkdir <idioma> (ru,pt-br,es)
(Copie o arquivo tds-vscode.xlf para o diretorio)
> cd ../
> git clone <branch dev>
> cd <branch dev>
> npm install
> npm install --global gulp-cli
> gulp translations-import
```

Os arquivos de traduções serão atulizados.
