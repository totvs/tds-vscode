# Instruções do projeto TDS-VSCode

## Encoding dos fontes

- Todos os fontes AdvPL/TLPP/4GL (`.prw`, `.tlpp`, `.prx`, `.4gl` e variantes) devem estar em **cp1252 (Windows-1252)**, nunca em UTF-8.
- Ao criar ou editar fontes, preservar a acentuação em cp1252 (ex.: `ã`=0xE3, `ç`=0xE7, `é`=0xE9, `ó`=0xF3).
- **Nunca** salvar fontes como UTF-8: isso corrompe os acentos e gera o caractere de substituição U+FFFD (bytes `EF BF BD`).
- Os fontes de teste em `test/resources/projects/advpl/files/formatter` seguem esta convenção.
