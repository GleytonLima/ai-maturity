# Framework de maturidade de IA no SDLC

Aplicação Angular para gestão de times, assessments e resultados de maturidade no uso de IA ao longo do SDLC.

## O que esta versão entrega

- CRUD de times com listagem em tabela
- CRUD de ferramentas de IA com catálogo central
- Assessments em fluxo de duas etapas: dados iniciais e perguntas
- Associação de uma ou mais ferramentas por pergunta
- Resultados com score, nível e sumário de ferramentas mais associadas
- Persistência local em `localStorage`
- Exportação e importação em JSON (arquivo de exemplo: `ai-maturity/example-import.json`)

## Estrutura

- Aplicação Angular: `ai-maturity`
- Gerador de assets do framework: `tools/generate-framework-assets.mjs`
- Documentos de apoio: `spec.md`, `spec_compact.md`, `questions.md`

## Como executar

```bash
cd ai-maturity
npm install
npm start
```

Aplicação disponível em `http://localhost:4200`.

## Como validar

```bash
cd ai-maturity
npm run build
npm run test -- --watch=false
```

## Estado atual

- Build e testes estão passando
- O bundle inicial ainda está acima do budget configurado
- A próxima melhoria estrutural recomendada é separar `Times`, `Ferramentas`, `Assessment` e `Resultados` em componentes/rotas próprias

