# Troubleshooting de Testes

Este documento aborda problemas comuns encontrados durante a execução dos testes e suas respectivas soluções.

## 🚨 Problemas Comuns

### 1. Erro: "Cannot resolve module 'shared/...'"

**Sintoma:**
```bash
Cannot resolve module 'shared/components/ui/Button' from '...'
```

**Causa:** Configuração incorreta do moduleNameMapper no Jest.

**Solução:**
1. Verifique se o `jest.config.js` está correto:
```javascript
module.exports = {
  moduleNameMapper: {
    '^shared/(.*)$': '<rootDir>/../shared/src/$1',
  }
};
```

2. Certifique-se de que o caminho relativo está correto para o módulo shared.

### 2. Erro: "matchMedia is not a function"

**Sintoma:**
```bash
TypeError: window.matchMedia is not a function
```

**Causa:** API do navegador não disponível no ambiente de teste.

**Solução:**
Adicione no `setupTests.ts`:
```typescript
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
```

### 3. Erro: "IntersectionObserver is not defined"

**Sintoma:**
```bash
ReferenceError: IntersectionObserver is not defined
```

**Causa:** API do navegador não disponível no jsdom.

**Solução:**
Adicione no `setupTests.ts`:
```typescript
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};
```

### 4. Erro: "ResizeObserver is not defined"

**Sintoma:**
```bash
ReferenceError: ResizeObserver is not defined
```

**Solução:**
Adicione no `setupTests.ts`:
```typescript
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};
```

### 5. Warning: "An update to [Component] inside a test was not wrapped in act(...)"

**Sintoma:**
```bash
Warning: An update to Dashboard inside a test was not wrapped in act(...)
```

**Causa:** Atualizações de estado assíncronas não envolvidas em `act()`.

**Solução:**
1. Use `waitFor` para operações assíncronas:
```typescript
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

2. Para interações do usuário, use `user-event`:
```typescript
const user = userEvent.setup();
await user.click(button);
```

### 6. Erro: "Cannot find module '@types/jest'"

**Sintoma:**
```bash
Cannot find module '@types/jest' or its corresponding type declarations
```

**Solução:**
```bash
npm install --save-dev @types/jest ts-jest
```

### 7. Teste lento ou timeout

**Sintoma:**
Testes demoram muito para executar ou dão timeout.

**Soluções:**
1. Aumente o timeout para testes específicos:
```typescript
test('long running test', async () => {
  // test code
}, 10000); // 10 segundos
```

2. Use `--maxWorkers=1` para debugging:
```bash
npm test -- --maxWorkers=1
```

3. Verifique se há vazamentos de memória em mocks.

## 🔧 Comandos Úteis

### Executar testes com mais informações

```bash
# Executar com output verbose
npm test -- --verbose

# Executar apenas testes que falharam
npm test -- --onlyFailures

# Executar testes de um arquivo específico
npm test -- Dashboard.test.tsx

# Executar com coverage
npm test -- --coverage
```

### Debug de testes

```bash
# Executar testes em modo debug
npm test -- --runInBand --no-cache

# Limpar cache do Jest
npm test -- --clearCache
```

### Executar testes sem warnings de console

```bash
# Suprimir warnings específicos
npm test -- --silent
```

## 🛠️ Verificações de Saúde

### Verificar configuração do Jest

1. Confirme que `jest.config.js` existe em cada MFE
2. Verifique se `setupTests.ts` está configurado corretamente
3. Confirme que as dependências de teste estão instaladas

### Verificar mocks

1. Certifique-se de que os mocks estão em `__mocks__` ou definidos nos testes
2. Verifique se os mocks não estão conflitando entre arquivos
3. Confirme que os mocks simulam adequadamente as dependências reais

### Verificar importações

1. Confirme que os caminhos de importação estão corretos
2. Verifique se os módulos shared estão acessíveis
3. Confirme que as extensões de arquivo estão corretas

## 🔍 Estratégias de Debug

### 1. Isolar o problema

```bash
# Testar apenas um arquivo
npm test -- --testPathPattern=Dashboard.test.tsx

# Testar apenas um teste específico
npm test -- --testNamePattern="should render dashboard"
```

### 2. Adicionar logs de debug

```typescript
test('debug test', () => {
  render(<Component />);
  screen.debug(); // Mostra o DOM atual
  console.log(screen.getByTestId('element').textContent);
});
```

### 3. Verificar estado dos mocks

```typescript
test('check mocks', () => {
  expect(mockFunction).toHaveBeenCalledTimes(1);
  expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
  console.log(mockFunction.mock.calls); // Ver todas as chamadas
});
```

## 📞 Obtendo Ajuda

Se você continuar enfrentando problemas:

1. **Verifique os logs completos** - Execute `npm test` sem flags para ver todos os detalhes
2. **Compare com testes funcionais** - Veja como testes similares estão implementados
3. **Consulte a documentação** - [Testing Library](https://testing-library.com/docs/) e [Jest](https://jestjs.io/docs/getting-started)
4. **Verifique o relatório completo** - [TESTING_IMPLEMENTATION_REPORT.md](../TESTING_IMPLEMENTATION_REPORT.md)

## 📋 Checklist de Resolução

- [ ] Dependências de teste instaladas (@types/jest, ts-jest, etc.)
- [ ] jest.config.js configurado corretamente
- [ ] setupTests.ts com mocks necessários
- [ ] Importações de módulos shared funcionando
- [ ] Mocks não conflitantes
- [ ] APIs do navegador mockadas (matchMedia, IntersectionObserver, etc.)
- [ ] Testes isolados sem dependências externas
- [ ] Timeouts adequados para operações assíncronas
