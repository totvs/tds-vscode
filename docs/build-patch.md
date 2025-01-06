# TDS: Geração de pacote de atualização (_patch_)

> Requisitos
>
> - servidor/ambiente conectado
>
> Recomenda-se que pastas e arquivos não contenham caracteres especiais e/ou acentuados e sempre em mínusculas de forma a manter a compatibildade entre os diversos sistemas operacionais suportados pelo **TDS-VSCode** e seus componentes.
> Leia [Convenção para nomenclatura de File System em ambiente Linux]<https://tdn.totvs.com/x/h8BICw>).

## Geração de pacote de atualização (_patch_) a partir do RPO

Na visão `Servers`, acione o menu de contexto no servidor conectado e acione `Patch Generation` ou acione o atalho `CTRL + SHIFT + P` e execute `TOTVS: Patch Generation`.

- Aguarde a carga dos arquivos do inspetor de objetos
- Selecione os arquivos que deseja colocar no pacote utilizando o campo de `Filtro`, digitando um padrão de seleção e pressione `Enter`
- Selecione os arquivos da lista da esquerda e mova-os para lista da direita utilizando o botão `>>`
- Repita o processo, até que tenha selecionado todos os arquivos necessários
- Selecione o `diretório` onde o pacote será salvo
- Escolha o `nome do arquivo` de Patch desejado. (Quando não informado, o patch será gerado com o nome do RPO).
- Efetue e geração do Patch pressionando o botão `Gerar`.

![Patch Generate](./gifs/GeneratePatchWizard.gif)

No lugar de selecionar os arquivos manualmente, é possível gerar o pacote a partir de uma pasta, acionando o menu de contexto sobre a pasta e acionando `Generate Patch From Folder`. Também é possível gerar o pacote a partir de uma lista de fontes, importando um arquivo no formato TXT, onde cada linha é identifica um arquivo-fonte e este deve existir no RPO. Linhas iniciadas com `#` são ignoradas.

## Geração de pacote de atualização (_patch_) a partir de pastas (_From Folder_)

- Acione o menu de contexto sobre a pasta que contem os fontes a serem empacotados e acione `Generate Patch From m Folder)`
- Selecione uma pasta para salvar o pacote gerado
- Informe o nome do pacote que será gerado. Quando não informado, o pacote terá o mesmo do RPO, exceto pela extensão
- Após as confirmações, o pacote será gerado na pasta indicada

![Patch Generate Folder](./gifs/GeneratePatchWizardFromFolder.gif)
