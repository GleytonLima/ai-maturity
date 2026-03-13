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
        "0": "Inexistente ou proibido",
        "1": "Ad-hoc e isolado",
        "2": "Parcial",
        "3": "Padronizado com evidencia",
        "4": "Medido e otimizado"
      }
    },
    "scoring": {
      "question": "score direto de 0 a 4",
      "capability": "media simples de 3 perguntas",
      "dimension": "media simples de 2 capacidades",
      "overall": "media ponderada das 7 dimensoes"
    },
    "levelThresholds": [
      {
        "min": 0,
        "max": 0.9,
        "level": "N1",
        "label": "Ad-hoc"
      },
      {
        "min": 1,
        "max": 1.9,
        "level": "N2",
        "label": "Assistido"
      },
      {
        "min": 2,
        "max": 2.9,
        "level": "N3",
        "label": "Padronizado"
      },
      {
        "min": 3,
        "max": 3.6,
        "level": "N4",
        "label": "Otimizado"
      },
      {
        "min": 3.7,
        "max": 4,
        "level": "N5",
        "label": "IA-nativo"
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
      "structuralRisk": [
        "Q19",
        "Q20",
        "Q22",
        "Q23"
      ],
      "qualityRisk": [
        "Q13",
        "Q14",
        "Q16"
      ]
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
              "prompt": "A squad usa IA em discovery, pesquisa, ideacao ou entendimento do problema?"
            },
            {
              "code": "Q2",
              "prompt": "A squad usa IA para refinar requisitos, criterios de aceitacao ou reduzir ambiguidades?"
            },
            {
              "code": "Q3",
              "prompt": "A squad usa IA para apoiar design e decisoes de arquitetura, incluindo alternativas e trade-offs?"
            }
          ]
        },
        {
          "code": "D1C2",
          "title": "Uso em delivery e run",
          "questions": [
            {
              "code": "Q4",
              "prompt": "A squad usa IA para geracao, manutencao, priorizacao ou analise de testes e QA?"
            },
            {
              "code": "Q5",
              "prompt": "A squad usa IA em documentacao tecnica, documentacao de release ou artefatos operacionais?"
            },
            {
              "code": "Q6",
              "prompt": "A squad usa IA em operacao, observabilidade, incidentes, troubleshooting ou runbooks?"
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
          "title": "Integracao com toolchain",
          "questions": [
            {
              "code": "Q7",
              "prompt": "A IA esta integrada ao IDE ou ambiente principal de desenvolvimento de forma recorrente?"
            },
            {
              "code": "Q8",
              "prompt": "A IA esta integrada ao fluxo de PR, code review, backlog, issue tracking ou wiki?"
            },
            {
              "code": "Q9",
              "prompt": "A IA esta integrada ao pipeline de CI/CD, automacoes de qualidade ou gates tecnicos?"
            }
          ]
        },
        {
          "code": "D2C2",
          "title": "Automacao e agentes",
          "questions": [
            {
              "code": "Q10",
              "prompt": "A squad possui playbooks, biblioteca de prompts, templates ou padroes reutilizaveis para uso de IA?"
            },
            {
              "code": "Q11",
              "prompt": "A squad utiliza automacoes com IA no fluxo de trabalho, alem de uso manual em chat?"
            },
            {
              "code": "Q12",
              "prompt": "A squad utiliza agentes ou assistentes com autonomia delimitada e supervisao humana?"
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
              "code": "Q13",
              "prompt": "Outputs gerados com IA passam por revisao humana explicita, com criterios adaptados para IA?"
            },
            {
              "code": "Q14",
              "prompt": "Mudancas geradas com IA passam por testes automatizados, validacoes e gates confiaveis?"
            },
            {
              "code": "Q15",
              "prompt": "A squad consegue usar IA sem aumentar de forma relevante retrabalho, defeitos ou instabilidade?"
            }
          ]
        },
        {
          "code": "D3C2",
          "title": "Sustentabilidade tecnica",
          "questions": [
            {
              "code": "Q16",
              "prompt": "A squad controla o impacto da IA em complexidade, manutenibilidade e divida tecnica?"
            },
            {
              "code": "Q17",
              "prompt": "A squad mantem pequenos lotes, disciplina de versionamento e clareza de autoria ao usar IA?"
            },
            {
              "code": "Q18",
              "prompt": "A squad monitora o comportamento de mudancas assistidas por IA apos merge ou deploy?"
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
              "code": "Q19",
              "prompt": "Existe politica clara sobre ferramentas de IA permitidas, usos proibidos e tipos de dados restritos?"
            },
            {
              "code": "Q20",
              "prompt": "A squad entende e aplica regras sobre privacidade, segredos, dados sensiveis e vazamento de informacao?"
            },
            {
              "code": "Q21",
              "prompt": "A squad considera riscos de IP, licenciamento, direitos autorais e origem do conteudo gerado por IA?"
            }
          ]
        },
        {
          "code": "D4C2",
          "title": "Controles de risco no fluxo",
          "questions": [
            {
              "code": "Q22",
              "prompt": "Existe trilha de auditoria ou registro minimo do uso de IA em artefatos relevantes?"
            },
            {
              "code": "Q23",
              "prompt": "A squad incorpora riscos de IA no threat modeling, incluindo prompt injection, overreliance e supply chain?"
            },
            {
              "code": "Q24",
              "prompt": "Existem controles operacionais ou tecnicos para prevenir uso inseguro de IA no fluxo de desenvolvimento?"
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
              "code": "Q25",
              "prompt": "A documentacao e o conhecimento interno sao encontraveis, atualizados e uteis para humanos e IA?"
            },
            {
              "code": "Q26",
              "prompt": "A squad documenta decisoes importantes de forma que o conhecimento possa ser reutilizado posteriormente?"
            },
            {
              "code": "Q27",
              "prompt": "A squad consegue responder duvidas tecnicas relevantes com rapidez usando base interna e contexto confiavel?"
            }
          ]
        },
        {
          "code": "D5C2",
          "title": "Contexto seguro para IA",
          "questions": [
            {
              "code": "Q28",
              "prompt": "A squad oferece a IA acesso a contexto interno seguro, como docs, codigo, padroes e historico relevante?"
            },
            {
              "code": "Q29",
              "prompt": "Esse acesso a contexto interno possui controle de acesso, rastreabilidade e protecao adequada?"
            },
            {
              "code": "Q30",
              "prompt": "A qualidade, atualizacao e ownership dos dados e conhecimento sao tratadas como fundamento para uso eficaz da IA?"
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
              "code": "Q31",
              "prompt": "A squad recebeu treinamento minimo sobre como usar IA, avaliar respostas e reconhecer limites e riscos?"
            },
            {
              "code": "Q32",
              "prompt": "O uso de IA esta distribuido no time, em vez de concentrado em poucos power users?"
            },
            {
              "code": "Q33",
              "prompt": "A squad sabe explicitar quando nao usar IA ou quando exigir revisao reforcada?"
            }
          ]
        },
        {
          "code": "D6C2",
          "title": "Colaboracao e aprendizado",
          "questions": [
            {
              "code": "Q34",
              "prompt": "O time compartilha boas praticas, prompts, exemplos, aprendizados e padroes de uso de IA?"
            },
            {
              "code": "Q35",
              "prompt": "A lideranca e o ambiente da squad favorecem experimentacao segura, com clareza e seguranca psicologica?"
            },
            {
              "code": "Q36",
              "prompt": "A squad realiza retrospectivas, revisoes ou ciclos de aprendizado especificos sobre uso de IA?"
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
              "code": "Q37",
              "prompt": "A squad mede adocao e intensidade de uso de IA por meio de telemetria ou dados objetivos?"
            },
            {
              "code": "Q38",
              "prompt": "A squad mede impacto em fluxo de engenharia, como review speed, lead time, throughput ou cycle time?"
            },
            {
              "code": "Q39",
              "prompt": "A squad mede impacto em qualidade e estabilidade, como defeitos, incidentes, retrabalho ou debt?"
            }
          ]
        },
        {
          "code": "D7C2",
          "title": "Aprendizado orientado a dados",
          "questions": [
            {
              "code": "Q40",
              "prompt": "A squad compara percepcoes sobre ganho com IA com resultados observaveis, evitando metricas de vaidade?"
            },
            {
              "code": "Q41",
              "prompt": "A squad usa essas metricas para priorizar onde expandir, limitar ou ajustar o uso de IA?"
            },
            {
              "code": "Q42",
              "prompt": "A squad mantem feedback loops continuos para revisar praticas, ferramentas, controles e treinamento?"
            }
          ]
        }
      ]
    }
  ]
} as const;

