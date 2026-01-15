# User Management API

API REST para gerenciamento de usuários construída com Elysia, Bun e PostgreSQL, seguindo os princípios da Clean Architecture.

## 🏗️ Arquitetura

Este projeto utiliza **Clean Architecture (Arquitetura Hexagonal)**, organizando o código em camadas bem definidas:

```
src/
├── domain/           # Camada de Domínio (regras de negócio puras)
│   ├── entities/     # Entidades do domínio
│   └── ports/        # Interfaces/Contratos (portas)
├── application/      # Camada de Aplicação (casos de uso)
│   ├── dtos/         # Data Transfer Objects
│   ├── errors/       # Erros customizados da aplicação
│   └── use-cases/    # Casos de uso da aplicação
├── infrastructure/   # Camada de Infraestrutura (implementações)
│   └── database/     # Implementações de banco de dados
└── presentation/     # Camada de Apresentação (HTTP/API)
    └── http/         # Controllers, Routes e Middlewares
```

### Princípios da Arquitetura

- **Domain**: Contém as regras de negócio puras, sem dependências externas
- **Application**: Contém os casos de uso e lógica de aplicação
- **Infrastructure**: Implementações concretas (banco de dados, APIs externas, etc.)
- **Presentation**: Interface HTTP, controllers e rotas

## 🚀 Tecnologias e Frameworks

### Runtime e Framework Web
- **[Bun](https://bun.sh/)** - Runtime JavaScript/TypeScript de alta performance
- **[Elysia](https://elysiajs.com/)** - Framework web minimalista e performático para Bun
- **[@elysiajs/openapi](https://elysiajs.com/plugins/openapi)** - Geração automática de documentação OpenAPI

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe e leve
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Ferramentas de migração e gerenciamento de schema

### Validação e Tipagem
- **[Zod](https://zod.dev/)** - Validação de schemas e tipos em runtime
- **TypeScript** - Tipagem estática

### Ferramentas de Desenvolvimento
- **[Biome](https://biomejs.dev/)** - Linter e formatter rápido (substitui ESLint + Prettier)
- **[UUID](https://www.npmjs.com/package/uuid)** - Geração de identificadores únicos

## 📦 Estrutura do Projeto

### Domain Layer
- **Entities**: Entidades do domínio com regras de negócio
- **Ports**: Interfaces que definem contratos (ex: `IUserRepository`)

### Application Layer
- **DTOs**: Objetos de transferência de dados
- **Use Cases**: Lógica de negócio da aplicação
  - `CreateUserUseCase`
  - `ListUsersUseCase`
  - `GetUserByIdUseCase`
  - `DeleteUserByIdUseCase`
- **Errors**: Erros customizados da aplicação

### Infrastructure Layer
- **Database Adapters**: Implementações concretas dos repositórios
- **Drizzle**: Configuração e schemas do banco de dados

### Presentation Layer
- **Controllers**: Orquestram as requisições HTTP
- **Routes**: Definem os endpoints da API
- **Middlewares**: Tratamento de erros e validações

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev              # Inicia o servidor em modo watch

# Banco de Dados
bun run db:setup         # Configura o banco de dados
bun run db:push          # Faz push do schema para o banco
bun run db:studio        # Abre o Drizzle Studio

# Code Quality
bun run lint             # Executa o linter
bun run lint:fix         # Corrige problemas do linter
bun run format           # Formata o código
bun run format:check     # Verifica formatação
bun run check            # Executa lint + format
bun run check:fix        # Corrige lint + format
```

## 🚦 Como Executar

### Pré-requisitos
- [Bun](https://bun.sh/) instalado
- PostgreSQL em execução
- Variável de ambiente `DATABASE_URL` configurada

### Instalação

```bash
# Instalar dependências
bun install

# Configurar banco de dados
bun run db:push

# Iniciar servidor de desenvolvimento
bun run dev
```

O servidor estará disponível em `http://localhost:3000` (ou na porta definida em `Bun.env.PORT`).

## 📝 Endpoints da API

### Usuários
- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário por ID
- `POST /users` - Cria um novo usuário
- `DELETE /users/:id` - Remove um usuário

### Documentação
- A documentação OpenAPI está disponível automaticamente através do plugin `@elysiajs/openapi`

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database
PORT=3000
```

### TypeScript Path Aliases
O projeto utiliza path aliases configurados no `tsconfig.json`:
- `@/*` → `src/*`

Exemplo: `import { User } from '@/domain/entities/user.entity'`

## 📚 Conceitos Aplicados

- **Clean Architecture**: Separação clara de responsabilidades
- **Dependency Inversion**: Dependências apontam para abstrações (ports)
- **SOLID Principles**: Especialmente Single Responsibility e Dependency Inversion
- **Type Safety**: TypeScript + Zod para validação em runtime
- **Error Handling**: Tratamento centralizado de erros com middlewares
