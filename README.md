# Serviço de Autenticação com AWS Cognito
Este projeto é um serviço de autenticação básico utilizando o AWS Cognito para gerenciamento de usuários e autenticação. O serviço inclui integração com a biblioteca de logger para controle eficiente de logs e utiliza o Prisma como ORM para o gerenciamento do banco de dados.
## Tecnologias Utilizadas
- Node.js
- TypeScript
- AWS Cognito
- Prisma (para gerenciamento de banco de dados)
- Biblioteca logger

## Funcionalidades
- Registro de novos usuários
- Listagem de usuários
- Autenticação de usuários (login)
- Integração com o AWS Cognito para gerenciamento de usuários
- Controle de logs com a biblioteca logger para rastrear atividades do sistema


## Pré-requisitos
Antes de começar, você precisará ter as seguintes ferramentas instaladas:

- Node.js (v14+)
- AWS CLI configurado com suas credenciais de acesso
- AWS Cognito já configurado na sua conta AWS
- Prisma instalado e configurado para o banco de dados
- Além disso, certifique-se de ter um arquivo .env com as seguintes variáveis:

## env
- `COGNITO_USER_POOL_ID=<ID do seu User Pool>`
- `COGNITO_CLIENT_ID=<ID do seu Cliente Cognito>`
- `COGNITO_REGION=<Região AWS>`
- `AWS_ACCESS_KEY_ID=`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASE_URL=<URL do banco de dados para o Prisma>`

## Instalação
Clone este repositório:
npm install
Configure o arquivo .env com suas credenciais do Cognito, conforme descrito na seção de pré-requisitos.

## Uso
Você pode iniciar o serviço de autenticação com o seguinte comando:
`npm run dev`

## Exemplo de Rotas
* Registrar usuário: POST `/create`
* Login de usuário: POST `/login`
* Excluir usuário: DELETE `/delete`
* Listagem de usuários: GET `/list`

## Logs
Os logs são gerenciados pela biblioteca logger, que salva as informações em diferentes níveis (info, warn, error). As configurações dos logs podem ser ajustadas no arquivo logger.js.
