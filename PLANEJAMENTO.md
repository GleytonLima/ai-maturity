# Plano do MVP de Avaliação de Maturidade IA

**Nome do projeto:** AIMaturity (repositório: `aimaturity` ou `ai-maturity`). O setup inicial já foi feito na pasta `ai-maturity`.

## Objetivo

Construir uma aplicação 100% browser-first para cadastrar e gerenciar diferentes times, aplicar o assessment baseado no relatório e gerar resultados comparáveis, mantendo tudo em `localStorage` com exportação de dados.

## Base metodológica

- Fonte de referência conceitual: [deep-research-report.md](c:/Users/Gleyton/Documents/projetos/ai/framework-maturidade-ai/deep-research-report.md)
- Fonte canônica de implementação do produto: [spec_compact.md](c:/Users/Gleyton/Documents/projetos/ai/framework-maturidade-ai/spec_compact.md)
- Fonte de apoio (detalhamento e roadmap): [spec.md](c:/Users/Gleyton/Documents/projetos/ai/framework-maturidade-ai/spec.md)
- Modelo: 7 dimensões + 5 níveis
- Escala por pergunta: 0 a 4
- Regras de cálculo:
  - score por capacidade = média simples de 3 perguntas
  - score por dimensão = média simples de 2 capacidades
  - score geral = média ponderada das 7 dimensões (pesos da `spec_compact`)
  - regra de gating forte:
    - se `D4 < 2.0`, nível geral máximo = N2
    - se `D3 < 2.0`, nível geral máximo = N2
    - bloqueio de N4/N5 se não cumprir `D3 >= 3.0`, `D4 >= 3.0`, `D7 >= 2.5`
  - alertas críticos:
    - risco estrutural se `Q19`, `Q20`, `Q22` ou `Q23` = 0
    - controle de qualidade insuficiente se `Q13`, `Q14` ou `Q16` = 0

## Arquitetura proposta (frontend)

- Stack: **Angular v21** + TypeScript; gerenciador de pacotes: **npm**
- Estado local: services + camada simples de repositório para `localStorage`
- Configuração do framework: **human-readable** com catálogo em arquivos versionáveis (estilo "1 item por arquivo")
- Estrutura de domínio:
  - `Team`
  - `Assessment` (respostas, evidências, data, versão)
  - `ScoreResult` (scores por dimensão, score geral, nível final)
- Catálogo de survey (fonte do formulário):
  - pasta em `assets/framework/v1/`
  - `manifest.json` (versão, pesos, thresholds, gating e metadados)
  - `dimensions/*.json` (D1..D7 e capacidades)
  - `questions/<dimension>/<q-code>.json` (1 arquivo por pergunta, Q1..Q42)
- Persistência:
  - chave versionada no `localStorage` (ex.: `aimaturity.v1`)
  - migração leve por versão para evitar quebra futura

## Fluxo funcional do MVP

- Tela de times:
  - criar, editar, remover e selecionar time
- Tela de assessment:
  - perguntas carregadas dinamicamente do catálogo da `spec_compact`
  - respostas 0-4 + campo de evidências
  - validação de evidência obrigatória quando resposta for 3 ou 4
  - salvar rascunho e finalizar
- Tela de resultados:
  - score por capacidade e dimensão
  - score por dimensão
  - nível geral com explicação das regras de gating aplicadas
  - alertas críticos de segurança/qualidade
  - histórico de avaliações por time
  - comparação básica entre times
- Exportação:
  - JSON completo (backup/restauração)
  - CSV tabular (time, data, dimensão, capacidade, score, nível, flags)

## Qualidade mínima para o MVP

- Validação de formulário (resposta obrigatória por pergunta)
- Mensagens de erro/sucesso para operações de persistência
- Testes unitários para:
  - cálculo de score e mapeamento de nível
  - regra de gating
  - serialização para JSON/CSV

## Evolução após MVP

- Importação JSON para restaurar dados
- Dashboard comparativo avançado (filtros por período e benchmark interno)
- Exportação visual (PDF/print da visão do time)
- Configuração de pesos por dimensão

## To-dos atuais

- [x] Inicializar projeto AIMaturity (Angular v21 + TypeScript) com npm e estrutura base de pastas.
- [ ] Definir `spec_compact` como fonte canônica do produto e mapear divergências relevantes da spec expandida.
- [ ] Estruturar catálogo human-readable com 1 arquivo por pergunta (Q1-Q42), organizado por dimensão/capacidade.
- [ ] Implementar camada de persistência em `localStorage` com operações CRUD por time e avaliações.
- [ ] Implementar engine de cálculo por pergunta, capacidade e dimensão com pesos e regras de gating da `spec_compact`.
- [ ] Construir telas de gerenciamento de times, formulário de assessment e resultados com níveis.
- [ ] Implementar exportação de dados em JSON e CSV para um ou mais times.
- [ ] Adicionar testes para leitura do catálogo, cálculo, gating e exportação.
