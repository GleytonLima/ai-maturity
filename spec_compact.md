# Framework compacto de maturidade de IA no SDLC

## Escala padrão de resposta

Para todas as perguntas:

* **0** = inexistente / proibido / não aplicável sem tratamento
* **1** = ad-hoc, informal, isolado
* **2** = aplicado em parte do time ou em alguns fluxos
* **3** = padronizado no time, com evidência objetiva
* **4** = medido, otimizado e melhorado continuamente

## Regra de evidência

Para marcar **3** ou **4**, deve existir pelo menos **1 evidência objetiva**.

Exemplos de evidência:

* guideline
* template
* dashboard
* pipeline
* PR real
* ADR
* runbook
* política
* log
* telemetria
* print de integração

---

# D1. Cobertura do SDLC

## Capacidade D1C1 — Uso pré-código

### Q1

A squad usa IA em **discovery, pesquisa, ideação ou entendimento do problema**?

> 💡 **Exemplo:** A squad usa um LLM para analisar entrevistas de usuários e gerar hipóteses de problema antes de definir a solução.

### Q2

A squad usa IA para **refinar requisitos, critérios de aceitação ou reduzir ambiguidades**?

> 💡 **Exemplo:** Ao escrever uma user story, a squad pede à IA para sugerir critérios de aceitação faltantes e identificar cenários de borda.

### Q3

A squad usa IA para apoiar **design e decisões de arquitetura**, incluindo alternativas e trade-offs?

> 💡 **Exemplo:** Antes de um ADR, a squad usa IA para comparar trade-offs entre duas abordagens (ex.: REST vs gRPC) com prós/contras documentados.

### Q4

O produto e o backlog da squad são orientados por **necessidades e resultados do usuário**, garantindo que a aceleração com IA não desvie o foco do valor entregue?

> 💡 **Exemplo:** O backlog prioriza itens com base em impacto para o usuário (ex.: NPS, métricas de uso), e a squad valida se o que a IA acelerou de fato resolve o problema certo.

## Capacidade D1C2 — Uso em delivery e run

### Q5

A squad usa IA para **geração, manutenção, priorização ou análise de testes/QA**?

> 💡 **Exemplo:** A squad usa IA para gerar testes unitários a partir de código novo e para sugerir quais testes rodar primeiro com base no diff do PR.

### Q6

A squad usa IA em **documentação técnica, documentação de release ou artefatos operacionais**?

> 💡 **Exemplo:** Release notes e changelogs são gerados automaticamente por IA a partir dos commits e revisados antes de publicar.

### Q7

A squad usa IA em **operação, observabilidade, incidentes, troubleshooting ou runbooks**?

> 💡 **Exemplo:** Durante um incidente, a squad usa IA para correlacionar logs e métricas e sugerir causa raiz, ou para gerar rascunho do postmortem.

---

# D2. Integração no fluxo

## Capacidade D2C1 — Integração com toolchain e plataforma

### Q8

A IA está integrada ao **IDE ou ambiente principal de desenvolvimento** de forma recorrente?

> 💡 **Exemplo:** Copilot, Cursor ou Cody está ativo no IDE da squad, e a maioria dos devs usa completions e chat no dia a dia.

### Q9

A IA está integrada ao fluxo de **PR, code review, backlog, issue tracking ou wiki**?

> 💡 **Exemplo:** Um bot de code review (ex.: CodeRabbit, PR-Agent) comenta automaticamente nos PRs com sugestões e checklist.

### Q10

A IA está integrada ao **pipeline de CI/CD, automações de qualidade ou gates técnicos**?

> 💡 **Exemplo:** Uma GitHub Action usa IA para classificar falhas de teste ou bloquear merge quando detecta padrões inseguros no código gerado.

### Q11

A squad tem acesso a uma **plataforma interna de qualidade** que oferece caminhos padronizados, seguros e automatizados para escalar o uso de IA na organização?

> 💡 **Exemplo:** A empresa oferece um portal/plataforma interna com templates de projeto, APIs aprovadas, guardrails de segurança e integrações de IA já homologadas.

## Capacidade D2C2 — Automação e agentes

### Q12

A squad possui **playbooks, biblioteca de prompts, templates ou padrões reutilizáveis** para uso de IA?

> 💡 **Exemplo:** Existe um repositório Git com prompts versionados por tipo de tarefa (ex.: "gerar testes", "revisar ADR", "resumir incidente").

### Q13

A squad utiliza **automações com IA** no fluxo de trabalho, além de uso manual em chat?

> 💡 **Exemplo:** Um workflow automatizado usa IA para classificar bugs recém-abertos por severidade e atribuir ao time correto.

### Q14

A squad utiliza **agentes ou assistentes com autonomia delimitada e supervisão humana**?

> 💡 **Exemplo:** Um agente de coding (ex.: Cursor Agent, Devin) executa tarefas técnicas com escopo definido, mas toda mudança passa por review humano antes do merge.

---

# D3. Qualidade em alta velocidade

## Capacidade D3C1 — Controles de qualidade

### Q15

Outputs gerados com IA passam por **revisão humana explícita**, com critérios adaptados para IA?

> 💡 **Exemplo:** O checklist de PR inclui itens como "Código gerado por IA foi revisado quanto a lógica, segurança e alinhamento com padrões do time?"

### Q16

Mudanças geradas com IA passam por **testes automatizados, validações e gates confiáveis**?

> 💡 **Exemplo:** Todo PR, independente de ser humano ou IA, precisa passar pela suíte de testes, linter e SAST antes de ser mergeado.

### Q17

A squad consegue usar IA sem aumentar de forma relevante **retrabalho, defeitos ou instabilidade**?

> 💡 **Exemplo:** A taxa de rollback e bugs em produção não subiu após a adoção de IA; a squad monitora isso explicitamente.

## Capacidade D3C2 — Sustentabilidade técnica

### Q18

A squad controla o impacto da IA em **complexidade, manutenibilidade e dívida técnica**?

> 💡 **Exemplo:** A squad roda análise de complexidade ciclomática e monitora se o código gerado por IA está aumentando a dívida técnica.

### Q19

A squad mantém **pequenos lotes, disciplina de versionamento e clareza de autoria** ao usar IA?

> 💡 **Exemplo:** PRs gerados com assistência de IA são pequenos (< 400 linhas), com commits atômicos e mensagem indicando que IA participou.

### Q20

A squad monitora o comportamento de mudanças assistidas por IA **após merge ou deploy**?

> 💡 **Exemplo:** Após deploy de código assistido por IA, a squad verifica métricas de erro e latência nas primeiras horas, com alerta configurado.

---

# D4. Segurança, privacidade, IP e compliance

## Capacidade D4C1 — Governança e política

### Q21

Existe política clara sobre **ferramentas de IA permitidas, usos proibidos e tipos de dados restritos**?

> 💡 **Exemplo:** A empresa publicou uma política que lista ferramentas aprovadas (ex.: Copilot Enterprise), proíbe uso de modelos públicos com código proprietário, e define dados PII como restritos.

### Q22

A squad entende e aplica regras sobre **privacidade, segredos, dados sensíveis e vazamento de informação**?

> 💡 **Exemplo:** Devs sabem que não podem colar tokens, secrets ou dados de clientes em prompts; há DLP configurado para bloquear isso.

### Q23

A squad considera riscos de **IP, licenciamento, direitos autorais e origem do conteúdo gerado por IA**?

> 💡 **Exemplo:** A squad verifica se código sugerido pela IA não replica trechos de projetos com licenças restritivas (ex.: GPL em projeto MIT).

## Capacidade D4C2 — Controles de risco no fluxo

### Q24

Existe **trilha de auditoria** ou registro mínimo do uso de IA em artefatos relevantes?

> 💡 **Exemplo:** PRs com assistência de IA são tagueados com label "ai-assisted" e o template de PR tem campo obrigatório "IA utilizada: sim/não".

### Q25

A squad incorpora riscos de IA no **threat modeling**, incluindo prompt injection, overreliance e supply chain?

> 💡 **Exemplo:** O threat model do serviço inclui cenários como "prompt injection via input do usuário" e "dependência de modelo externo indisponível".

### Q26

Existem **controles operacionais ou técnicos** para prevenir uso inseguro de IA no fluxo de desenvolvimento?

> 💡 **Exemplo:** Há uma regra no proxy/gateway que impede envio de código para APIs de IA não homologadas; o linter bloqueia padrões de código inseguro gerado por IA.

---

# D5. Dados e conhecimento acessíveis à IA

## Capacidade D5C1 — Conhecimento encontrável

### Q27

A documentação e o conhecimento interno são **encontráveis, atualizados e úteis** para humanos e IA?

> 💡 **Exemplo:** A wiki do time é atualizada a cada sprint e aparece nos primeiros resultados ao buscar termos-chave no portal interno.

### Q28

A squad documenta decisões importantes de forma que o conhecimento possa ser **reutilizado posteriormente**?

> 💡 **Exemplo:** Toda decisão arquitetural relevante vira um ADR versionado no repositório, acessível tanto para humanos quanto para ferramentas de IA.

### Q29

A squad consegue responder dúvidas técnicas relevantes com rapidez usando **base interna e contexto confiável**?

> 💡 **Exemplo:** Um dev novo consegue descobrir como funciona o fluxo de pagamento em menos de 1 hora consultando docs internas ou perguntando ao assistente de IA com contexto do repo.

## Capacidade D5C2 — Contexto seguro para IA

### Q30

A squad oferece à IA acesso a **contexto interno seguro**, como docs, código, padrões e histórico relevante?

> 💡 **Exemplo:** O assistente de IA está conectado ao repositório e à wiki interna via RAG ou MCP, permitindo respostas contextualizadas sem expor dados externamente.

### Q31

Esse acesso a contexto interno possui **controle de acesso, rastreabilidade e proteção adequada**?

> 💡 **Exemplo:** O sistema de RAG respeita ACLs do repositório; logs de consulta são mantidos; dados sensíveis são filtrados antes de chegar ao modelo.

### Q32

A qualidade, atualização e ownership dos dados/conhecimento são tratadas como **fundamento para uso eficaz da IA**?

> 💡 **Exemplo:** Existe um owner definido para cada área da documentação, com SLA de atualização (ex.: "docs de API revisadas a cada release").

---

# D6. Pessoas e cultura

## Capacidade D6C1 — Habilidades e confiança

### Q33

A squad recebeu treinamento mínimo sobre **como usar IA, avaliar respostas e reconhecer limites/riscos**?

> 💡 **Exemplo:** O time participou de um workshop de 2h sobre como avaliar criticamente outputs de IA, identificar alucinações e saber quando não confiar no resultado.

### Q34

O uso de IA está distribuído no time, em vez de concentrado em **poucos power users**?

> 💡 **Exemplo:** Telemetria mostra que 80% do time usa IA semanalmente, não só 1-2 pessoas; pair programming com IA é incentivado.

### Q35

A squad sabe explicitar **quando não usar IA** ou quando exigir revisão reforçada?

> 💡 **Exemplo:** O guideline do time lista cenários onde IA não deve ser usada sem revisão reforçada (ex.: lógica de billing, regras de compliance, manipulação de PII).

## Capacidade D6C2 — Colaboração e aprendizado

### Q36

O time compartilha **boas práticas, prompts, exemplos, aprendizados e padrões** de uso de IA?

> 💡 **Exemplo:** A squad tem um canal no Slack/Teams onde compartilha prompts que funcionaram bem, truques e "anti-patterns" descobertos.

### Q37

A liderança e o ambiente da squad favorecem **experimentação segura**, com clareza e segurança psicológica?

> 💡 **Exemplo:** O tech lead encoraja testar novas ferramentas de IA em tarefas de baixo risco, sem penalizar erros; a política da empresa é clara sobre o que pode e o que não pode.

### Q38

A squad realiza **retrospectivas, revisões ou ciclos de aprendizado** específicos sobre uso de IA?

> 💡 **Exemplo:** Na retrospectiva de sprint, há um item fixo: "O que aprendemos sobre uso de IA neste ciclo? O que funcionou e o que devemos ajustar?"

---

# D7. Medição de valor e feedback loops

## Capacidade D7C1 — Telemetria e outcomes

### Q39

A squad mede **adoção e intensidade de uso** de IA por meio de telemetria ou dados objetivos?

> 💡 **Exemplo:** A squad acompanha DAU do Copilot, taxa de aceitação de sugestões e volume de interações no chat do assistente.

### Q40

A squad mede impacto em **fluxo de engenharia**, como review speed, lead time, throughput ou cycle time?

> 💡 **Exemplo:** Um dashboard mostra que review time caiu de 48h para 24h após adoção de bot de code review com IA.

### Q41

A squad mede impacto em **qualidade e estabilidade**, como defeitos, incidentes, retrabalho ou debt?

> 💡 **Exemplo:** A squad compara taxa de bugs em produção antes e depois da adoção de IA e monitora se a complexidade do código está sob controle.

## Capacidade D7C2 — Aprendizado orientado a dados

### Q42

A squad compara percepções sobre ganho com IA com **resultados observáveis**, evitando métricas de vaidade?

> 💡 **Exemplo:** Embora o time ache que "está mais rápido", a squad verifica com dados se o lead time e a taxa de defeitos realmente melhoraram.

### Q43

A squad usa essas métricas para **priorizar onde expandir, limitar ou ajustar** o uso de IA?

> 💡 **Exemplo:** Após ver que IA em testes gerou boa cobertura mas em docs gerou conteúdo de baixa qualidade, a squad decidiu investir mais em testes e ajustar o processo de docs.

### Q44

A squad mantém **feedback loops contínuos** para revisar práticas, ferramentas, controles e treinamento?

> 💡 **Exemplo:** A cada trimestre, a squad revisa métricas, ajusta prompts/playbooks, atualiza a política de uso e planeja próximos treinamentos com base nos gaps observados.

---

# Estrutura resumida

| Dimensão                                | Capacidade                          | Perguntas |
| --------------------------------------- | ----------------------------------- | --------- |
| Cobertura do SDLC                       | Uso pré-código                      | Q1–Q4     |
| Cobertura do SDLC                       | Uso em delivery e run               | Q5–Q7     |
| Integração no fluxo                     | Integração com toolchain/plataforma | Q8–Q11    |
| Integração no fluxo                     | Automação e agentes                 | Q12–Q14   |
| Qualidade em alta velocidade            | Controles de qualidade              | Q15–Q17   |
| Qualidade em alta velocidade            | Sustentabilidade técnica            | Q18–Q20   |
| Segurança, privacidade, IP e compliance | Governança e política               | Q21–Q23   |
| Segurança, privacidade, IP e compliance | Controles de risco no fluxo         | Q24–Q26   |
| Dados e conhecimento acessíveis à IA    | Conhecimento encontrável            | Q27–Q29   |
| Dados e conhecimento acessíveis à IA    | Contexto seguro para IA             | Q30–Q32   |
| Pessoas e cultura                       | Habilidades e confiança             | Q33–Q35   |
| Pessoas e cultura                       | Colaboração e aprendizado           | Q36–Q38   |
| Medição de valor e feedback loops       | Telemetria e outcomes               | Q39–Q41   |
| Medição de valor e feedback loops       | Aprendizado orientado a dados       | Q42–Q44   |

---

# Regras de scoring

## Score por pergunta

Cada pergunta recebe nota de 0 a 4.

## Score por capacidade

Média simples das perguntas da capacidade.

## Score por dimensão

Média simples das 2 capacidades da dimensão.

## Score geral

Média ponderada das 7 dimensões.

Sugestão de pesos:

* D1 Cobertura do SDLC = 1.0
* D2 Integração no fluxo = 1.1
* D3 Qualidade = 1.3
* D4 Segurança = 1.5
* D5 Dados/conhecimento = 1.1
* D6 Pessoas/cultura = 1.0
* D7 Medição de valor = 1.2

---

# Conversão de score em nível

| Score médio | Nível            |
| ----------- | ---------------- |
| 0.0–0.9     | N1 — Ad-hoc      |
| 1.0–1.9     | N2 — Assistido   |
| 2.0–2.9     | N3 — Padronizado |
| 3.0–3.6     | N4 — Otimizado   |
| 3.7–4.0     | N5 — IA-nativo   |

---

# Gating forte em segurança e qualidade

## Regra 1 — Segurança

Se **D4 < 2.0**, o nível geral máximo é **N2**.

## Regra 2 — Qualidade

Se **D3 < 2.0**, o nível geral máximo é **N2**.

## Regra 3 — Segurança crítica

Se qualquer uma das perguntas **Q21, Q22, Q24 ou Q25** tiver nota **0**, o assessment deve sinalizar:
**"uso de IA com risco estrutural"**.

## Regra 4 — Qualidade crítica

Se qualquer uma das perguntas **Q15, Q16 ou Q18** tiver nota **0**, o assessment deve sinalizar:
**"uso de IA sem controle suficiente de qualidade"**.

## Regra 5 — Limite para N4/N5

A squad só pode atingir **N4 ou N5** se:

* D3 ≥ 3.0
* D4 ≥ 3.0
* D7 ≥ 2.5

---

# Evidência mínima por dimensão

## D1 Cobertura do SDLC

Exemplos:

* PRD
* ADR
* suíte de teste
* runbook
* postmortem
* documentação de release
* métricas de uso/satisfação do usuário

## D2 Integração no fluxo

Exemplos:

* prints/configuração de IDE
* bot de PR
* YAML de pipeline
* playbook de prompts
* registro de agente
* documentação ou portal da plataforma interna

## D3 Qualidade

Exemplos:

* checklist de review
* dashboard de cobertura
* análise de complexidade
* padrão de PR
* monitoramento pós-deploy

## D4 Segurança

Exemplos:

* política
* guideline de uso
* threat model
* trilha de auditoria
* log de acesso
* regra de DLP

## D5 Dados/conhecimento

Exemplos:

* wiki
* base de conhecimento
* mecanismo de busca/RAG
* ACL
* evidência de atualização de docs

## D6 Pessoas/cultura

Exemplos:

* trilha de treinamento
* registro de workshops
* retrospectivas
* sessões de compartilhamento
* guideline de quando não usar IA

## D7 Medição

Exemplos:

* dashboard de adoção
* métricas de fluxo
* métricas de qualidade
* baseline
* decisões de rollout registradas

---

# Leitura prática do resultado

## N1 — Ad-hoc (score 0.0–0.9)

### O que caracteriza este nível

A squad usa IA de forma esporádica, individual e sem padrão. Pode haver curiosidade ou experiências isoladas, mas sem estrutura. Não existem guidelines, políticas, nem integração com o fluxo de trabalho. Resultados são imprevisíveis e não há rastreabilidade.

### Exemplo de squad N1

Um ou dois devs usam ChatGPT por conta própria para gerar trechos de código. Não há orientação sobre o que pode ou não ser enviado ao modelo. Ninguém sabe quem está usando, para quê, nem se o output foi revisado. Não há política de IA na empresa ou ela é desconhecida.

### Como evoluir de N1 para N2

1. **Definir e comunicar uma política mínima** de uso de IA: ferramentas permitidas, dados proibidos, expectativa de uso.
2. **Habilitar ao menos uma ferramenta** oficial de IA no IDE para a squad (ex.: Copilot, Cursor).
3. **Fazer uma sessão introdutória** (1-2h) sobre como avaliar outputs de IA, limites e riscos básicos.
4. **Identificar 2-3 casos de uso** onde IA pode ajudar no dia a dia (ex.: completions, geração de testes, documentação).
5. **Começar a registrar** informalmente onde IA está sendo usada.

---

## N2 — Assistido (score 1.0–1.9)

### O que caracteriza este nível

A squad usa IA de forma recorrente, mas inconsistente. Algumas pessoas usam mais que outras. Há ferramentas habilitadas, mas pouca padronização. O uso é concentrado em codificação; outras etapas do SDLC (discovery, testes, operação) quase não são cobertas. Controles de segurança e qualidade existem de modo informal.

### Exemplo de squad N2

A maioria dos devs usa Copilot no IDE para completions. Alguns usam chat para tirar dúvidas técnicas. Não há checklist de review específico para IA. A política de uso existe mas poucos conhecem. Não há métricas de adoção nem de impacto. O uso em testes, docs e operação é pontual.

### Como evoluir de N2 para N3

1. **Criar um guideline de uso** documentado e acessível: quando usar IA, quando não usar, como registrar, como revisar.
2. **Expandir o uso para pelo menos 2 etapas além de codificação** (ex.: testes/QA, refinamento de requisitos, documentação).
3. **Adaptar o processo de code review** com critérios explícitos para outputs de IA (checklist de PR).
4. **Montar uma biblioteca de prompts** do time com padrões reutilizáveis por tipo de tarefa.
5. **Garantir que a política de IA** seja conhecida por todos, com exemplos de "faça/não faça".
6. **Distribuir o uso** no time: pair sessions de IA, workshops internos para reduzir concentração em power users.

---

## N3 — Padronizado (score 2.0–2.9)

### O que caracteriza este nível

A squad tem práticas claras e documentadas de uso de IA. Existe guideline, checklist de revisão, e o uso cobre várias etapas do SDLC. IA está integrada ao IDE e a pelo menos parte do fluxo (PR, review ou CI). Há evidências objetivas de adoção. Controles de segurança e qualidade são operacionais. O time compartilha aprendizados e sabe quando não usar IA.

### Exemplo de squad N3

A squad tem um guideline publicado na wiki com exemplos de uso por etapa. O PR template inclui campo "IA utilizada". Há um bot de review integrado. A política de segurança é conhecida e aplicada. Treinamento básico foi feito. A biblioteca de prompts é usada. A cobertura de testes gerada com IA é monitorada. Mas ainda não há métricas claras de impacto (review speed, lead time, defeitos) nem feedback loops formais.

### Como evoluir de N3 para N4

1. **Implementar telemetria de uso** e outcomes: medir adoção (DAU, aceitação), review speed, lead time, taxa de defeitos.
2. **Criar dashboards** que conectem adoção de IA a resultados observáveis (não só "uso", mas "impacto").
3. **Integrar IA ao CI/CD e gates** técnicos (não só IDE e PR): automações de qualidade, SAST, classificação de falhas.
4. **Reforçar controles de segurança** com trilha de auditoria consistente e threat model incluindo riscos de IA.
5. **Formalizar feedback loops**: retrospectiva sobre IA a cada sprint, revisão trimestral de política e playbooks.
6. **Introduzir agentes/automações** com autonomia delimitada e supervisão para tarefas repetitivas.
7. **Garantir D3 e D4 acima de 3.0** — sem isso, a regra de gating impede atingir N4.

---

## N4 — Otimizado (score 3.0–3.6)

### O que caracteriza este nível

A squad mede e otimiza continuamente o uso de IA com base em dados. Telemetria de adoção está conectada a outcomes de engenharia. Decisões de expandir ou limitar uso são orientadas por métricas. IA está integrada ao SDLC de ponta a ponta, com segurança institucionalizada, qualidade sustentável e agentes supervisionados. Há governança operacional com trilha de auditoria, threat model e controles técnicos.

### Exemplo de squad N4

A squad tem um dashboard que mostra: adoção (80% DAU), review speed (caiu 40%), lead time (estável), defeitos (sem aumento), complexidade (sob controle). Agentes executam tarefas de escopo definido com review obrigatório. Threat model cobre riscos de IA. A cada trimestre, a squad revisa métricas e ajusta práticas. A plataforma interna oferece integrações seguras. Dados internos alimentam a IA via RAG com ACL. O time inteiro sabe avaliar, limitar e usar IA com confiança.

### Como evoluir de N4 para N5

1. **Fechar o ciclo de melhoria contínua**: métricas informam não só ajustes pontuais, mas evolução sistemática de processos, ferramentas e treinamento.
2. **Tratar dados e documentação como produto**: ownership, SLA de atualização, qualidade mensurável.
3. **Expandir automações para workflows completos** com orquestração e rastreabilidade ponta a ponta.
4. **Institucionalizar governança de IA** como parte do SDLC (não como processo paralelo): risk scoring contínuo, auditoria integrada.
5. **Desenvolver competências avançadas** no time: context engineering, avaliação de modelos, red teaming.
6. **Garantir D7 acima de 2.5** — medição de valor sólida é pré-requisito.

---

## N5 — IA-nativo (score 3.7–4.0)

### O que caracteriza este nível

IA permeia todo o SDLC da squad com segurança, governança institucionalizada e melhoria contínua sustentada. A squad não apenas usa IA — ela co-cria com IA como parte natural do fluxo. Todas as dimensões estão em nível alto. Há orquestração de agentes com supervisão, feedback loops contínuos, dados internos com SLA, governança integrada ao ciclo de vida e competência distribuída no time. A squad é referência interna.

### Exemplo de squad N5

A squad opera com agentes orquestrados que executam desde geração de código até classificação de incidentes, sempre com supervisão e rastreabilidade. Documentação e dados internos são tratados como produto, com owner e SLA. Métricas de uso, qualidade, segurança e impacto são revisadas continuamente e informam decisões de roadmap. A governança de IA é parte do SDLC, não um add-on. O time realiza red teaming, compartilha aprendizados entre squads e evolui o framework de uso trimestralmente. Novos membros são onboardados com trilha que inclui uso de IA.

### Como manter N5

1. **Reavaliar trimestralmente** com o assessment completo para detectar regressões.
2. **Compartilhar aprendizados** com outras squads: padrões, anti-patterns, métricas de referência.
3. **Acompanhar evolução do ecossistema**: novas ferramentas, novos riscos, novos modelos.
4. **Revisitar threat model e política** a cada mudança relevante no stack ou no mercado de IA.
5. **Manter a cultura de experimentação segura** e evitar complacência — o nível 5 não é permanente.
