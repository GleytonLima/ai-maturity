# Práticas recomendadas para as 44 questões do modelo de maturidade de IA

Este documento consolida práticas recomendadas para apoiar a resposta das 44 questões do modelo de maturidade de IA do repositório. O foco é transformar cada pergunta em ações observáveis, com exemplos de evidência que ajudam a demonstrar aderência ao requisito.

## Como usar este documento

- Use as práticas abaixo como referência para elevar a nota de cada questão.
- Priorize evidências objetivas: políticas, templates, métricas, automações, trilhas de auditoria e rituais do time.
- Evite tratar IA apenas como ferramenta de produtividade isolada; a maturidade aumenta quando há integração ao fluxo, controles, aprendizado contínuo e medição de valor.

## Fontes consultadas

- **[DEFRA-REQ]** DEFRA — *AI in Requirements Engineering*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/technical-dimensions/requirements-engineering.md>
- **[DEFRA-DESIGN]** DEFRA — *AI in System Design*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/technical-dimensions/system-design.md>
- **[DEFRA-QA]** DEFRA — *AI-Enabled Testing & Quality Assurance*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/technical-dimensions/testing-quality-assurance.md>
- **[DEFRA-MON]** DEFRA — *AI in Monitoring & Incident Response*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/technical-dimensions/monitoring-incident-response.md>
- **[DEFRA-GOV]** DEFRA — *AI Governance & Compliance in the SDLC*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/technical-dimensions/governance-compliance.md>
- **[DEFRA-COLLAB]** DEFRA — *Collaboration & Communication Powered by AI*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/technical-dimensions/collaboration-communication.md>
- **[DEFRA-SKILLS]** DEFRA — *AI Skills Development and Training*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/cultural-dimensions/skills-development.md>
- **[DEFRA-VALUE]** DEFRA — *AI Value Measurement and ROI*: <https://raw.githubusercontent.com/defra/ai-sdlc-maturity-assessment/main/cultural-dimensions/value-measurement.md>
- **[AI-MM-SET]** Gigacore — *AI Maturity Model for Software Engineering Teams*: <https://github.com/Gigacore/AI-Maturity-Model>
- **[AI-MM-METHOD]** Gigacore — *Methodology*: <https://raw.githubusercontent.com/Gigacore/AI-Maturity-Model/main/methodology.md>
- **[OWASP-LLM01]** OWASP — *LLM01:2025 Prompt Injection*: <https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/master/2_0_vulns/LLM01_PromptInjection.md>
- **[OWASP-LLM02]** OWASP — *LLM02:2025 Sensitive Information Disclosure*: <https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/master/2_0_vulns/LLM02_SensitiveInformationDisclosure.md>
- **[OWASP-LLM03]** OWASP — *LLM03:2025 Supply Chain*: <https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/master/2_0_vulns/LLM03_SupplyChain.md>
- **[OWASP-LLM09]** OWASP — *LLM09: Overreliance*: <https://raw.githubusercontent.com/OWASP/www-project-top-10-for-large-language-model-applications/master/Archive/1_1_vulns/LLM09_Overreliance.md>
- **[NIST-AI-RMF]** NIST — *AI Risk Management Framework (AI RMF 1.0)*: <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10>
- **[DORA-AI]** DORA/Google Cloud — *AI Capabilities Model*: <https://services.google.com/fh/files/misc/2025_dora_ai_capabilities_model.pdf>

---

## D1 — Cobertura do SDLC

### Q1
**Pergunta:** A squad usa IA em discovery, pesquisa, ideação ou entendimento do problema?

**Práticas recomendadas**
- Usar IA para sintetizar entrevistas, tickets, feedbacks e analytics, sempre com links para as fontes originais.
- Pedir à IA hipóteses, segmentos de usuários e perguntas de investigação, mas validar tudo com PM/UX/negócio antes de priorizar.
- Registrar prompts, insumos e decisões relevantes quando a IA influenciar definição de problema ou oportunidade.

**Evidências sugeridas**
- Resumos de discovery com referências para entrevistas, pesquisas ou dados de produto.
- Templates de discovery que incluam campo “apoio de IA” e validação humana.

**Referências base:** [DEFRA-REQ], [AI-MM-SET], [DORA-AI]

### Q2
**Pergunta:** A squad usa IA para refinar requisitos, critérios de aceitação ou reduzir ambiguidades?

**Práticas recomendadas**
- Usar IA para detectar ambiguidades, dependências, cenários de borda e critérios de aceitação ausentes.
- Adotar um prompt padrão para transformar histórias em formato verificável, com regras de negócio, restrições e exemplos.
- Exigir revisão humana do PO/engenharia antes de promover qualquer requisito gerado ou refinado por IA.

**Evidências sugeridas**
- Checklist de refinamento com item explícito de ambiguidades e edge cases.
- Histórias de usuário com critérios de aceitação melhorados e aprovados pelo time.

**Referências base:** [DEFRA-REQ], [AI-MM-SET]

### Q3
**Pergunta:** A squad usa IA para apoiar design e decisões de arquitetura, incluindo alternativas e trade-offs?

**Práticas recomendadas**
- Solicitar à IA múltiplas alternativas de arquitetura com trade-offs de desempenho, custo, resiliência, segurança e operação.
- Consolidar a análise em ADRs, deixando explícito o que veio da IA e o que foi decidido por arquitetos/engenheiros.
- Validar recomendações com benchmarks, constraints do domínio e padrões internos antes de adoção.

**Evidências sugeridas**
- ADRs com alternativas comparadas e critérios de decisão.
- Revisões arquiteturais que mostrem validação humana e técnica das sugestões.

**Referências base:** [DEFRA-DESIGN], [AI-MM-SET], [OWASP-LLM09]

### Q4
**Pergunta:** O produto e o backlog da squad são orientados por necessidades e resultados do usuário, garantindo que a aceleração com IA não desvie o foco do valor entregue?

**Práticas recomendadas**
- Priorizar itens com base em outcomes de usuário, não apenas em facilidade de implementação acelerada por IA.
- Revisar backlog periodicamente para remover itens que ficaram “atrativos para IA”, mas não conectam com dor real do cliente.
- Exigir hipótese de valor, métrica de sucesso e público afetado para cada item relevante acelerado com IA.

**Evidências sugeridas**
- Backlog com vínculo entre item, problema do usuário e métrica de resultado.
- Rituais de priorização com critérios explícitos de valor e não só de esforço.

**Referências base:** [DEFRA-REQ], [DEFRA-VALUE], [DORA-AI]

### Q5
**Pergunta:** A squad usa IA para geração, manutenção, priorização ou análise de testes e QA?

**Práticas recomendadas**
- Usar IA para sugerir testes unitários, de integração e cenários negativos a partir de mudanças no código e do histórico de falhas.
- Revisar criticamente testes gerados para evitar cobertura superficial, duplicação ou asserções frágeis.
- Medir se o uso de IA aumenta cobertura útil, reduz tempo de manutenção e melhora a detecção de regressões.

**Evidências sugeridas**
- Playbooks para geração e revisão de testes com IA.
- Métricas de cobertura, flakiness, bug escape rate ou tempo de QA.

**Referências base:** [DEFRA-QA], [OWASP-LLM09], [AI-MM-SET]

### Q6
**Pergunta:** A squad usa IA em documentação técnica, documentação de release ou artefatos operacionais?

**Práticas recomendadas**
- Automatizar rascunhos de release notes, changelogs, runbooks e documentação técnica, com revisão humana obrigatória antes de publicar.
- Manter templates padronizados para resumir mudanças, impactos, rollback, riscos e instruções operacionais.
- Validar factualidade, datas, owners, comandos e links para evitar documentação incorreta ou desatualizada.

**Evidências sugeridas**
- Fluxo de publicação que inclua revisão humana e versionamento da documentação.
- Templates de documentação com campos obrigatórios e histórico de atualização.

**Referências base:** [DEFRA-COLLAB], [OWASP-LLM09], [AI-MM-SET]

### Q7
**Pergunta:** A squad usa IA em operação, observabilidade, incidentes, troubleshooting ou runbooks?

**Práticas recomendadas**
- Usar IA para correlacionar logs, métricas e traces, mas manter operadores humanos na decisão final de ações críticas.
- Restringir a IA a recomendar diagnóstico e próximos passos; automações corretivas devem ter guardrails e aprovação conforme risco.
- Medir impacto em MTTD, MTTR, falso positivo e assertividade de causa raiz.

**Evidências sugeridas**
- Runbooks com seção de apoio por IA e limites de autonomia.
- Dashboards ou postmortems mostrando uso de IA em triagem e investigação.

**Referências base:** [DEFRA-MON], [OWASP-LLM09], [AI-MM-SET]

## D2 — Integração no fluxo

### Q8
**Pergunta:** A IA está integrada ao IDE ou ambiente principal de desenvolvimento de forma recorrente?

**Práticas recomendadas**
- Padronizar ferramentas aprovadas de IA no IDE e documentar configurações mínimas, extensões e limites de uso.
- Integrar a IA com contexto do repositório, linguagem e padrões internos para reduzir respostas genéricas.
- Medir adoção recorrente e taxa de aceitação de sugestões, não apenas licenças provisionadas.

**Evidências sugeridas**
- Catálogo de ferramentas homologadas e guias de onboarding.
- Telemetria de uso por time, IDE ou fluxo.

**Referências base:** [AI-MM-SET], [DORA-AI]

### Q9
**Pergunta:** A IA está integrada ao fluxo de PR, code review, backlog, issue tracking ou wiki?

**Práticas recomendadas**
- Integrar bots ou assistentes a PRs, issues e wiki para sugerir revisão, sumarização e ligação entre mudanças e contexto.
- Definir quais sugestões podem ser automáticas e quais dependem de revisão humana antes de aceitar.
- Registrar a atuação da IA nos artefatos relevantes para facilitar rastreabilidade.

**Evidências sugeridas**
- Templates de PR/issue com campo de uso de IA.
- Bots configurados no fluxo com políticas de uso e revisão.

**Referências base:** [DEFRA-COLLAB], [AI-MM-SET], [NIST-AI-RMF]

### Q10
**Pergunta:** A IA está integrada ao pipeline de CI/CD, automações de qualidade ou gates técnicos?

**Práticas recomendadas**
- Usar IA em classificação de falhas, sumarização de causas prováveis e triagem, sem substituir gates determinísticos.
- Manter gates obrigatórios de testes, lint, SAST, política de dependências e revisão humana para código assistido por IA.
- Avaliar periodicamente precisão, ruído e custo das automações com IA no pipeline.

**Evidências sugeridas**
- Workflows de CI/CD com etapas explícitas de análise assistida por IA.
- Critérios documentados para bloqueio, alerta e exceção.

**Referências base:** [AI-MM-SET], [DEFRA-QA], [OWASP-LLM09]

### Q11
**Pergunta:** A squad tem acesso a uma plataforma interna de qualidade que oferece caminhos padronizados, seguros e automatizados para escalar o uso de IA na organização?

**Práticas recomendadas**
- Oferecer uma plataforma interna com modelos aprovados, APIs, guardrails, observabilidade, catálogo de prompts e integrações homologadas.
- Tratar a plataforma como produto: ownership claro, backlog, SLA, trilhas de auditoria e documentação de uso seguro.
- Incluir políticas de acesso, retenção de dados, custos e fallback em caso de indisponibilidade do fornecedor.

**Evidências sugeridas**
- Portal interno ou catálogo de serviços de IA homologados.
- Roadmap, métricas de adoção e owners da plataforma.

**Referências base:** [AI-MM-SET], [DORA-AI], [DEFRA-GOV]

### Q12
**Pergunta:** A squad possui playbooks, biblioteca de prompts, templates ou padrões reutilizáveis para uso de IA?

**Práticas recomendadas**
- Manter prompts e playbooks versionados por caso de uso, com contexto, saída esperada, riscos e exemplos.
- Revisar periodicamente prompts que deixaram de performar ou induzem resultados inseguros.
- Padronizar prompts para tarefas recorrentes: requisitos, testes, review, documentação, investigação de incidentes e ADR.

**Evidências sugeridas**
- Repositório versionado de prompts e templates.
- Histórico de revisão, owners e data de atualização.

**Referências base:** [AI-MM-SET], [AI-MM-METHOD], [OWASP-LLM09]

### Q13
**Pergunta:** A squad utiliza automações com IA no fluxo de trabalho, além de uso manual em chat?

**Práticas recomendadas**
- Automatizar tarefas repetitivas e de baixo risco, como classificação, sumarização, preenchimento de templates e triagem inicial.
- Projetar automações com escopo limitado, critérios de entrada/saída claros e fallback para tratamento manual.
- Medir ganho real de tempo, acurácia e taxa de retrabalho gerados por essas automações.

**Evidências sugeridas**
- Workflows automatizados com logs, owners e critérios de execução.
- Indicadores comparando fluxo manual versus fluxo assistido por IA.

**Referências base:** [AI-MM-SET], [DEFRA-COLLAB], [DEFRA-VALUE]

### Q14
**Pergunta:** A squad utiliza agentes ou assistentes com autonomia delimitada e supervisão humana?

**Práticas recomendadas**
- Definir explicitamente o perímetro de autonomia do agente: o que ele pode ler, sugerir, executar e o que sempre exige aprovação humana.
- Aplicar princípio do menor privilégio para credenciais, ferramentas e dados acessíveis aos agentes.
- Testar agentes com cenários adversariais, falhas de contexto e tentativas de abuso antes de ampliar o escopo.

**Evidências sugeridas**
- Matriz de permissões por agente e playbooks de supervisão.
- Logs de execução, aprovações humanas e trilhas de auditoria.

**Referências base:** [OWASP-LLM01], [OWASP-LLM02], [AI-MM-SET]

## D3 — Qualidade em alta velocidade

### Q15
**Pergunta:** Outputs gerados com IA passam por revisão humana explícita, com critérios adaptados para IA?

**Práticas recomendadas**
- Adotar checklist de revisão específico para IA cobrindo lógica, segurança, aderência a padrões, testes e risco de alucinação.
- Exigir que o autor explique o que foi aceito, ajustado ou descartado da sugestão da IA.
- Diferenciar o nível de revisão conforme criticidade do domínio, impacto em segurança e sensibilidade de dados.

**Evidências sugeridas**
- PR template com itens específicos para artefatos gerados por IA.
- Guias de code review adaptados para IA e exemplos de uso.

**Referências base:** [OWASP-LLM09], [AI-MM-SET], [DEFRA-QA]

### Q16
**Pergunta:** Mudanças geradas com IA passam por testes automatizados, validações e gates confiáveis?

**Práticas recomendadas**
- Submeter toda mudança assistida por IA aos mesmos gates obrigatórios do restante do código, sem exceções por velocidade.
- Complementar testes com validações estáticas, SAST, análise de dependências e políticas de merge.
- Reforçar cobertura em áreas onde a IA tende a errar: bordas, tratamento de erro, concorrência, segurança e contratos.

**Evidências sugeridas**
- Pipeline com testes, lint, segurança e política de merge documentados.
- Relatórios de validação e histórico de falhas detectadas antes do merge.

**Referências base:** [DEFRA-QA], [OWASP-LLM09], [OWASP-LLM03]

### Q17
**Pergunta:** A squad consegue usar IA sem aumentar de forma relevante retrabalho, defeitos ou instabilidade?

**Práticas recomendadas**
- Monitorar retrabalho, rollback, bugs em produção e instabilidade antes e depois da adoção de IA.
- Realizar experimentos controlados por fluxo, tipo de tarefa ou repositório para identificar onde a IA melhora ou piora resultados.
- Corrigir rapidamente práticas que aumentem volume de código inútil, regressões ou dependência excessiva do modelo.

**Evidências sugeridas**
- Comparativos por período mostrando impacto em qualidade e estabilidade.
- Planos de ação quando a IA aumenta defeitos ou retrabalho.

**Referências base:** [DEFRA-VALUE], [OWASP-LLM09], [AI-MM-SET]

### Q18
**Pergunta:** A squad controla o impacto da IA em complexidade, manutenibilidade e dívida técnica?

**Práticas recomendadas**
- Medir complexidade ciclomatica, duplicação, acoplamento, legibilidade e hotspots de manutenção em mudanças assistidas por IA.
- Preferir refactors pequenos, com contexto e constraints explícitas, em vez de grandes blocos gerados automaticamente.
- Registrar débito técnico associado a decisões aceleradas por IA e tratá-lo no backlog.

**Evidências sugeridas**
- Métricas de qualidade estática segmentadas por PR ou tipo de mudança.
- Itens de dívida técnica vinculados a artefatos assistidos por IA.

**Referências base:** [AI-MM-SET], [OWASP-LLM09], [AI-MM-METHOD]

### Q19
**Pergunta:** A squad mantém pequenos lotes, disciplina de versionamento e clareza de autoria ao usar IA?

**Práticas recomendadas**
- Manter PRs pequenos e commits atômicos para facilitar revisão e isolar problemas de mudanças geradas com apoio de IA.
- Identificar claramente a participação de IA em commits, PRs ou descrição de mudança quando isso ajudar auditoria e aprendizado.
- Evitar grandes lotes “gerados de uma vez”, que dificultam revisão crítica e rollback.

**Evidências sugeridas**
- Convenções de commit/PR com rastreabilidade do uso de IA.
- Estatísticas de tamanho de PR e tempo de revisão.

**Referências base:** [AI-MM-SET], [NIST-AI-RMF], [OWASP-LLM09]

### Q20
**Pergunta:** A squad monitora o comportamento de mudanças assistidas por IA após merge ou deploy?

**Práticas recomendadas**
- Observar métricas de erro, latência, disponibilidade e comportamento funcional logo após deploys com forte apoio de IA.
- Criar alertas e períodos de observação reforçada para mudanças em áreas críticas.
- Levar aprendizados de produção de volta para prompts, playbooks, critérios de revisão e treinamento.

**Evidências sugeridas**
- Dashboards, alertas e post-deploy checks segmentados por mudança.
- Registros de ajustes em prompts ou controles após incidentes/retrabalho.

**Referências base:** [DEFRA-MON], [DEFRA-VALUE], [AI-MM-SET]

## D4 — Segurança, privacidade, IP e compliance

### Q21
**Pergunta:** Existe política clara sobre ferramentas de IA permitidas, usos proibidos e tipos de dados restritos?

**Práticas recomendadas**
- Publicar política simples e operacional definindo ferramentas aprovadas, casos proibidos, exceções e owners.
- Classificar dados por sensibilidade e deixar explícito o que nunca pode ser enviado a modelos externos.
- Revisar a política periodicamente com base em incidentes, mudanças regulatórias e novas ferramentas.

**Evidências sugeridas**
- Política corporativa ou guideline de squad acessível e atualizado.
- Registro de comunicação, treinamento e aceite da política.

**Referências base:** [DEFRA-GOV], [OWASP-LLM02], [DORA-AI]

### Q22
**Pergunta:** A squad entende e aplica regras sobre privacidade, segredos, dados sensíveis e vazamento de informação?

**Práticas recomendadas**
- Treinar o time para nunca inserir segredos, PII, dados contratuais ou dados de clientes em prompts sem controle aprovado.
- Aplicar redaction, tokenização, DLP e validação de entrada para reduzir risco de exposição acidental.
- Garantir retenção mínima, transparência de uso dos dados e opt-out quando aplicável.

**Evidências sugeridas**
- Controles técnicos de mascaramento/redação e políticas de retenção.
- Material de treinamento e exemplos de uso proibido.

**Referências base:** [OWASP-LLM02], [NIST-AI-RMF], [DEFRA-GOV]

### Q23
**Pergunta:** A squad considera riscos de IP, licenciamento, direitos autorais e origem do conteúdo gerado por IA?

**Práticas recomendadas**
- Verificar licenças de código, modelos, datasets e snippets sugeridos antes de incorporar em produto ou documentação.
- Exigir rastreabilidade mínima da origem de componentes externos e políticas para aceitar ou rejeitar sugestões de IA suspeitas.
- Envolver jurídico/compliance em fluxos mais sensíveis, como código de terceiros, assets criativos ou datasets proprietários.

**Evidências sugeridas**
- Política de licenciamento para uso de IA e terceiros.
- Ferramentas ou checklists de revisão de licenças e procedência.

**Referências base:** [OWASP-LLM03], [DEFRA-GOV], [NIST-AI-RMF]

### Q24
**Pergunta:** Existe trilha de auditoria ou registro mínimo do uso de IA em artefatos relevantes?

**Práticas recomendadas**
- Registrar quando IA participou de PRs, documentação crítica, decisões arquiteturais, automações ou incidentes relevantes.
- Manter logs suficientes para auditoria sem capturar dados sensíveis desnecessários.
- Padronizar metadados mínimos: ferramenta, finalidade, responsável humano, data e decisão final.

**Evidências sugeridas**
- Templates de PR/ADR/issue com campo de uso de IA.
- Logs e labels que permitam consultas e auditorias posteriores.

**Referências base:** [NIST-AI-RMF], [DEFRA-GOV], [AI-MM-SET]

### Q25
**Pergunta:** A squad incorpora riscos de IA no threat modeling do produto e/ou do fluxo de engenharia (quando aplicável), incluindo prompt injection, overreliance e supply chain?

**Práticas recomendadas**
- Incluir no threat model cenários de prompt injection, exposição de dados, dependência excessiva, modelo comprometido e cadeia de suprimentos.
- Tratar documentos, websites, arquivos e bases externas como conteúdo não confiável quando alimentarem RAG, agentes ou automações.
- Revisar o modelo de ameaças sempre que novos agentes, integrações, modelos ou fontes de contexto forem adicionados.

**Evidências sugeridas**
- Threat models com cenários específicos de IA e mitigação definida.
- Checklists de arquitetura/segurança atualizados para IA generativa.

**Referências base:** [OWASP-LLM01], [OWASP-LLM03], [OWASP-LLM09]

### Q26
**Pergunta:** Existem controles operacionais ou técnicos para prevenir uso inseguro de IA no fluxo de desenvolvimento?

**Práticas recomendadas**
- Bloquear ferramentas não homologadas, limitar egress, aplicar proxies seguros e configurar allowlists de provedores.
- Integrar scanners, políticas e validações para detectar padrões inseguros em código, prompts, dependências e exfiltração.
- Exigir aprovação adicional para uso de IA em contextos de alto risco, como billing, segurança, compliance e dados sensíveis.

**Evidências sugeridas**
- Gateways, proxies, regras de rede ou controles de endpoint para IA.
- Políticas técnicas no CI/CD e no ambiente de desenvolvimento.

**Referências base:** [OWASP-LLM01], [OWASP-LLM02], [DEFRA-GOV]

## D5 — Dados e conhecimento acessíveis à IA

### Q27
**Pergunta:** A documentação e o conhecimento interno são encontráveis, atualizados e úteis para humanos e IA?

**Práticas recomendadas**
- Organizar documentação por domínio, owner, data de revisão e termos de busca conhecidos do time.
- Padronizar estrutura, nomenclatura, exemplos e metadados para facilitar consumo humano e indexação por IA.
- Remover ou arquivar conteúdo obsoleto para reduzir respostas erradas baseadas em material vencido.

**Evidências sugeridas**
- Wiki ou portal com owners, datas de revisão e taxonomia definida.
- Indicadores de busca, atualização e satisfação com a documentação.

**Referências base:** [DEFRA-COLLAB], [AI-MM-SET], [DORA-AI]

### Q28
**Pergunta:** A squad documenta decisões importantes de forma que o conhecimento possa ser reutilizado posteriormente?

**Práticas recomendadas**
- Registrar ADRs, decisões operacionais e acordos de arquitetura com contexto, alternativas, trade-offs e decisão final.
- Versionar decisões junto do código ou em base documental com histórico claro.
- Usar IA para resumir decisões antigas, mas preservar o artefato oficial aprovado pelo time.

**Evidências sugeridas**
- Repositório de ADRs ou decision logs versionados.
- Templates de decisão com contexto, impacto e revisões.

**Referências base:** [DEFRA-DESIGN], [DEFRA-COLLAB], [AI-MM-SET]

### Q29
**Pergunta:** A squad consegue responder dúvidas técnicas relevantes com rapidez usando base interna e contexto confiável?

**Práticas recomendadas**
- Melhorar a base interna até que perguntas frequentes possam ser respondidas por busca ou assistente com boa precisão.
- Medir tempo para encontrar respostas e lacunas recorrentes de conhecimento por tema.
- Criar fluxo de feedback para corrigir respostas incompletas, quebradas ou desatualizadas do assistente.

**Evidências sugeridas**
- Indicadores de tempo médio para encontrar informação relevante.
- Registro de gaps de documentação corrigidos a partir de dúvidas recorrentes.

**Referências base:** [DEFRA-COLLAB], [AI-MM-SET], [DEFRA-VALUE]

### Q30
**Pergunta:** A squad oferece à IA acesso a contexto interno seguro, como docs, código, padrões e histórico relevante?

**Práticas recomendadas**
- Expor contexto interno por mecanismos seguros de RAG, MCP ou conectores aprovados, com escopo mínimo necessário.
- Preferir fontes canônicas e curadas para reduzir alucinação e respostas conflitantes.
- Manter separação clara entre conteúdo confiável, conteúdo externo e conteúdo não verificado.

**Evidências sugeridas**
- Arquitetura de integração com fontes internas e critérios de indexação.
- Lista de repositórios, wikis e bases permitidas para uso por assistentes.

**Referências base:** [OWASP-LLM01], [OWASP-LLM02], [AI-MM-SET]

### Q31
**Pergunta:** Esse acesso a contexto interno possui controle de acesso, rastreabilidade e proteção adequada?

**Práticas recomendadas**
- Fazer o assistente respeitar ACLs, papéis, segregação de ambiente e classificação de dados.
- Logar consultas relevantes, acessos a fontes e decisões automatizadas, preservando privacidade e necessidade mínima.
- Aplicar filtros de segurança para redigir dados sensíveis antes de envio ao modelo ou retorno ao usuário.

**Evidências sugeridas**
- Logs de acesso, políticas de autorização e trilhas de auditoria.
- Evidência de enforcement de ACLs e filtros de dados.

**Referências base:** [OWASP-LLM02], [NIST-AI-RMF], [OWASP-LLM01]

### Q32
**Pergunta:** A qualidade, atualização e ownership dos dados e conhecimento são tratadas como fundamento para uso eficaz da IA?

**Práticas recomendadas**
- Definir owners por domínio de conhecimento, SLAs de atualização e critérios mínimos de qualidade documental.
- Incluir dados e documentação críticos em rituais de revisão, especialmente após releases, incidentes e mudanças arquiteturais.
- Priorizar correção de conteúdo que gera respostas erradas, duplicadas ou inconsistentes para humanos e IA.

**Evidências sugeridas**
- Mapa de ownership da documentação e acordos de atualização.
- Backlog de melhoria de qualidade de dados/conhecimento.

**Referências base:** [AI-MM-SET], [AI-MM-METHOD], [DEFRA-COLLAB]

## D6 — Pessoas e cultura

### Q33
**Pergunta:** A squad recebeu treinamento mínimo sobre como usar IA, avaliar respostas e reconhecer limites e riscos?

**Práticas recomendadas**
- Oferecer treinamento base cobrindo prompting, validação de respostas, privacidade, segurança, direitos autorais e limites do modelo.
- Incluir exercícios práticos com exemplos de alucinação, viés, código inseguro e vazamento de dados.
- Atualizar o conteúdo periodicamente conforme mudam ferramentas, políticas e riscos.

**Evidências sugeridas**
- Trilhas de capacitação, workshops ou materiais de onboarding.
- Registros de participação e avaliações de aprendizagem.

**Referências base:** [DEFRA-SKILLS], [OWASP-LLM09], [OWASP-LLM02]

### Q34
**Pergunta:** O uso de IA está distribuído no time, em vez de concentrado em poucos power users?

**Práticas recomendadas**
- Medir adoção por função e pessoa para identificar concentração excessiva e dependência de poucos especialistas.
- Estimular pairing, sessões de shadowing e demonstrações práticas para difundir repertório.
- Garantir que padrões e prompts não fiquem implícitos em indivíduos, mas versionados e acessíveis ao time.

**Evidências sugeridas**
- Telemetria de adoção por squad e papel.
- Sessões internas de capacitação e troca de práticas.

**Referências base:** [DEFRA-SKILLS], [DORA-AI], [AI-MM-SET]

### Q35
**Pergunta:** A squad sabe explicitar quando não usar IA ou quando exigir revisão reforçada?

**Práticas recomendadas**
- Listar cenários de alto risco em que IA é proibida ou só pode ser usada com revisão adicional.
- Definir exemplos concretos: lógica regulatória, dados sensíveis, segurança, billing, contratos ou decisões irreversíveis.
- Incluir essa decisão em checklists de refinamento, desenvolvimento e review.

**Evidências sugeridas**
- Guideline com “quando usar / quando não usar / quando escalar revisão”.
- Templates de PR ou decisão com classificação de risco.

**Referências base:** [OWASP-LLM09], [DEFRA-GOV], [NIST-AI-RMF]

### Q36
**Pergunta:** O time compartilha boas práticas, prompts, exemplos, aprendizados e padrões de uso de IA?

**Práticas recomendadas**
- Criar espaço recorrente para compartilhar prompts, erros comuns, exemplos aprovados e anti-patterns.
- Curar o que funciona para o contexto da squad e registrar lições aprendidas de forma reutilizável.
- Transformar aprendizados recorrentes em templates, guias ou automações.

**Evidências sugeridas**
- Canal, wiki, comunidade de prática ou reuniões periódicas sobre IA.
- Repositório com exemplos aprovados e histórico de melhorias.

**Referências base:** [DEFRA-SKILLS], [DEFRA-COLLAB], [AI-MM-SET]

### Q37
**Pergunta:** A liderança e o ambiente da squad favorecem experimentação segura, com clareza e segurança psicológica?

**Práticas recomendadas**
- Incentivar experimentos pequenos, reversíveis e com critérios claros de sucesso, sem punir tentativas bem controladas que não geram ganho.
- Dar clareza sobre limites de uso, ferramentas aprovadas e riscos, evitando medo ou uso escondido.
- Reconhecer aprendizado compartilhado, não apenas volume de uso ou percepção de produtividade.

**Evidências sugeridas**
- Rituais de experimentação com hipóteses e critérios de segurança.
- Comunicação da liderança e política clara de uso responsável.

**Referências base:** [DORA-AI], [DEFRA-SKILLS], [AI-MM-SET]

### Q38
**Pergunta:** A squad realiza retrospectivas, revisões ou ciclos de aprendizado específicos sobre uso de IA?

**Práticas recomendadas**
- Reservar espaço nas retrospectivas para discutir onde a IA ajudou, atrapalhou, gerou risco ou exigiu retrabalho.
- Revisar prompts, ferramentas, integrações e controles com base em incidentes, falhas e ganhos observados.
- Converter aprendizados em experimentos, padrões ou mudanças de política.

**Evidências sugeridas**
- Atas de retrospectiva com ações específicas sobre IA.
- Backlog de melhorias derivado de feedback loops de IA.

**Referências base:** [AI-MM-METHOD], [DEFRA-VALUE], [AI-MM-SET]

## D7 — Medição de valor e feedback loops

### Q39
**Pergunta:** A squad mede adoção e intensidade de uso de IA por meio de telemetria ou dados objetivos?

**Práticas recomendadas**
- Medir usuários ativos, frequência de uso, taxa de aceitação, volume de automações e cobertura por função/time.
- Evitar usar apenas licenças adquiridas como proxy de adoção real.
- Interpretar intensidade com contexto: tipo de tarefa, criticidade e custo.

**Evidências sugeridas**
- Dashboards de adoção por squad, ferramenta e período.
- Indicadores de uso manual e automatizado.

**Referências base:** [DEFRA-VALUE], [DORA-AI], [AI-MM-SET]

### Q40
**Pergunta:** A squad mede impacto em fluxo de engenharia, como review speed, lead time, throughput ou cycle time?

**Práticas recomendadas**
- Definir um conjunto pequeno de métricas de fluxo e acompanhar evolução antes/depois da adoção de IA.
- Segmentar a análise por tipo de tarefa para evitar conclusões enviesadas.
- Cruzar ganhos de velocidade com carga de revisão e retrabalho para confirmar benefício real.

**Evidências sugeridas**
- Dashboards de lead time, cycle time, throughput ou review time.
- Comparativos por fluxo, time ou tipo de automação.

**Referências base:** [DEFRA-VALUE], [AI-MM-SET], [DORA-AI]

### Q41
**Pergunta:** A squad mede impacto em qualidade e estabilidade, como defeitos, incidentes, retrabalho ou debt?

**Práticas recomendadas**
- Medir bugs, incidentes, rollback, retrabalho, complexidade e dívida técnica nas áreas mais assistidas por IA.
- Tratar qualidade e estabilidade como contrapeso obrigatório às métricas de velocidade.
- Investigar causalidade antes de expandir o uso de IA em fluxos que pioram o resultado final.

**Evidências sugeridas**
- Indicadores de qualidade segmentados por período, sistema ou tipo de mudança.
- Relatórios de revisão quando a IA acelera, mas aumenta custo de manutenção.

**Referências base:** [DEFRA-VALUE], [OWASP-LLM09], [AI-MM-SET]

### Q42
**Pergunta:** A squad compara percepções sobre ganho com IA com resultados observáveis, evitando métricas de vaidade?

**Práticas recomendadas**
- Confrontar opiniões do time com métricas observáveis e resultados de negócio ou engenharia.
- Evitar concluir sucesso com base apenas em satisfação subjetiva, quantidade de prompts ou volume de código gerado.
- Revisar continuamente hipóteses que “pareciam boas”, mas não produziram melhoria verificável.

**Evidências sugeridas**
- Comparativos entre percepção de ganho e métricas reais.
- Rituais de revisão em que hipóteses são confirmadas ou descartadas por dados.

**Referências base:** [DEFRA-VALUE], [DORA-AI], [AI-MM-METHOD]

### Q43
**Pergunta:** A squad usa essas métricas para priorizar onde expandir, limitar ou ajustar o uso de IA?

**Práticas recomendadas**
- Ampliar uso de IA onde houver evidência consistente de ganho com risco controlado.
- Reduzir ou redesenhar o uso em fluxos que geram ruído, defeitos, alto custo ou baixa confiabilidade.
- Priorizar investimentos em treinamento, integrações e playbooks com base nos gargalos mostrados pelos dados.

**Evidências sugeridas**
- Roadmap ou backlog de melhoria guiado por métricas.
- Decisões explícitas de expandir, limitar ou ajustar casos de uso.

**Referências base:** [DEFRA-VALUE], [AI-MM-SET], [DORA-AI]

### Q44
**Pergunta:** A squad mantém feedback loops contínuos para revisar práticas, ferramentas, controles e treinamento?

**Práticas recomendadas**
- Estabelecer ciclos regulares para revisar métricas, políticas, prompts, integrações, riscos e necessidades de capacitação.
- Atualizar rapidamente controles e orientações depois de incidentes, auditorias ou mudanças importantes no ecossistema de IA.
- Tratar IA como capability contínua da engenharia, e não como rollout único.

**Evidências sugeridas**
- Calendário de revisões, owners e atas de decisão.
- Histórico de mudanças em políticas, playbooks e treinamentos baseado em dados.

**Referências base:** [AI-MM-METHOD], [DEFRA-VALUE], [NIST-AI-RMF]
