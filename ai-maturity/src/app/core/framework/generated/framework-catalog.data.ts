import type { FrameworkCatalog } from '../../models/ai-maturity.models';

export const FRAMEWORK_CATALOG: FrameworkCatalog = {
  "version": "v1",
  "title": "Framework compacto de maturidade de IA no SDLC",
  "manifest": {
    "version": "v1",
    "title": "Framework compacto de maturidade de IA no SDLC",
    "weights": {
      "D1": 1,
      "D2": 1.1,
      "D3": 1.3,
      "D4": 1.5,
      "D5": 1.1,
      "D6": 1,
      "D7": 1.2
    },
    "scale": {
      "min": 0,
      "max": 4,
      "labels": {
        "0": "Nao praticado",
        "1": "Poucos fazem, sem padrao",
        "2": "Time faz, sem consistencia",
        "3": "Padronizado e documentado",
        "4": "Medido e otimizado"
      },
      "hints": {
        "0": "Ninguem no time faz isso, ou e proibido pela organizacao.",
        "1": "1-2 pessoas fazem por conta propria, sem orientacao nem visibilidade para o time.",
        "2": "O time adotou a pratica, mas cada pessoa faz de um jeito diferente, sem padrao definido.",
        "3": "Existe um padrao claro, documentado e seguido pelo time, com evidencias objetivas.",
        "4": "Alem de padronizado, o time mede resultados e ajusta a pratica continuamente com base em dados."
      }
    },
    "scoring": {
      "question": "score direto de 0 a 4",
      "capability": "media simples das perguntas da capacidade",
      "dimension": "media simples de 2 capacidades",
      "overall": "media ponderada das 7 dimensoes"
    },
    "levelThresholds": [
      {
        "min": 0,
        "max": 0.9,
        "level": "N1",
        "label": "Ad-hoc",
        "description": "A squad usa IA de forma esporadica, individual e sem padrao. Pode haver curiosidade ou experiencias isoladas, mas sem estrutura. Nao existem guidelines, politicas, nem integracao com o fluxo de trabalho.",
        "example": "Um ou dois devs usam ChatGPT por conta propria para gerar trechos de codigo. Nao ha orientacao sobre o que pode ou nao ser enviado ao modelo. Ninguem sabe quem esta usando, para que, nem se o output foi revisado.",
        "evolution": [
          "Definir e comunicar uma politica minima de uso de IA: ferramentas permitidas, dados proibidos, expectativa de uso.",
          "Habilitar ao menos uma ferramenta oficial de IA no IDE para a squad.",
          "Fazer uma sessao introdutoria (1-2h) sobre como avaliar outputs de IA, limites e riscos basicos.",
          "Identificar 2-3 casos de uso onde IA pode ajudar no dia a dia.",
          "Comecar a registrar informalmente onde IA esta sendo usada."
        ]
      },
      {
        "min": 1,
        "max": 1.9,
        "level": "N2",
        "label": "Assistido",
        "description": "A squad usa IA de forma recorrente, mas inconsistente. Algumas pessoas usam mais que outras. Ha ferramentas habilitadas, mas pouca padronizacao. O uso e concentrado em codificacao; outras etapas do SDLC quase nao sao cobertas.",
        "example": "A maioria dos devs usa Copilot no IDE para completions. Alguns usam chat para tirar duvidas tecnicas. Nao ha checklist de review especifico para IA. A politica de uso existe mas poucos conhecem. Nao ha metricas de adocao nem de impacto.",
        "evolution": [
          "Criar um guideline de uso documentado e acessivel: quando usar IA, quando nao usar, como registrar, como revisar.",
          "Expandir o uso para pelo menos 2 etapas alem de codificacao (ex.: testes/QA, refinamento de requisitos, documentacao).",
          "Adaptar o processo de code review com criterios explicitos para outputs de IA.",
          "Montar uma biblioteca de prompts do time com padroes reutilizaveis por tipo de tarefa.",
          "Garantir que a politica de IA seja conhecida por todos, com exemplos praticos.",
          "Distribuir o uso no time: pair sessions de IA, workshops internos."
        ]
      },
      {
        "min": 2,
        "max": 2.9,
        "level": "N3",
        "label": "Padronizado",
        "description": "A squad tem praticas claras e documentadas de uso de IA. Existe guideline, checklist de revisao, e o uso cobre varias etapas do SDLC. IA esta integrada ao IDE e a pelo menos parte do fluxo (PR, review ou CI). Ha evidencias objetivas de adocao e controles de seguranca e qualidade operacionais.",
        "example": "A squad tem um guideline publicado na wiki com exemplos de uso por etapa. O PR template inclui campo 'IA utilizada'. Ha um bot de review integrado. A politica de seguranca e conhecida e aplicada. Treinamento basico foi feito. Mas ainda nao ha metricas claras de impacto nem feedback loops formais.",
        "evolution": [
          "Implementar telemetria de uso e outcomes: medir adocao (DAU, aceitacao), review speed, lead time, taxa de defeitos.",
          "Criar dashboards que conectem adocao de IA a resultados observaveis.",
          "Integrar IA ao CI/CD e gates tecnicos: automacoes de qualidade, SAST, classificacao de falhas.",
          "Reforcar controles de seguranca com trilha de auditoria consistente e threat model incluindo riscos de IA.",
          "Formalizar feedback loops: retrospectiva sobre IA a cada sprint, revisao trimestral de politica e playbooks.",
          "Introduzir agentes/automacoes com autonomia delimitada e supervisao.",
          "Garantir D3 e D4 acima de 3.0 — sem isso, a regra de gating impede atingir N4."
        ]
      },
      {
        "min": 3,
        "max": 3.6,
        "level": "N4",
        "label": "Otimizado",
        "description": "A squad mede e otimiza continuamente o uso de IA com base em dados. Telemetria de adocao esta conectada a outcomes de engenharia. Decisoes de expandir ou limitar uso sao orientadas por metricas. IA esta integrada ao SDLC de ponta a ponta, com seguranca institucionalizada e agentes supervisionados.",
        "example": "A squad tem um dashboard que mostra: adocao (80% DAU), review speed (caiu 40%), lead time (estavel), defeitos (sem aumento), complexidade (sob controle). Agentes executam tarefas de escopo definido com review obrigatorio. Threat model cobre riscos de IA. A plataforma interna oferece integracoes seguras.",
        "evolution": [
          "Fechar o ciclo de melhoria continua: metricas informam evolucao sistematica de processos, ferramentas e treinamento.",
          "Tratar dados e documentacao como produto: ownership, SLA de atualizacao, qualidade mensuravel.",
          "Expandir automacoes para workflows completos com orquestracao e rastreabilidade ponta a ponta.",
          "Institucionalizar governanca de IA como parte do SDLC: risk scoring continuo, auditoria integrada.",
          "Desenvolver competencias avancadas no time: context engineering, avaliacao de modelos, red teaming.",
          "Garantir D7 acima de 2.5 — medicao de valor solida e pre-requisito."
        ]
      },
      {
        "min": 3.7,
        "max": 4,
        "level": "N5",
        "label": "IA-nativo",
        "description": "IA permeia todo o SDLC da squad com seguranca, governanca institucionalizada e melhoria continua sustentada. A squad nao apenas usa IA — ela co-cria com IA como parte natural do fluxo. Todas as dimensoes estao em nivel alto com orquestracao de agentes, feedback loops continuos e competencia distribuida.",
        "example": "A squad opera com agentes orquestrados que executam desde geracao de codigo ate classificacao de incidentes, sempre com supervisao e rastreabilidade. Documentacao e dados internos sao tratados como produto. Metricas de uso, qualidade, seguranca e impacto sao revisadas continuamente. Novos membros sao onboardados com trilha que inclui uso de IA.",
        "evolution": [
          "Reavaliar trimestralmente com o assessment completo para detectar regressoes.",
          "Compartilhar aprendizados com outras squads: padroes, anti-patterns, metricas de referencia.",
          "Acompanhar evolucao do ecossistema: novas ferramentas, novos riscos, novos modelos.",
          "Revisitar threat model e politica a cada mudanca relevante no stack ou no mercado de IA.",
          "Manter a cultura de experimentacao segura e evitar complacencia — o nivel 5 nao e permanente."
        ]
      }
    ],
    "gating": {
      "maxLevelIfBelow": [
        {
          "dimensionCode": "D3",
          "threshold": 2,
          "level": "N2",
          "reason": "Qualidade abaixo do minimo para escalar o uso de IA."
        },
        {
          "dimensionCode": "D4",
          "threshold": 2,
          "level": "N2",
          "reason": "Seguranca abaixo do minimo para escalar o uso de IA."
        }
      ],
      "requiredForAdvancedLevels": [
        {
          "dimensionCode": "D3",
          "threshold": 3
        },
        {
          "dimensionCode": "D4",
          "threshold": 3
        },
        {
          "dimensionCode": "D7",
          "threshold": 2.5
        }
      ]
    },
    "alerts": {
      "structuralRisk": ["Q21", "Q22", "Q24", "Q25"],
      "qualityRisk": ["Q15", "Q16", "Q18"]
    }
  },
  "dimensions": [
    {
      "code": "D1",
      "title": "Cobertura do SDLC",
      "weight": 1,
      "capacities": [
        {
          "code": "D1C1",
          "title": "Uso pre-codigo",
          "questions": [
            {
              "code": "Q1",
              "prompt": "A squad usa IA em discovery, pesquisa, ideacao ou entendimento do problema?",
              "hint": "A squad usa um LLM para analisar entrevistas de usuarios e gerar hipoteses de problema antes de definir a solucao."
            },
            {
              "code": "Q2",
              "prompt": "A squad usa IA para refinar requisitos, criterios de aceitacao ou reduzir ambiguidades?",
              "hint": "Ao escrever uma user story, a squad pede a IA para sugerir criterios de aceitacao faltantes e identificar cenarios de borda."
            },
            {
              "code": "Q3",
              "prompt": "A squad usa IA para apoiar design e decisoes de arquitetura, incluindo alternativas e trade-offs?",
              "hint": "Antes de um ADR, a squad usa IA para comparar trade-offs entre duas abordagens (ex.: REST vs gRPC) com pros/contras documentados."
            },
            {
              "code": "Q4",
              "prompt": "O produto e o backlog da squad sao orientados por necessidades e resultados do usuario, garantindo que a aceleracao com IA nao desvie o foco do valor entregue?",
              "hint": "O backlog prioriza itens com base em impacto para o usuario (ex.: NPS, metricas de uso), e a squad valida se o que a IA acelerou de fato resolve o problema certo."
            }
          ]
        },
        {
          "code": "D1C2",
          "title": "Uso em delivery e run",
          "questions": [
            {
              "code": "Q5",
              "prompt": "A squad usa IA para geracao, manutencao, priorizacao ou analise de testes e QA?",
              "hint": "A squad usa IA para gerar testes unitarios a partir de codigo novo e para sugerir quais testes rodar primeiro com base no diff do PR."
            },
            {
              "code": "Q6",
              "prompt": "A squad usa IA em documentacao tecnica, documentacao de release ou artefatos operacionais?",
              "hint": "Release notes e changelogs sao gerados automaticamente por IA a partir dos commits e revisados antes de publicar."
            },
            {
              "code": "Q7",
              "prompt": "A squad usa IA em operacao, observabilidade, incidentes, troubleshooting ou runbooks?",
              "hint": "Durante um incidente, a squad usa IA para correlacionar logs e metricas e sugerir causa raiz, ou para gerar rascunho do postmortem."
            }
          ]
        }
      ]
    },
    {
      "code": "D2",
      "title": "Integracao no fluxo",
      "weight": 1.1,
      "capacities": [
        {
          "code": "D2C1",
          "title": "Integracao com toolchain e plataforma",
          "questions": [
            {
              "code": "Q8",
              "prompt": "A IA esta integrada ao IDE ou ambiente principal de desenvolvimento de forma recorrente?",
              "hint": "Copilot, Cursor ou Cody esta ativo no IDE da squad, e a maioria dos devs usa completions e chat no dia a dia."
            },
            {
              "code": "Q9",
              "prompt": "A IA esta integrada ao fluxo de PR, code review, backlog, issue tracking ou wiki?",
              "hint": "Um bot de code review (ex.: CodeRabbit, PR-Agent) comenta automaticamente nos PRs com sugestoes e checklist."
            },
            {
              "code": "Q10",
              "prompt": "A IA esta integrada ao pipeline de CI/CD, automacoes de qualidade ou gates tecnicos?",
              "hint": "Uma GitHub Action usa IA para classificar falhas de teste ou bloquear merge quando detecta padroes inseguros no codigo gerado."
            },
            {
              "code": "Q11",
              "prompt": "A squad tem acesso a uma plataforma interna de qualidade que oferece caminhos padronizados, seguros e automatizados para escalar o uso de IA na organizacao?",
              "hint": "A empresa oferece um portal/plataforma interna com templates de projeto, APIs aprovadas, guardrails de seguranca e integracoes de IA ja homologadas."
            }
          ]
        },
        {
          "code": "D2C2",
          "title": "Automacao e agentes",
          "questions": [
            {
              "code": "Q12",
              "prompt": "A squad possui playbooks, biblioteca de prompts, templates ou padroes reutilizaveis para uso de IA?",
              "hint": "Existe um repositorio Git com prompts versionados por tipo de tarefa (ex.: gerar testes, revisar ADR, resumir incidente)."
            },
            {
              "code": "Q13",
              "prompt": "A squad utiliza automacoes com IA no fluxo de trabalho, alem de uso manual em chat?",
              "hint": "Um workflow automatizado usa IA para classificar bugs recem-abertos por severidade e atribuir ao time correto."
            },
            {
              "code": "Q14",
              "prompt": "A squad utiliza agentes ou assistentes com autonomia delimitada e supervisao humana?",
              "hint": "Um agente de coding (ex.: Cursor Agent, Devin) executa tarefas tecnicas com escopo definido, mas toda mudanca passa por review humano antes do merge."
            }
          ]
        }
      ]
    },
    {
      "code": "D3",
      "title": "Qualidade em alta velocidade",
      "weight": 1.3,
      "capacities": [
        {
          "code": "D3C1",
          "title": "Controles de qualidade",
          "questions": [
            {
              "code": "Q15",
              "prompt": "Outputs gerados com IA passam por revisao humana explicita, com criterios adaptados para IA?",
              "hint": "O checklist de PR inclui itens como 'Codigo gerado por IA foi revisado quanto a logica, seguranca e alinhamento com padroes do time?'"
            },
            {
              "code": "Q16",
              "prompt": "Mudancas geradas com IA passam por testes automatizados, validacoes e gates confiaveis?",
              "hint": "Todo PR, independente de ser humano ou IA, precisa passar pela suite de testes, linter e SAST antes de ser mergeado."
            },
            {
              "code": "Q17",
              "prompt": "A squad consegue usar IA sem aumentar de forma relevante retrabalho, defeitos ou instabilidade?",
              "hint": "A taxa de rollback e bugs em producao nao subiu apos a adocao de IA; a squad monitora isso explicitamente."
            }
          ]
        },
        {
          "code": "D3C2",
          "title": "Sustentabilidade tecnica",
          "questions": [
            {
              "code": "Q18",
              "prompt": "A squad controla o impacto da IA em complexidade, manutenibilidade e divida tecnica?",
              "hint": "A squad roda analise de complexidade ciclomatica e monitora se o codigo gerado por IA esta aumentando a divida tecnica."
            },
            {
              "code": "Q19",
              "prompt": "A squad mantem pequenos lotes, disciplina de versionamento e clareza de autoria ao usar IA?",
              "hint": "PRs gerados com assistencia de IA sao pequenos (< 400 linhas), com commits atomicos e mensagem indicando que IA participou."
            },
            {
              "code": "Q20",
              "prompt": "A squad monitora o comportamento de mudancas assistidas por IA apos merge ou deploy?",
              "hint": "Apos deploy de codigo assistido por IA, a squad verifica metricas de erro e latencia nas primeiras horas, com alerta configurado."
            }
          ]
        }
      ]
    },
    {
      "code": "D4",
      "title": "Seguranca, privacidade, IP e compliance",
      "weight": 1.5,
      "capacities": [
        {
          "code": "D4C1",
          "title": "Governanca e politica",
          "questions": [
            {
              "code": "Q21",
              "prompt": "Existe politica clara sobre ferramentas de IA permitidas, usos proibidos e tipos de dados restritos?",
              "hint": "A empresa publicou uma politica que lista ferramentas aprovadas (ex.: Copilot Enterprise), proibe uso de modelos publicos com codigo proprietario, e define dados PII como restritos."
            },
            {
              "code": "Q22",
              "prompt": "A squad entende e aplica regras sobre privacidade, segredos, dados sensiveis e vazamento de informacao?",
              "hint": "Devs sabem que nao podem colar tokens, secrets ou dados de clientes em prompts; ha DLP configurado para bloquear isso."
            },
            {
              "code": "Q23",
              "prompt": "A squad considera riscos de IP, licenciamento, direitos autorais e origem do conteudo gerado por IA?",
              "hint": "A squad verifica se codigo sugerido pela IA nao replica trechos de projetos com licencas restritivas (ex.: GPL em projeto MIT)."
            }
          ]
        },
        {
          "code": "D4C2",
          "title": "Controles de risco no fluxo",
          "questions": [
            {
              "code": "Q24",
              "prompt": "Existe trilha de auditoria ou registro minimo do uso de IA em artefatos relevantes?",
              "hint": "PRs com assistencia de IA sao tagueados com label 'ai-assisted' e o template de PR tem campo obrigatorio 'IA utilizada: sim/nao'."
            },
            {
              "code": "Q25",
              "prompt": "A squad incorpora riscos de IA no threat modeling, incluindo prompt injection, overreliance e supply chain?",
              "hint": "O threat model do servico inclui cenarios como 'prompt injection via input do usuario' e 'dependencia de modelo externo indisponivel'."
            },
            {
              "code": "Q26",
              "prompt": "Existem controles operacionais ou tecnicos para prevenir uso inseguro de IA no fluxo de desenvolvimento?",
              "hint": "Ha uma regra no proxy/gateway que impede envio de codigo para APIs de IA nao homologadas; o linter bloqueia padroes de codigo inseguro gerado por IA."
            }
          ]
        }
      ]
    },
    {
      "code": "D5",
      "title": "Dados e conhecimento acessiveis a IA",
      "weight": 1.1,
      "capacities": [
        {
          "code": "D5C1",
          "title": "Conhecimento encontravel",
          "questions": [
            {
              "code": "Q27",
              "prompt": "A documentacao e o conhecimento interno sao encontraveis, atualizados e uteis para humanos e IA?",
              "hint": "A wiki do time e atualizada a cada sprint e aparece nos primeiros resultados ao buscar termos-chave no portal interno."
            },
            {
              "code": "Q28",
              "prompt": "A squad documenta decisoes importantes de forma que o conhecimento possa ser reutilizado posteriormente?",
              "hint": "Toda decisao arquitetural relevante vira um ADR versionado no repositorio, acessivel tanto para humanos quanto para ferramentas de IA."
            },
            {
              "code": "Q29",
              "prompt": "A squad consegue responder duvidas tecnicas relevantes com rapidez usando base interna e contexto confiavel?",
              "hint": "Um dev novo consegue descobrir como funciona o fluxo de pagamento em menos de 1 hora consultando docs internas ou perguntando ao assistente de IA com contexto do repo."
            }
          ]
        },
        {
          "code": "D5C2",
          "title": "Contexto seguro para IA",
          "questions": [
            {
              "code": "Q30",
              "prompt": "A squad oferece a IA acesso a contexto interno seguro, como docs, codigo, padroes e historico relevante?",
              "hint": "O assistente de IA esta conectado ao repositorio e a wiki interna via RAG ou MCP, permitindo respostas contextualizadas sem expor dados externamente."
            },
            {
              "code": "Q31",
              "prompt": "Esse acesso a contexto interno possui controle de acesso, rastreabilidade e protecao adequada?",
              "hint": "O sistema de RAG respeita ACLs do repositorio; logs de consulta sao mantidos; dados sensiveis sao filtrados antes de chegar ao modelo."
            },
            {
              "code": "Q32",
              "prompt": "A qualidade, atualizacao e ownership dos dados e conhecimento sao tratadas como fundamento para uso eficaz da IA?",
              "hint": "Existe um owner definido para cada area da documentacao, com SLA de atualizacao (ex.: docs de API revisadas a cada release)."
            }
          ]
        }
      ]
    },
    {
      "code": "D6",
      "title": "Pessoas e cultura",
      "weight": 1,
      "capacities": [
        {
          "code": "D6C1",
          "title": "Habilidades e confianca",
          "questions": [
            {
              "code": "Q33",
              "prompt": "A squad recebeu treinamento minimo sobre como usar IA, avaliar respostas e reconhecer limites e riscos?",
              "hint": "O time participou de um workshop de 2h sobre como avaliar criticamente outputs de IA, identificar alucinacoes e saber quando nao confiar no resultado."
            },
            {
              "code": "Q34",
              "prompt": "O uso de IA esta distribuido no time, em vez de concentrado em poucos power users?",
              "hint": "Telemetria mostra que 80% do time usa IA semanalmente, nao so 1-2 pessoas; pair programming com IA e incentivado."
            },
            {
              "code": "Q35",
              "prompt": "A squad sabe explicitar quando nao usar IA ou quando exigir revisao reforcada?",
              "hint": "O guideline do time lista cenarios onde IA nao deve ser usada sem revisao reforcada (ex.: logica de billing, regras de compliance, manipulacao de PII)."
            }
          ]
        },
        {
          "code": "D6C2",
          "title": "Colaboracao e aprendizado",
          "questions": [
            {
              "code": "Q36",
              "prompt": "O time compartilha boas praticas, prompts, exemplos, aprendizados e padroes de uso de IA?",
              "hint": "A squad tem um canal no Slack/Teams onde compartilha prompts que funcionaram bem, truques e anti-patterns descobertos."
            },
            {
              "code": "Q37",
              "prompt": "A lideranca e o ambiente da squad favorecem experimentacao segura, com clareza e seguranca psicologica?",
              "hint": "O tech lead encoraja testar novas ferramentas de IA em tarefas de baixo risco, sem penalizar erros; a politica da empresa e clara sobre o que pode e o que nao pode."
            },
            {
              "code": "Q38",
              "prompt": "A squad realiza retrospectivas, revisoes ou ciclos de aprendizado especificos sobre uso de IA?",
              "hint": "Na retrospectiva de sprint, ha um item fixo: 'O que aprendemos sobre uso de IA neste ciclo? O que funcionou e o que devemos ajustar?'"
            }
          ]
        }
      ]
    },
    {
      "code": "D7",
      "title": "Medicao de valor e feedback loops",
      "weight": 1.2,
      "capacities": [
        {
          "code": "D7C1",
          "title": "Telemetria e outcomes",
          "questions": [
            {
              "code": "Q39",
              "prompt": "A squad mede adocao e intensidade de uso de IA por meio de telemetria ou dados objetivos?",
              "hint": "A squad acompanha DAU do Copilot, taxa de aceitacao de sugestoes e volume de interacoes no chat do assistente."
            },
            {
              "code": "Q40",
              "prompt": "A squad mede impacto em fluxo de engenharia, como review speed, lead time, throughput ou cycle time?",
              "hint": "Um dashboard mostra que review time caiu de 48h para 24h apos adocao de bot de code review com IA."
            },
            {
              "code": "Q41",
              "prompt": "A squad mede impacto em qualidade e estabilidade, como defeitos, incidentes, retrabalho ou debt?",
              "hint": "A squad compara taxa de bugs em producao antes e depois da adocao de IA e monitora se a complexidade do codigo esta sob controle."
            }
          ]
        },
        {
          "code": "D7C2",
          "title": "Aprendizado orientado a dados",
          "questions": [
            {
              "code": "Q42",
              "prompt": "A squad compara percepcoes sobre ganho com IA com resultados observaveis, evitando metricas de vaidade?",
              "hint": "Embora o time ache que esta mais rapido, a squad verifica com dados se o lead time e a taxa de defeitos realmente melhoraram."
            },
            {
              "code": "Q43",
              "prompt": "A squad usa essas metricas para priorizar onde expandir, limitar ou ajustar o uso de IA?",
              "hint": "Apos ver que IA em testes gerou boa cobertura mas em docs gerou conteudo de baixa qualidade, a squad decidiu investir mais em testes e ajustar o processo de docs."
            },
            {
              "code": "Q44",
              "prompt": "A squad mantem feedback loops continuos para revisar praticas, ferramentas, controles e treinamento?",
              "hint": "A cada trimestre, a squad revisa metricas, ajusta prompts/playbooks, atualiza a politica de uso e planeja proximos treinamentos com base nos gaps observados."
            }
          ]
        }
      ]
    }
  ]
} as const;
