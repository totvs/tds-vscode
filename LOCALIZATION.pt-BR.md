*Também disponível em [Inglês](LOCALIZATION.md), [Português](LOCALIZATION.pt-BR.md)*

# Tradução TDS-VSCode

O TDS-VSCODE utiliza como idioma padrão o inglês e necessitamos de colaboração para tradução e revisão do material traduzido, que podem ser:


- arquivos de textos, identificados com a extensão ``MD``;
- mensagens e textos utilizados nos arquivos-fonte.

*A revisão pode ser ortográfica, gramátical e de procedimentos. Faça aquela que você se sentir mais confortável.*

## Tradução ou revisão de textos (arquivos de textos)

### Procedimentos

* Clone o projeto TDS-VSCode, preferencialmente o ramo ``Dev``. Opcionalmente, transfira-o para sua estação de trabalho;
* Duplique o arquivo a ser traduzido conforme o ambiente (_web_ ou _local_), adicionando a extensão ``.<locale>.MD``. Onde, ``<locale>`` é o código do idioma de [suportado pelo VSCode](https://code.visualstudio.com/docs/getstarted/locales#_available-locales);
* Abra o arquivo para edição conforme o ambiente;
* Faça a tradução ou a revisão;
* Ao final do processo:
  - Se o ambiente for local, confirme as modificações efetuadas;
  - Solicite a reintegração do seu clone ao projeto original.

### Recomendações a tradutores e revisores

* Evite o uso de termos estrangeiros. Utilize-o somente quando não há uma tradução ou para melhorar o entendimento, colocando-o em itálico ou traduzindo e colocando o original entre parenteses. Por exemplo, "mouse click" fica "acione o _mouse_" ou "acione o rato (_mouse_)";
* Antes de iniciar a tradução, leia os textos já traduzidos por outros colaboradores. Dessa forma, você se acostuma com os termos utilizados e mantemos um padrão de linguagem;
* Em caso de ligações (_links_), verifique se há um arquivo com a tradução para o idioma sendo trabalho e ajuste-o, caso contrário, mantenha o original;
* Não traduza comandos ou códigos. Normalmente estes estarão no formatados como código, que é indicado pela marcação ``;
* Não traduza nomes de produtos, usuários, marcas e outros similares, exceto se orientado a isso.
* Os nomes dos arquivos e pastas, devem ser sempre em inglês.
* Ao usar siglas que se repetem no texto, na primeira ocorrência desta, coloque-a por extenso e a sigla entre parenteses. Por exemplo, "O Repositórios de Objetos Protheus (RPO, do inglês _Repository Protheus Objects_) é utilizado para...".
* Sempre que possível, ajuste o texto as normas cultas do idioma.
* Em caso de numerais, utilize as regras/recomendações do idioma de trabalho. No caso do português, números (cardinais ou ordinais) até dez, cem, mil, em inicio de frases e fracionários (dois terço, um quarto), devem ser por extenso.
* Em mensagens para tradução, pode aparecer um número entre chaves, p.e. ``{0} attribute required.``. Essas chaves indicam que é um argumento que será utilizado na apresentação final e deve ser considerada na tradução e colocada na posição correta do texto traduzido.

## Tradução ou revisão de mensagens e textos (arquivos fontes)

### Procedimentos para tradutores ou revisores

* Acessar o sítio [Transifex](https://www.transifex.com). _Transifex_ é um sistema de gerenciamento da globalização proprietário e gratuito para projetos de código aberto (_Open Source_);
* Criar usuário de tradução;
* Solicitar acesso ao projeto [TDS-VSCode](https://www.transifex.com/brodao/tds-vscode-brodao), com perfil de tradutor e/ou revisor;
* Após receber notificação que o acesso foi liberado, escolha um idioma e inicie os trabalhos de tradução e/ou revisão.
* Caso seu idioma não esteja disponível, abra um [chamado](https://github.com/totvs/tds-vscode/issues) que analisaremos sua solicitação.

As traduções efetuadas ou revisadas, serão publicadas na próxima liberação (_release_) da extensão **TDS-VSCode**.

### Procedimentos para desenvolvedores

* Clone o projeto TDS-VSCode do ramo ``Dev``, transfira-o para sua estação de trabalho e finalize a configuração do ambiente;
```bat
> npm install --global gulp-cli
> md tds-totvs
> cd tds-totvs
> git clone <branch dev>
> cd <branch dev>
> npm install
```
* Dê sua contribuição ao código da extensão. Atente-se as recomendações;
* Acessar o sítio [Transifex](https://www.transifex.com);
* Criar usuário de tradução;
* Solicitar acesso ao projeto [TDS-VSCode](https://www.transifex.com/brodao/tds-vscode-brodao), com perfil de coordenador de tradução;
> O perfil de coordenador é rigidamente controlado, portando seu acesso pode ser negado.
* Após receber notificação que o acesso não foi liberado:
  - Confirme as modificações efetuadas;
  - Solicite a reintegração do seu clone ao projeto original;
  - E o aprovador da sua solicitação de reintegração, cuidará do restante do processo.
* Após receber notificação que o acesso foi liberado:
  - Crie uma chave de acesso a [API Transifex](https://docs.transifex.com/account/authentication);
  - Instale o programa de transferência de arquivo [TX](https://docs.transifex.com/client/installing-the-client);
  - Edite o arquivo ``.transifexrc`` e informe seu _token_ na chave ``password``.
  - Gere e publique o arquivo de tradução no formato de arquivo de intercâmbio XML (XLIFF, do inglês _XML Interchange File Format_):
    ```bat
    cd <branch dev>
    gulp build
    gulp export-i18n
    gulp transifex-upload
    ```
  - Transfira para o seu ambiente local os arquivos de tradução XLIFF e importe-os:
    ```bat
    cd <branch dev>
    gulp transifex-download
    gulp 18n-import
    gulp build
    ```
  - Confirme as modificações efetuadas;
  - Solicite a reintegração do seu clone ao projeto original.

* Caso seu idioma não esteja disponível, abra um [chamado](https://github.com/totvs/tds-vscode/issues) que analisaremos sua solicitação.

### Recomendações ao desenvolvedor

* O idioma padrão é o inglês, portanto qualquer _string_ deverá ser escrita em inglês, independente se será traduzida ou não;
* Todas as _strings_ a serem traduzidas deverão ser utilizadas com a função [``localize``](https://github.com/microsoft/vscode-nls);
* Procure utilizar texto genéricos e se necessário com argumentos. Por exemplo, no lugar de escrever:
  ```typescript
  ...
  if (productCode === '') {
	  msgErro.push(localize("productCode", "Required product code."))
  }
  if (productName === '') {
	  msgErro.push(localize("productName", "Required product name."))
  }
  console.log(`Validation with ${msgErro.length} errors`);
  ...
  ```
  Escreva:
  ```typescript
  ...
  if (productCode === '') {
	  msgErro.push(localize("ATTRIBUTE_REQUIRED", "{0} attribute required.", localize("productCode", "Product Code")));
  }
  if (productName === '') {
	  msgErro.push(localize("ATTRIBUTE_REQUIRED", "{0} attribute required.", localize("productName", "Product Name")));
  }
  console.log(localize("ERROR_LEN","Validation with {0} errors", msgErro.length);
  ...
  ```
- Em textos mais longos, deve-se usar o ``localiza`` por parágrafo;
- Não use variáveis de qualquer tipo ou escopo, no lugar da _string_ a ser traduzida. Por exemplo:
  ```typescript
  const ATT_REQ = "{0} attribute required.";
  ...
  if (productCode === '') {
	  msgErro.push(localize("ATTRIBUTE_REQUIRED", ATT_REQ, localize("productCode", "Product Code")));
  }
  if (productName === '') {
	  msgErro.push(localize("ATTRIBUTE_REQUIRED", ATT_REQ, localize("productName", "Product Name")));
  }
  ...
  ```
  O trecho de código acima está errado e não funcionará no processo de tradução. O correto é:
  ```typescript
  const ATT_REQ = (attribute) =>  localize("ATTRIBUTE_REQUIRED", "{0} attribute required.", attribute);
  ...
  if (productCode === '') {
	  msgErro.push(ATT_REG(localize("productCode", "Product Code")));
  }
  if (productName === '') {
	  msgErro.push(ATT_REQ(localize("productName", "Product Name")));
  }
  ...
  ```

## Extensões VSCode de apoio (somente local)

Estas extensões podem ajudá-lo no processo:

* [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) e a extensão com o dicionário para o idioma sendo trabalhado.
* [VSCode Google Translate](https://marketplace.visualstudio.com/items?itemName=funkyremi.vscode-google-translate).