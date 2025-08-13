Task Manager - Plano de implementação e backlog

Stack
- Angular 19 (standalone components)
- Angular Material
- json-server (mock API)

Como rodar
1) API mock
- Abra um terminal na pasta Backend
- Execute: npm run api
- Endpoints: http://localhost:3000/tasks

2) Frontend
- Abra outro terminal na pasta TaskManager
- Instale deps: npm install
- Instale Material compatível com Angular 19: npm install @angular/material@19 @angular/cdk@19 @angular/animations@19
- Rode: ng serve
- Acesse: http://localhost:4200

Arquitetura/estruturas
- src/app/core/models/task.model.ts: tipos Task e TaskStatus
- src/app/core/services/task.service.ts: CRUD via HttpClient contra /api/tasks
- src/app/features/tasks/*: telas de lista e formulário (standalone)
- src/app/app.routes.ts: rotas
- proxy src/proxy.conf.json -> redireciona /api para http://localhost:3000

Validações
- ReactiveForms com required e minlength
- Datepicker com [min] = hoje
- Mensagens de erro personalizadas em cada campo

Pendências e melhorias sugeridas
- Adicionar feedback visual: MatSnackBar para sucesso/erro
- Loading e Empty state na lista
- Paginação/filtro/ordenação (MatTableDataSource)
- Campo status como MatSelect com opções Pendente/Concluída
- Confirmação de exclusão com MatDialog
- Testes unitários para TaskService e componentes
- Acessibilidade (aria-labels, foco, contraste)
- i18n (pt-BR)
- Eslint/Prettier
- Husky + lint-staged
- Docker para backend mock
- Deploy (GitHub Pages / Vercel) usando build estático

Notas
- Execute ng add @angular/material para configurar tema automático (opcional).
- Em Windows PowerShell, use npm.cmd para contornar ExecutionPolicy.
