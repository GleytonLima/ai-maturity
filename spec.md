# Especificação do framework

## Nome proposto

**AIM-SDLC Framework**
**AI Maturity for Software Delivery Lifecycle**

---

# 1. Visão do produto

## 1.1 Objetivo

Definir um framework padronizado para medir o nível de maturidade de squads no uso de IA ao longo do ciclo de desenvolvimento de soluções, cobrindo discovery, design, implementação, testes, entrega, operação e melhoria contínua.

## 1.2 Problema que resolve

Hoje os times usam IA de forma desigual, pouco rastreável e frequentemente sem conexão clara com qualidade, segurança e resultado. O framework deve permitir responder:

* Onde a squad está hoje?
* Quais lacunas impedem uso seguro e escalável?
* Quais ações elevam o próximo nível?
* Como comparar squads sem cair em métricas de vaidade?

## 1.3 Princípios

O framework deve seguir estes princípios:

* **IA como amplificadora**, não como fim em si.
* **Uso com evidência**, não autoavaliação vaga.
* **Medição por dimensão**, não só score geral.
* **Segurança e governança como restrição de escala**.
* **Evolução contínua**, com reavaliações periódicas.

Esses princípios são coerentes com o PDF, que diferencia adoção de valor, recomenda telemetria + outcomes + guardrails, e propõe gating de segurança. 

---

# 2. Modelo conceitual do framework

## 2.1 Entidade central avaliada

A unidade principal de avaliação é a **squad/time de desenvolvimento**.

Cada squad possui:

* contexto
* stack
* missão/produto
* estágio de adoção de IA
* evidências
* score por dimensão
* score geral
* plano de evolução

## 2.2 Dimensões canônicas

O framework deve usar as 7 dimensões do seu estudo como núcleo estável:

1. **Cobertura do SDLC**
2. **Integração no fluxo**
3. **Qualidade em alta velocidade**
4. **Segurança, privacidade, IP e compliance**
5. **Dados e conhecimento acessíveis à IA**
6. **Pessoas e cultura**
7. **Medição de valor e feedback loops**  

Essas 7 dimensões são boas porque já condensam os 188 itens em categorias operáveis.

## 2.3 Níveis de maturidade

O framework deve manter 5 níveis:

* **N1 Ad-hoc**
* **N2 Assistido**
* **N3 Padronizado**
* **N4 Otimizado**
* **N5 IA-nativo**  

## 2.4 Hipótese central de maturidade

A maturidade aumenta quando a squad evolui simultaneamente em:

* amplitude de uso no SDLC
* profundidade de integração no fluxo
* qualidade e confiabilidade do output
* controle de risco
* institucionalização do conhecimento
* capacidade humana
* medição de valor

---

# 3. Estratégia de compactação das 188 perguntas

## 3.1 Regra de compressão

As 188 perguntas não devem virar 188 perguntas finais.
Elas devem ser transformadas em:

* **Critérios canônicos**
* **Perguntas operacionais**
* **Evidências verificáveis**

## 3.2 Estrutura de compactação

A compactação deve seguir esta hierarquia:

**Dimensão → Capacidade → Critério → Pergunta → Evidência**

Exemplo:

* Dimensão: Integração no fluxo
* Capacidade: Integração operacional
* Critério: IA integrada ao toolchain
* Pergunta: A IA está integrada ao IDE, PR e CI/CD?
* Evidência: plugin ativo, bot em PR, action no pipeline

## 3.3 Tamanho recomendado do framework final

Recomendação prática:

* **7 dimensões**
* **14 capacidades** (2 por dimensão)
* **28 critérios** (2 por capacidade)
* **42 a 56 perguntas operacionais** total

Isso dá um instrumento utilizável, sem ficar superficial.

## 3.4 Regra de deduplicação semântica

Cada pergunta original deve ser mapeada para um único critério canônico primário e, se necessário, um secundário.

Exemplo:

* “Existe política clara para uso de IA?”
* “As saídas de IA são avaliadas contra políticas organizacionais?”
* “Há governança para uso de IA?”

Essas três convergem para um mesmo critério:

**SEC-01 — Governança operacional do uso de IA**

---

# 4. Modelo alvo do framework

## 4.1 Dimensões e capacidades

### D1. Cobertura do SDLC

Capacidades:

* **D1C1 Uso pré-código**
* **D1C2 Uso em delivery e run**

Perguntas típicas:

* A IA é usada antes da codificação, em discovery, requisitos e design?
* A IA é usada em testes, incidentes, runbooks e observabilidade?

### D2. Integração no fluxo

Capacidades:

* **D2C1 Integração com toolchain**
* **D2C2 Automação e agentes**

Perguntas:

* A IA está integrada ao IDE, revisão, backlog e pipelines?
* Há automações ou agentes supervisionados no fluxo?

### D3. Qualidade em alta velocidade

Capacidades:

* **D3C1 Controles de qualidade**
* **D3C2 Sustentabilidade técnica**

Perguntas:

* Saídas de IA passam por revisão, testes e gates específicos?
* O uso de IA reduz ou aumenta complexidade, retrabalho e dívida?

### D4. Segurança, privacidade, IP e compliance

Capacidades:

* **D4C1 Governança e política**
* **D4C2 Controles de risco no fluxo**

Perguntas:

* Há política clara, ferramentas aprovadas e dados proibidos?
* Há trilha de auditoria, threat model e controles contra vazamento?

### D5. Dados e conhecimento acessíveis à IA

Capacidades:

* **D5C1 Conhecimento encontrável**
* **D5C2 Contexto seguro para IA**

Perguntas:

* A documentação interna é atualizada, útil e localizável?
* A IA acessa contexto interno com segurança, ACL e rastreabilidade?

### D6. Pessoas e cultura

Capacidades:

* **D6C1 Habilidades e confiança**
* **D6C2 Colaboração e aprendizado**

Perguntas:

* O time sabe avaliar outputs, limites e riscos?
* O uso é distribuído e há compartilhamento de práticas?

### D7. Medição de valor e feedback loops

Capacidades:

* **D7C1 Telemetria e outcomes**
* **D7C2 Aprendizado orientado a dados**

Perguntas:

* A squad mede adoção, review speed, lead time, incidentes e qualidade?
* As decisões de expandir ou frear uso de IA são baseadas em dados?

---

# 5. Modelo de avaliação

## 5.1 Tipo de instrumento

O sistema deve suportar três tipos de item:

* **Pergunta declarativa**
* **Pergunta com evidência obrigatória**
* **Métrica importada automaticamente**

## 5.2 Escala de resposta

Manter escala 0–4, alinhada ao PDF:

* **0** inexistente / não aplicável / proibido
* **1** ad-hoc
* **2** aplicado localmente
* **3** padronizado com evidência
* **4** otimizado, medido e melhorado continuamente 

## 5.3 Regra de evidência

Se a resposta for 3 ou 4, exigir ao menos 1 evidência válida.

Tipos de evidência:

* link de guideline
* trecho de pipeline
* print de integração
* dashboard
* PR real
* runbook
* política
* ADR
* log de auditoria

## 5.4 Pesos

Sugestão inicial:

* Cobertura do SDLC: 1.0
* Integração no fluxo: 1.2
* Qualidade: 1.3
* Segurança/privacidade/IP: 1.5
* Dados/conhecimento: 1.1
* Pessoas/cultura: 1.0
* Medição de valor: 1.2

## 5.5 Gating

Regra mandatória:

* Se **Segurança < 2.0**, nível geral máximo = **N2**
* Se **Qualidade < 2.0**, nível geral máximo = **N2**
* Se **Medição < 1.5**, nível geral máximo = **N3**

Isso evolui a regra do PDF, que já sugere gating de segurança. 

## 5.6 Cálculo

### Score do critério

Média ponderada das perguntas do critério.

### Score da capacidade

Média ponderada dos critérios.

### Score da dimensão

Média ponderada das capacidades.

### Score geral

Média ponderada das dimensões, aplicada a regra de gating.

## 5.7 Conversão score → nível

Sugestão:

* 0.0–0.9 = N1
* 1.0–1.9 = N2
* 2.0–2.9 = N3
* 3.0–3.6 = N4
* 3.7–4.0 = N5 

---

# 6. Especificação funcional do framework

## 6.1 Entradas

O sistema deve receber:

* respostas do questionário
* evidências anexadas
* metadados da squad
* métricas importadas do SDLC
* observações do avaliador

## 6.2 Saídas

O sistema deve gerar:

* score por pergunta
* score por critério
* score por capacidade
* score por dimensão
* score geral
* nível da squad
* radar de maturidade
* gaps prioritários
* recomendações para próximo nível
* benchmark entre squads
* trilha histórica

## 6.3 Casos de uso

### Caso 1 — Autoavaliação guiada

A squad responde e anexa evidências.

### Caso 2 — Avaliação facilitada

Um facilitador revisa evidências e ajusta notas.

### Caso 3 — Avaliação híbrida

Parte do score vem de telemetria automática e parte do questionário.

### Caso 4 — Benchmark executivo

Liderança compara squads por dimensão.

### Caso 5 — Reavaliação

A squad reexecuta o assessment e compara evolução.

---

# 7. Especificação do sistema

## 7.1 Objetivo do sistema

Construir uma aplicação que operacionaliza o framework AIM-SDLC, permitindo diagnóstico, rastreabilidade e evolução contínua da maturidade de IA por squad.

## 7.2 Módulos do sistema

### M1. Catálogo de framework

Responsável por armazenar:

* dimensões
* capacidades
* critérios
* perguntas
* pesos
* níveis
* regras de scoring
* regras de gating
* recomendações

### M2. Motor de assessment

Responsável por:

* aplicar questionário
* validar obrigatoriedade
* calcular scores
* aplicar regras de evidência
* aplicar gating
* consolidar resultados

### M3. Gestão de evidências

Responsável por:

* upload e versionamento
* classificação de evidências
* vínculo com pergunta/critério
* validade temporal
* revisão por avaliador

### M4. Integração de métricas

Responsável por importar:

* lead time
* cycle time
* review speed
* frequência de deploy
* incidentes
* cobertura de testes
* complexidade
* uso de ferramentas de IA

### M5. Analytics e benchmark

Responsável por:

* dashboards
* radar por squad
* comparativo entre squads
* tendências temporais
* heatmap por dimensão

### M6. Recomendador de evolução

Responsável por:

* identificar gargalos
* sugerir ações para próximo nível
* gerar backlog de melhorias
* priorizar por impacto x esforço

---

# 8. Modelo de dados lógico

## 8.1 Principais entidades

### Squad

* id
* nome
* produto
* tribo
* stack
* owner
* status

### Assessment

* id
* squad_id
* versão_framework
* data_inicio
* data_fim
* status
* score_geral
* nível_geral

### DimensionScore

* assessment_id
* dimension_id
* score
* nível

### CapabilityScore

* assessment_id
* capability_id
* score

### Question

* id
* código
* texto
* dimensão
* capacidade
* critério
* tipo
* peso
* exige_evidência
* fonte_origem

### Answer

* assessment_id
* question_id
* resposta_0_4
* justificativa
* respondido_por
* timestamp

### Evidence

* id
* assessment_id
* question_id
* tipo
* url_ou_arquivo
* descrição
* validado
* validado_por

### Recommendation

* id
* dimensão
* capacidade
* nível_atual
* nível_alvo
* ação
* prioridade

---

# 9. Contratos comportamentais

## 9.1 Regras obrigatórias

* Nenhum assessment pode ser finalizado com perguntas obrigatórias vazias.
* Respostas 3 ou 4 exigem evidência quando o item for marcado como evidenciável.
* O score geral só é válido após aplicação de gating.
* Toda mudança no framework gera nova versão.
* Resultados históricos nunca são sobrescritos.

## 9.2 Regras de auditoria

* Toda alteração de nota deve guardar autor e timestamp.
* Toda evidência deve ter vínculo com item específico.
* Toda recomendação gerada deve ser rastreável a gap de dimensão/capacidade.

---

# 10. Níveis operacionais do framework

## N1 — Ad-hoc

Critérios:

* uso isolado
* ausência de padrão
* baixa rastreabilidade
* sem métricas

## N2 — Assistido

Critérios:

* uso recorrente em algumas tarefas
* práticas locais
* poucos controles
* valor ainda pouco provado

## N3 — Padronizado

Critérios:

* padrões claros no time
* integração mínima no fluxo
* revisão e segurança adaptadas
* métricas básicas com evidência

## N4 — Otimizado

Critérios:

* decisões orientadas por dados
* automações no fluxo
* melhoria contínua
* governança robusta

## N5 — IA-nativo

Critérios:

* IA permeia o SDLC com segurança
* agentes supervisionados
* aprendizado contínuo institucionalizado
* valor medido em produção

---

# 11. Questionário mínimo recomendável

Para a primeira versão do produto, eu recomendo **42 perguntas**, 6 por dimensão.

Exemplo de estrutura:

### D1 Cobertura do SDLC

* IA em discovery
* IA em requisitos
* IA em arquitetura
* IA em testes
* IA em deploy/operação
* IA em incidentes

### D2 Integração no fluxo

* integração com IDE
* integração com PR/review
* integração com CI/CD
* prompts/playbooks
* automações
* agentes supervisionados

### D3 Qualidade

* revisão explícita de output de IA
* testes/gates
* pequenos lotes
* manutenibilidade
* dívida técnica
* monitoramento pós-release

### D4 Segurança

* política clara
* ferramentas aprovadas
* proteção de dados
* IP/licenças
* trilha de auditoria
* threat modeling

### D5 Dados/conhecimento

* documentação encontrável
* atualização da base
* acesso seguro ao contexto
* busca/RAG
* ownership
* tempo para responder dúvidas críticas

### D6 Pessoas/cultura

* treinamento mínimo
* distribuição de uso
* clareza sobre quando não usar
* compartilhamento de práticas
* liderança e incentivo
* retrospectivas de IA

### D7 Medição

* telemetria de uso
* review speed
* impacto em lead time
* impacto em qualidade
* incidentes
* feedback loop de rollout

---

# 12. Roadmap de desenvolvimento do sistema

## Fase 1 — MVP

Entregar:

* catálogo do framework
* questionário manual
* upload de evidências
* scoring automático
* radar por squad
* exportação de relatório

## Fase 2 — Assessment híbrido

Entregar:

* integração com Git, CI, Jira, observabilidade
* importação automática de métricas
* benchmark entre squads
* recomendador básico

## Fase 3 — Plataforma de governança

Entregar:

* trilhas históricas
* alertas de regressão
* planos de evolução
* benchmarks por tribo/unidade
* versionamento de framework

## Fase 4 — Inteligência sobre maturidade

Entregar:

* recomendação baseada em padrões de squads
* previsão de evolução
* clusterização de squads
* correlação entre maturidade e outcomes

---

# 13. Artefatos de spec-driven development

Para desenvolver isso com SDD, eu estruturaria em 6 specs principais.

## Spec 01 — Domain Model

Define:

* dimensões
* capacidades
* critérios
* perguntas
* níveis
* scoring
* gating

## Spec 02 — Assessment Workflow

Define:

* abertura
* resposta
* evidência
* revisão
* fechamento
* publicação

## Spec 03 — Scoring Engine

Define:

* fórmulas
* pesos
* thresholds
* níveis
* regras de auditoria

## Spec 04 — Evidence Model

Define:

* tipos de evidência
* validade
* vínculo com pergunta
* revisão
* expiração

## Spec 05 — Reporting & Analytics

Define:

* relatórios
* dashboards
* radar
* benchmark
* histórico

## Spec 06 — Integrations

Define:

* conectores
* schemas de dados
* frequência de sync
* fallback manual

---

# 14. Critérios de sucesso do framework

O framework será bem-sucedido se:

* uma squad consegue responder em até 45 minutos
* o workshop fecha em até 90 minutos
* o resultado é inteligível para liderança e para o time
* o score é rastreável a evidências
* duas avaliações independentes produzem resultado próximo
* o framework gera backlog de evolução acionável
