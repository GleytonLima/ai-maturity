import { Injectable } from '@angular/core';

import type { CapabilityCard, PersistedState, Tool } from '../models/ai-maturity.models';

@Injectable({ providedIn: 'root' })
export class ExportService {
  buildJsonBackup(state: PersistedState): string {
    return JSON.stringify(state, null, 2);
  }

  /** Entregável em texto (Notion, Confluence, PR) a partir de uma Ficha de Capacidade. */
  buildCapabilityCardMarkdown(
    card: CapabilityCard,
    questionPrompt: string,
    toolsCatalog: Tool[] = []
  ): string {
    const u = (v: string) => v.trim() || '—';
    const toolNameById = new Map(toolsCatalog.map((t) => [t.id, t.name]));
    const asIsToolsLine = (() => {
      const names = card.asIs.toolIds
        .map((id) => toolNameById.get(id) ?? id)
        .filter((n) => n.trim());
      const other = card.asIs.toolsUsedOther.trim();
      if (names.length === 0 && !other) {
        return '—';
      }
      const parts = [...names];
      if (other) {
        parts.push(`Outras: ${other}`);
      }
      return parts.join('; ');
    })();
    const ul = (items: string[]) =>
      items.filter((x) => x.trim()).map((x) => `- ${x}`).join('\n') || '—';
    const flowAsIs = card.flowMap
      .map(
        (r) =>
          `| ${r.step} | ${u(r.description)} | ${u(r.responsible)} | ${u(r.duration)} | ${u(r.problem)} |`
      )
      .join('\n');
    const flowToBe = card.toBeFlow
      .map(
        (r) =>
          `| ${r.step} | ${u(r.descriptionWithAi)} | ${u(r.change)} | ${u(r.risk)} |`
      )
      .join('\n');
    const usageLabels: Record<string, string> = {
      geracao: 'Geração',
      analise: 'Análise',
      automacao: 'Automação',
      sugestao: 'Sugestão'
    };
    const usage =
      card.aiHypothesis.usageTypes.map((t) => usageLabels[t] ?? t).join(', ') || '—';

    return [
      `# Ficha de Capacidade — ${card.context.questionCode}`,
      '',
      '## 1. Contexto',
      '',
      `- **Squad:** ${u(card.context.squad)}`,
      `- **História analisada:** ${u(card.context.storyAnalyzed)}`,
      `- **Dimensão:** ${u(card.context.dimensionCode)}`,
      `- **Pergunta (${card.context.questionCode}):** ${u(questionPrompt)}`,
      '',
      '## 2. Estado atual (AS-IS)',
      '',
      `- **Como essa etapa é feita hoje?** ${u(card.asIs.flowDescription)}`,
      `- **Número de passos:** ${u(card.asIs.stepCount)}`,
      `- **Ferramentas usadas:** ${asIsToolsLine}`,
      `- **Tempo médio:** ${u(card.asIs.avgTime)}`,
      `- **Frequência:** ${u(card.asIs.frequency)}`,
      `- **Principais dores:** ${u(card.asIs.mainPains)}`,
      '',
      '## 3. Mapeamento do fluxo',
      '',
      '| Passo | Descrição | Responsável | Tempo | Problema |',
      '| ----- | --------- | ----------- | ----- | -------- |',
      flowAsIs,
      '',
      '## 4. Hipótese de uso de IA',
      '',
      `- **Etapa(s) impactadas:** ${u(card.aiHypothesis.impactedStages)}`,
      `- **Tipo de uso:** ${usage}`,
      `- **Input necessário:** ${u(card.aiHypothesis.inputNeeded)}`,
      `- **Output esperado:** ${u(card.aiHypothesis.expectedOutput)}`,
      '',
      '## 5. Novo fluxo (TO-BE)',
      '',
      '| Passo | Descrição (com IA) | Mudança | Risco |',
      '| ----- | ------------------ | ------- | ----- |',
      flowToBe,
      '',
      '## 6. Riscos e controles',
      '',
      ul([
        `**Alucinação:** ${u(card.risksControls.hallucinationRisk)}`,
        `**Segurança:** ${u(card.risksControls.securityRisk)}`,
        `**Qualidade:** ${u(card.risksControls.qualityRisk)}`,
        `**Validação humana:** ${u(card.risksControls.humanValidationNeed)}`
      ]),
      '',
      '## 7. Execução do experimento',
      '',
      ul([
        `**Quem executou:** ${u(card.experiment.executedBy)}`,
        `**Quantas vezes:** ${u(card.experiment.iterations)}`,
        `**Contexto real ou simulado:** ${u(card.experiment.realOrSimulated)}`,
        `**Variações testadas:** ${u(card.experiment.variationsTested)}`
      ]),
      '',
      '## 8. Evidências coletadas',
      '',
      '### Quantitativo',
      '',
      ul([
        `Tempo antes: ${u(card.evidenceQuantitative.timeBefore)}`,
        `Tempo depois: ${u(card.evidenceQuantitative.timeAfter)}`,
        `Redução (%): ${u(card.evidenceQuantitative.reductionPercent)}`,
        `Retrabalho: ${u(card.evidenceQuantitative.reworkCount)}`,
        `Bugs: ${u(card.evidenceQuantitative.bugs)}`
      ]),
      '',
      '### Qualitativo',
      '',
      ul([
        `Confiança do time: ${u(card.evidenceQualitative.teamConfidence)}`,
        `Facilidade de uso: ${u(card.evidenceQualitative.easeOfUse)}`,
        `Clareza do output: ${u(card.evidenceQualitative.outputClarity)}`
      ]),
      '',
      '## 9. Avaliação de impacto',
      '',
      `- **Impacto:** ${card.impact ? ({ baixo: 'Baixo', medio: 'Médio', alto: 'Alto' } as const)[card.impact] : '—'}`,
      `- **Justificativa do impacto:** ${u(card.impactRationale)}`,
      `- **Confiabilidade:** ${card.reliability ? ({ baixa: 'Baixa', media: 'Média', alta: 'Alta' } as const)[card.reliability] : '—'}`,
      `- **Justificativa da confiabilidade:** ${u(card.reliabilityRationale)}`,
      '',
      '## 10. Atualização de maturidade',
      '',
      ul([
        `**Nível antes:** ${u(card.maturityUpdate.levelBefore)}`,
        `**Nível depois:** ${u(card.maturityUpdate.levelAfter)}`,
        `**Evidências que justificam:** ${u(card.maturityUpdate.evidenceJustification)}`
      ]),
      '',
      '## 11. Recomendação',
      '',
      ul([
        `**Decisão:** ${card.recommendation.verdict ?? '—'}`,
        `**Ajustes necessários:** ${u(card.recommendation.adjustments)}`,
        `**Dependências externas:** ${u(card.recommendation.externalDeps)}`
      ]),
      ''
    ].join('\n');
  }

  downloadFile(filename: string, contents: string, contentType: string): void {
    if (typeof document === 'undefined' || typeof URL === 'undefined') {
      return;
    }

    const blob = new Blob([contents], { type: contentType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
