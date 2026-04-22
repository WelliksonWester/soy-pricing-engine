/**
 * @fileOverview Serviço de lógica de negócio pura para cálculos de soja.
 * Segue o princípio de funções puras para facilitar testes e manutenção.
 */

import { CalculatorFormValues, ResultsState } from '../types';

export const SUL_SUDESTE_SEM_ES = ['PR', 'RS', 'SC', 'SP', 'RJ', 'MG'];

export function calculateBasePrice(precoFarelo: number, freteFarelo: number, precoOleo: number, freteOleo: number): number {
  const valorFarelo = (precoFarelo * 0.76) - (freteFarelo * 0.76);
  const valorOleo = (precoOleo * 0.185) - (freteOleo * 0.185);
  return parseFloat((valorFarelo + valorOleo).toFixed(2));
}

export function calculateIcmsOleoCost(precoOleo: number, freteOleo: number, icmsOleoPercent: number): number {
  const custo = ((precoOleo - freteOleo) * 0.185) * (icmsOleoPercent / 100);
  return parseFloat(custo.toFixed(2));
}

export function calculateFinancialCost(precoBase: number, dias: number): number {
  const percentual = (dias * 0.0833) / 100;
  return parseFloat((precoBase * percentual).toFixed(2));
}

export function performFullSimulation(data: CalculatorFormValues): ResultsState {
  const tonToSaca = (val: number) => (val / 1000) * 60;

  // Inputs Convertidos para Saca
  const precoBrutoSaca = tonToSaca(data.precoBase);
  const freteSaca = data.tipoFrete === 'CIF' ? tonToSaca(data.frete) : 0;
  const custoIndustriaSaca = tonToSaca(data.custoIndustria);
  const custoIcmsOleoSaca = tonToSaca(data.custoIcmsOleo);
  const custoFinanceiroSaca = tonToSaca(data.custoFinanceiro);
  const classificacaoSaca = tonToSaca(data.valorClassificacao);

  // Preço Bruto 1 (Base antes de margens e impostos)
  const precoBruto1 = precoBrutoSaca - freteSaca - custoIndustriaSaca - custoIcmsOleoSaca - custoFinanceiroSaca - classificacaoSaca;

  // Margem e Comissão
  const margemSaca = precoBruto1 * (data.margem / 100);
  const comissaoSaca = precoBruto1 * (data.comissao / 100);

  // Preço Bruto à Pagar (Base para impostos)
  const liquidoFinalSaca = precoBruto1 - margemSaca - comissaoSaca;

  // Cálculo de Impostos
  let funruralPercentual = 0;
  if (data.tipoVendedor === 'Produtor Rural') {
    // Atualizado de 1.5 para 1.63 conforme solicitado
    funruralPercentual = data.optanteFunrural === 'Faturamento' ? 1.63 : 0.2;
  }

  let icmsPercentual = 0;
  if (data.tipoOperacao === 'Interestadual') {
    if (SUL_SUDESTE_SEM_ES.includes(data.estadoOrigem) && !SUL_SUDESTE_SEM_ES.includes(data.estadoDestino) && data.estadoDestino !== 'ES') {
      icmsPercentual = 7;
    } else if (data.estadoOrigem !== data.estadoDestino) {
      icmsPercentual = 12;
    }
  }

  const icmsSaca = liquidoFinalSaca * (icmsPercentual / 100);
  const funruralSaca = liquidoFinalSaca * (funruralPercentual / 100);
  const impostosSaca = funruralSaca + icmsSaca;

  // Liquidação Final
  const precoLiquidoFinalSaca = liquidoFinalSaca - impostosSaca;
  const liquidoFinalTon = (precoLiquidoFinalSaca / 60) * 1000;

  return {
    precoBrutoSaca,
    funruralPercentual,
    icmsSaca,
    icmsPercentual,
    precoLiquidoSaca: liquidoFinalSaca,
    liquidoAPagarTon: liquidoFinalTon,
    freteSaca,
    impostosSaca,
    custoIndustriaSaca,
    custoIcmsOleoSaca,
    custoFinanceiroSaca,
    classificacaoSaca,
    margemSaca,
    comissaoSaca,
    liquidoFinalSaca,
    liquidoFinalTon,
    liquidoFinalCarga: liquidoFinalTon * 30,
    precoLiquidoFinalSaca,
  };
}
