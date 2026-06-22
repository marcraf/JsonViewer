# Quickstart and Verification: JSON Tree Visualizer

Este guia descreve como validar a funcionalidade do JSON Tree Visualizer após a implementação.

## 1. Pré-requisitos de Execução

Assegure que as dependências do monorepo estão instaladas e o servidor de desenvolvimento está rodando localmente:

```bash
# Executado a partir da raiz do repositório
npm install
npm run dev
```

Acesse a URL do painel administrativo (geralmente `http://localhost:5173/admin/json-visualizer`).

---

## 2. Cenários de Validação Manual

### Cenário 1: Formatação de JSON Válido
1. Acesse a página do formatador de JSON.
2. Cole a seguinte string no campo de texto de entrada:
   ```json
   {"name":"John Doe","age":30,"isActive":true,"roles":["admin","editor"],"address":{"city":"New York","zip":"10001"},"notes":null}
   ```
3. Clique em **Formatar**.
4. **Resultado Esperado**:
   - O texto na área de entrada é reformatado com recuo de 2 espaços e colorido de acordo com as especificações de cores dos tipos.
   - Nenhuma mensagem de erro é exibida.

### Cenário 2: Exibição da Árvore Interativa
1. Clique na aba **Visualização em Árvore**.
2. **Resultado Esperado**:
   - A árvore de objetos é exibida mostrando os nós principais: `name`, `age`, `isActive`, `roles`, `address` e `notes`.
   - Os nós `roles` (array) e `address` (objeto) devem exibir ícones de seta ao lado esquerdo e começar em estado recolhido ou padrão.
   - Clique na seta ao lado de `address`. As chaves `city` e `zip` devem deslizar/surgir logo abaixo.

### Cenário 3: Validação de Erros de Sintaxe
1. Insira o seguinte JSON com erro de sintaxe (falta aspas na chave `age` e uma vírgula):
   ```json
   {
     "name": "John Doe"
     age: 30
   }
   ```
2. Clique em **Formatar**.
3. **Resultado Esperado**:
   - Um painel de alerta vermelho surge abaixo do botão indicando que o JSON é inválido e apontando a linha/posição do erro.
   - O sistema impede a navegação para a aba "Visualização em Árvore" até que o JSON seja corrigido.

### Cenário 4: Busca e Destaque de Nós
1. Com o JSON válido carregado na árvore, digite `New York` no campo de busca.
2. **Resultado Esperado**:
   - O nó `address` se expande automaticamente se estivesse recolhido.
   - O valor `New York` é realçado visualmente com fundo amarelo.

---

## 3. Verificação Automatizada

### Testes Unitários e Integração (Vitest)
Execute os testes específicos da feature:
```bash
npm run test -- frontend/src/features/json-visualizer/tests/
```
A cobertura de código para a pasta da funcionalidade deve ser superior a 80%.

### Testes E2E (Playwright)
Rode os testes end-to-end simulando a jornada do usuário no navegador:
```bash
npx playwright test tests/e2e/json-visualizer.spec.ts
```
