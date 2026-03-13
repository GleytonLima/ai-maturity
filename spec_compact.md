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

### Q2

A squad usa IA para **refinar requisitos, critérios de aceitação ou reduzir ambiguidades**?

### Q3

A squad usa IA para apoiar **design e decisões de arquitetura**, incluindo alternativas e trade-offs?

## Capacidade D1C2 — Uso em delivery e run

### Q4

A squad usa IA para **geração, manutenção, priorização ou análise de testes/QA**?

### Q5

A squad usa IA em **documentação técnica, documentação de release ou artefatos operacionais**?

### Q6

A squad usa IA em **operação, observabilidade, incidentes, troubleshooting ou runbooks**?

---

# D2. Integração no fluxo

## Capacidade D2C1 — Integração com toolchain

### Q7

A IA está integrada ao **IDE ou ambiente principal de desenvolvimento** de forma recorrente?

### Q8

A IA está integrada ao fluxo de **PR, code review, backlog, issue tracking ou wiki**?

### Q9

A IA está integrada ao **pipeline de CI/CD, automações de qualidade ou gates técnicos**?

## Capacidade D2C2 — Automação e agentes

### Q10

A squad possui **playbooks, biblioteca de prompts, templates ou padrões reutilizáveis** para uso de IA?

### Q11

A squad utiliza **automações com IA** no fluxo de trabalho, além de uso manual em chat?

### Q12

A squad utiliza **agentes ou assistentes com autonomia delimitada e supervisão humana**?

---

# D3. Qualidade em alta velocidade

## Capacidade D3C1 — Controles de qualidade

### Q13

Outputs gerados com IA passam por **revisão humana explícita**, com critérios adaptados para IA?

### Q14

Mudanças geradas com IA passam por **testes automatizados, validações e gates confiáveis**?

### Q15

A squad consegue usar IA sem aumentar de forma relevante **retrabalho, defeitos ou instabilidade**?

## Capacidade D3C2 — Sustentabilidade técnica

### Q16

A squad controla o impacto da IA em **complexidade, manutenibilidade e dívida técnica**?

### Q17

A squad mantém **pequenos lotes, disciplina de versionamento e clareza de autoria** ao usar IA?

### Q18

A squad monitora o comportamento de mudanças assistidas por IA **após merge ou deploy**?

---

# D4. Segurança, privacidade, IP e compliance

## Capacidade D4C1 — Governança e política

### Q19

Existe política clara sobre **ferramentas de IA permitidas, usos proibidos e tipos de dados restritos**?

### Q20

A squad entende e aplica regras sobre **privacidade, segredos, dados sensíveis e vazamento de informação**?

### Q21

A squad considera riscos de **IP, licenciamento, direitos autorais e origem do conteúdo gerado por IA**?

## Capacidade D4C2 — Controles de risco no fluxo

### Q22

Existe **trilha de auditoria** ou registro mínimo do uso de IA em artefatos relevantes?

### Q23

A squad incorpora riscos de IA no **threat modeling**, incluindo prompt injection, overreliance e supply chain?

### Q24

Existem **controles operacionais ou técnicos** para prevenir uso inseguro de IA no fluxo de desenvolvimento?

---

# D5. Dados e conhecimento acessíveis à IA

## Capacidade D5C1 — Conhecimento encontrável

### Q25

A documentação e o conhecimento interno são **encontráveis, atualizados e úteis** para humanos e IA?

### Q26

A squad documenta decisões importantes de forma que o conhecimento possa ser **reutilizado posteriormente**?

### Q27

A squad consegue responder dúvidas técnicas relevantes com rapidez usando **base interna e contexto confiável**?

## Capacidade D5C2 — Contexto seguro para IA

### Q28

A squad oferece à IA acesso a **contexto interno seguro**, como docs, código, padrões e histórico relevante?

### Q29

Esse acesso a contexto interno possui **controle de acesso, rastreabilidade e proteção adequada**?

### Q30

A qualidade, atualização e ownership dos dados/conhecimento são tratadas como **fundamento para uso eficaz da IA**?

---

# D6. Pessoas e cultura

## Capacidade D6C1 — Habilidades e confiança

### Q31

A squad recebeu treinamento mínimo sobre **como usar IA, avaliar respostas e reconhecer limites/riscos**?

### Q32

O uso de IA está distribuído no time, em vez de concentrado em **poucos power users**?

### Q33

A squad sabe explicitar **quando não usar IA** ou quando exigir revisão reforçada?

## Capacidade D6C2 — Colaboração e aprendizado

### Q34

O time compartilha **boas práticas, prompts, exemplos, aprendizados e padrões** de uso de IA?

### Q35

A liderança e o ambiente da squad favorecem **experimentação segura**, com clareza e segurança psicológica?

### Q36

A squad realiza **retrospectivas, revisões ou ciclos de aprendizado** específicos sobre uso de IA?

---

# D7. Medição de valor e feedback loops

## Capacidade D7C1 — Telemetria e outcomes

### Q37

A squad mede **adoção e intensidade de uso** de IA por meio de telemetria ou dados objetivos?

### Q38

A squad mede impacto em **fluxo de engenharia**, como review speed, lead time, throughput ou cycle time?

### Q39

A squad mede impacto em **qualidade e estabilidade**, como defeitos, incidentes, retrabalho ou debt?

## Capacidade D7C2 — Aprendizado orientado a dados

### Q40

A squad compara percepções sobre ganho com IA com **resultados observáveis**, evitando métricas de vaidade?

### Q41

A squad usa essas métricas para **priorizar onde expandir, limitar ou ajustar** o uso de IA?

### Q42

A squad mantém **feedback loops contínuos** para revisar práticas, ferramentas, controles e treinamento?

---

# Estrutura resumida

| Dimensão                                | Capacidade                    | Perguntas |
| --------------------------------------- | ----------------------------- | --------- |
| Cobertura do SDLC                       | Uso pré-código                | Q1–Q3     |
| Cobertura do SDLC                       | Uso em delivery e run         | Q4–Q6     |
| Integração no fluxo                     | Integração com toolchain      | Q7–Q9     |
| Integração no fluxo                     | Automação e agentes           | Q10–Q12   |
| Qualidade em alta velocidade            | Controles de qualidade        | Q13–Q15   |
| Qualidade em alta velocidade            | Sustentabilidade técnica      | Q16–Q18   |
| Segurança, privacidade, IP e compliance | Governança e política         | Q19–Q21   |
| Segurança, privacidade, IP e compliance | Controles de risco no fluxo   | Q22–Q24   |
| Dados e conhecimento acessíveis à IA    | Conhecimento encontrável      | Q25–Q27   |
| Dados e conhecimento acessíveis à IA    | Contexto seguro para IA       | Q28–Q30   |
| Pessoas e cultura                       | Habilidades e confiança       | Q31–Q33   |
| Pessoas e cultura                       | Colaboração e aprendizado     | Q34–Q36   |
| Medição de valor e feedback loops       | Telemetria e outcomes         | Q37–Q39   |
| Medição de valor e feedback loops       | Aprendizado orientado a dados | Q40–Q42   |

---

# Regras de scoring

## Score por pergunta

Cada pergunta recebe nota de 0 a 4.

## Score por capacidade

Média simples das 3 perguntas da capacidade.

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

Se qualquer uma das perguntas **Q19, Q20, Q22 ou Q23** tiver nota **0**, o assessment deve sinalizar:
**“uso de IA com risco estrutural”**.

## Regra 4 — Qualidade crítica

Se qualquer uma das perguntas **Q13, Q14 ou Q16** tiver nota **0**, o assessment deve sinalizar:
**“uso de IA sem controle suficiente de qualidade”**.

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

## D2 Integração no fluxo

Exemplos:

* prints/configuração de IDE
* bot de PR
* YAML de pipeline
* playbook de prompts
* registro de agente

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

## N1 — Ad-hoc

Uso pontual, pouco controlado, sem integração nem evidência.

## N2 — Assistido

Uso recorrente, mas ainda inconsistente, com baixa padronização.

## N3 — Padronizado

Práticas claras no time, evidência mínima e controles já operacionais.

## N4 — Otimizado

Uso integrado, medido e ajustado com base em dados.

## N5 — IA-nativo

IA permeia o SDLC com segurança, governança e melhoria contínua.
