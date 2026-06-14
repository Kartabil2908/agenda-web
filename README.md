# Agenda Web - Material Educacional

Sistema de Agenda Web para demonstrar um ciclo completo de desenvolvimento: aplicação full-stack, versionamento, testes, containers, CI/CD e deploy no Render.

## Aplicação em Produção

- Frontend publicado no Render: https://agenda-frontend-efkv.onrender.com
- Pipeline no GitHub Actions: https://github.com/Kartabil2908/agenda-web/actions

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Backend | Java 17 + Spring Boot 3.2 |
| Frontend | React 18 + React Router |
| Banco de Dados | PostgreSQL 15 |
| Build Backend | Maven |
| Build Frontend | Node.js 20 + npm |
| Versionamento | Git + GitHub |
| CI/CD | GitHub Actions |
| Containers | Docker + Docker Compose |
| Produção | Render Web Service + Render Static Site + Render PostgreSQL |

## Estrutura do Projeto

```text
agenda-web/
├── backend/                 # API REST (Java/Spring Boot)
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
├── frontend/                # UI (React)
│   ├── package.json
│   ├── Dockerfile
│   └── src/
├── .github/workflows/
│   └── ci-cd.yml            # Pipeline de testes, build e aceitação
├── docker-compose.yml       # Ambiente local completo
├── render.yaml              # Blueprint do Render
└── apresentacao_completa.html
```

## Como Executar em Desenvolvimento

```bash
docker compose up -d
```

- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- Swagger: http://localhost:8080/swagger-ui.html

## Como Executar Testes

```bash
# Backend (JUnit 5, Mockito e Testcontainers/PostgreSQL)
cd backend
mvn test

# Frontend (Jest)
cd frontend
npm install
npm test -- --coverage --watchAll=false
```

## CI/CD e Render

O workflow `.github/workflows/ci-cd.yml` roda na branch `deploy` e pode ser acompanhado em:

```text
https://github.com/Kartabil2908/agenda-web/actions
```

Ele executa:

1. Testes unitários e de integração do backend.
2. Testes e build do frontend.
3. Build Docker e testes de aceitação com `docker compose`.

O deploy é feito pelo Render a partir do `render.yaml`. Os serviços usam `autoDeployTrigger: checksPass`, então o Render publica backend e frontend somente depois que os checks do GitHub Actions passam.

No Render, os logs de deploy ficam em:

- `agenda-backend` > Events / Logs
- `agenda-frontend` > Events / Logs

## Divisão de Trabalho

- **Alessandra Faria:** CRUD de Contatos, incluindo model, repository, controller, telas React e testes unitários.
- **Gabriela Reis:** CRUD de Compromissos, incluindo model, repository, controller, vínculo com contatos, telas React e testes.
- **Bernardo Kartabil:** infraestrutura, Dockerfiles, Docker Compose, CI/CD no GitHub Actions, Blueprint do Render, health checks e documentação de deploy.

## Apresentação

Abra `apresentacao_completa.html` no navegador para ver a apresentação completa do trabalho.
