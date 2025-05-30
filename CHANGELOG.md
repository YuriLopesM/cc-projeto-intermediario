# CHANGELOG

## [Release 0.2.0] - 29/05/2025

### Feature

- feat/changelog
  - Adicionado o arquivo CHANGELOG.md para controlar alterações no desenvolvimento.
- feat/tests
  - Criada pasta `__tests__` para inclusão dos testes unitários.
  - Criado suíte de testes para: 
    - health-center/index
    - health-center/appointments

### Refactor

- fix/refactor-register
  - Refatorado o componente `Register` para melhorar a legibilidade e organização do código.
  - Extraída a validação dos campos do formulário para a função `isFormDataValid`, que verifica se todos os campos obrigatórios estão preenchidos.
  - Criada a função `buildClientFromFormData` para construir o objeto `Client` a partir dos dados do formulário, centralizando a lógica de criação do objeto.
  - Substituído o cast direto para `BigInteger` por uma conversão segura para `Number` utilizando `Number()`.
  - Alterado o campo de número do endereço para `<input type="number">` com atributo `min` para melhor usabilidade e validação nativa.
  - Ajustado o JSX do formulário para melhorar a estrutura e legibilidade:
  - Uso de `defaultValue=""` e opção `disabled` para placeholders nos elementos `<select>`.
  - Melhoria na separação dos grupos de campos e na organização das classes CSS.
  - Removida repetição de código e simplificada a lógica do `onSubmit` do formulário.
  - Corrigido espaçamento e alinhamento das mensagens de erro.
- fix/refactor
  - Adiciona Prettier e ESLint para padronização do código.
  - Remove `env.js` e funcionalidades envolvendo backend dentro do frontend (express, handlers, etc.), substituindo por `localStorage` para facilitar o desenvolvimento e testes.
  - Adiciona configuração básica do Jest para testes unitários.
  - Adiciona `dayjs` para formatação e manipulação de datas.
  - Refatora/cria pastas para melhor organização do código:
    - actions -> services
    - builders (novo)
    - utils (novo)
    - mocks (novo)
  - Atualiza nomes dos arquivos para fazer mais sentido com a URL gerada (ex: `healthCenterRequest.tsx` para `new-appointment.tsx`).
  - Adiciona tipagens em um arquivo único no diretório `types`.
  - Adiciona builder para a criação do objeto `Schedule`, melhorando também os códigos ao redor da lógica de criação adicionando validações e separando melhor as funções.
  - Pasta `utils`:
    - Cria a função `generateId` para gerar IDs únicos.
    - Cria a função `generatePeriod` para gerar períodos de tempo com base na hora.
  - Remove `getStaticProps` do componente `ScheduleCards`, agora pegando as informações por meio de props.
  - Melhora legibilidade, organização e estrutura do código em diversas páginas.
  - Remove o submit na pesquisa do paciente na página `patient-search.tsx`, pois já estava sendo feito a filtragem ao digitar.
  - Remove o `selected` em `<option>` do campo de seleção, pois é depreciado.

