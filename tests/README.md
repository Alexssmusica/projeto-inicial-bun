# Testes

Este diretório contém os testes unitários e de integração do projeto.

## Estrutura

```
tests/
├── unit/              # Testes unitários
│   ├── user.entity.test.ts
│   ├── errors.test.ts
│   ├── create-user.use-case.test.ts
│   ├── get-user-by-id.use-case.test.ts
│   ├── list-users.use-case.test.ts
│   └── delete-user-by-id.use-case.test.ts
├── integration/       # Testes de integração
│   ├── user.controller.test.ts
│   ├── user.routes.test.ts
│   └── drizzle-user.repository.test.ts
└── helpers/           # Helpers e mocks
    ├── mock-user-repository.ts
    └── test-utils.ts
```

## Executando os Testes

### Todos os testes
```bash
bun test
```

### Apenas testes unitários
```bash
bun test:unit
```

### Apenas testes de integração
```bash
bun test:integration
```

### Modo watch (re-executa ao salvar)
```bash
bun test:watch
```

## Testes Unitários

Os testes unitários testam componentes isolados sem dependências externas:

- **Entities**: Testam a lógica de domínio das entidades
- **Use Cases**: Testam a lógica de negócio usando mocks
- **Errors**: Testam as classes de erro customizadas

### Mocks

- `MockUserRepository`: Implementação em memória do repositório para testes

## Testes de Integração

Os testes de integração testam a interação entre componentes:

- **Controllers**: Testam a orquestração entre use cases
- **Routes**: Testam os endpoints HTTP completos
- **Repository**: Testam a integração com o banco de dados real

### Requisitos para Testes de Integração

Os testes de integração requerem:
- Banco de dados PostgreSQL configurado
- Variável de ambiente `DATABASE_URL` definida
- O banco será limpo antes e depois de cada teste

## Helpers

### `mock-user-repository.ts`
Implementação em memória do `IUserRepository` para testes unitários.

### `test-utils.ts`
Funções utilitárias para criar dados de teste:
- `createMockUser()`: Cria um usuário mock
- `sleep()`: Função para delays em testes
