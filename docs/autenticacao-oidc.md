# Autenticação OIDC

A extensão suporta o processo de autenticação utilizando OIDC (OpenID Connect), oferecendo uma forma segura e facilitada de acessar o servidor.

O servidor possui duas ações principais para realizar o acesso: **Connect** (Conectar) e **Reconnect** (Reconectar).

## Como funciona o Acesso

### 1. Primeiro Login
Ao utilizar a opção **Connect**, o sistema iniciará o processo de autenticação. Se for a primeira vez que você está se conectando com o seu usuário, o sistema solicitará as requintes informações:
- **Ambiente**
- **Nome de usuário**
- **Senha**

### 2. Próximos Acessos
Nas próximas vezes em que você for se conectar, ao identificar que o seu usuário deve utilizar o OIDC, o sistema **não pedirá mais a sua senha**. A validação da senha será feita pelo processo do OIDC automaticamente.

*Atenção:* O **Ambiente** e o **Nome de usuário** sempre serão requisitados, pois essas duas informações são necessárias para o sistema verificar se o seu usuário específico foi configurado para utilizar a autenticação via OIDC.

## Como Limpar o Token OIDC
Caso precise renovar a sua autenticação do zero (por exemplo, ao trocar de senha ou caso queira forçar um novo login completo), você pode limpar o token armazenado.

Para fazer isso:
1. Na lista de servidores, clique com o **botão direito** sobre o servidor desejado.
2. Selecione a opção **"Limpar Token OIDC"**.

Isso fará com que o sistema volte a exigir a sua senha na próxima conexão, exatamente como se fosse a primeira vez que você estivesse logando.

## Autenticação Tradicional (Sem OIDC)
Se o seu usuário não estiver configurado para utilizar a validação pelo OIDC, não haverá problemas. O sistema usará de forma automática o processo clássico de autenticação do Protheus, funcionando normalmente como de costume.
