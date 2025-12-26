# Encoding

As vezes encontramos um fonte que passou por edições e chegam com problemas de encoding. Geralmente observamos isso em uma sequência de caracteres estranhos nos comentários.

Mas é possível realizar umas conversões de encoding para que o tds-vscode consiga entender melhor os encodings e exibir o fonte corretamente.

Siga os passos a seguir para corrigir fontes que estão com problemas de encoding.

1. Caso não esteja aberto ainda, abra o fonte com problema, evitando passar o mouse sobre a área do editor, pois pode ocorrer o disparo do hover que pode ocasionando um erro. Caso um erro seja apresentado mesmo assim, clique em "Repetir" até que o erro não apareça mais. Se necessário você pode desabilitar a extensão do tds-vscode para realizar os conversões sem se preocupar com o erro e voltar a habilitar após as edições.

2. Clique no encoding do editor no rodapé, provavelmente esteja como "Windows 1252". Note que os comentário estão bagunçados por conta da leitura problemáticao do encoding.

<img width="1407" height="850" alt="Captura de tela 2025-10-09 141614" src="https://github.com/user-attachments/assets/d36ec8a2-f5ff-42a0-966d-1cc2df59bd80" />

3. Um menu será aberto na parte superior do editor. Clique em "Reopen with Encoding" e escolha o encoding "UTF-8".

<img width="228" height="120" alt="Captura de tela 2025-10-09 141708" src="https://github.com/user-attachments/assets/ebeef2af-1569-43db-b43f-63ef891e17d8" />

<img width="310" height="116" alt="Captura de tela 2025-10-09 141739" src="https://github.com/user-attachments/assets/72278229-f7e3-4834-b587-e6bbe628a91d" />

4. No rodapé agora deve aparecer o encoding "UTF-8" e os comentário devem estar "menos" bagunçados.

<img width="1407" height="850" alt="Captura de tela 2025-10-09 141800" src="https://github.com/user-attachments/assets/9a50ac26-0f70-4072-aefe-7f414b1d5b60" />

5. Clique novamente no encoding do editor no rodapé, mas desta vez escolha "Save with Encoding" e utilize o encoding "Western (Windows 1252)". O encoding será alterado no rodapé.

6. Caso os comentário ainda estejam estranhos, repita as operações reabrindo agora com encoding "Western European DOS (CP 850)".

<img width="349" height="122" alt="Captura de tela 2025-10-09 143814" src="https://github.com/user-attachments/assets/fab721a7-5923-4bef-a02a-ea5a288dd245" />

7. Geralmente os comentários eram realizados neste encoding. Salve com o encoding "Western (Windows 1252)" para deixar compatível com o enconding esperado para fontes TOTVS.

<img width="1407" height="850" alt="Captura de tela 2025-10-09 141937" src="https://github.com/user-attachments/assets/3ff5c1a3-cdf5-415e-b270-a4ee857891b1" />

8. A princípio erros e problemas de encoding não deveriam ocorrer mais após estas conversões de encoding.
