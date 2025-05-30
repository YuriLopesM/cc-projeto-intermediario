# CHANGELOG

## [Release 0.2.0] - 29/05/2025

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
