# API exportadas

Ao instalar a extensão tds-vscode é possível acessar as suas seguintes APIs exportadas.

Clique na API para mais detalhes.

<details>
<summary>
  generatePPO(filePath: string, options?: any): Promise&lt;string&gt;
</summary>

<br/>
Obtém o arquivo PPO correspondente referente ao arquivo informado.

| Parâmetro | Descrição |
| --------- | --------- |
| filePath: string | Caminho completo do arquivo a ser processado. |
| options?: any | encoding com o qual o retorno deve ser codificado. Se omitido, o padrão cp1252 será utilizado. |

| Retorno   | Descrição |
| --------- | --------- |
| Promise&lt;string&gt; | Conteúdo do PPO gerado. |

* O PPO será gerado com as mesmas características do arquivo compilado.
* Um servidor deve estar conectado para que o PPO seja gerado.
</details>
