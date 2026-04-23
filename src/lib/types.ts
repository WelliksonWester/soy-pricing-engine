import { z } from 'zod';

export const calculatorSchema = z.object({
  tipoOperacao: z.enum(['Intraestadual', 'Interestadual']),
  tipoVendedor: z.enum(['Produtor Rural', 'Comerciante']),
  cfop: z.string(),
  cst: z.string(),
  estadoOrigem: z.string(),
  estadoDestino: z.string(),
  precoFarelo: z.coerce.number().min(0, 'Preço não pode ser negativo.'),
  freteFarelo: z.coerce.number().min(0, 'Frete não pode ser negativo.'),
  precoOleo: z.coerce.number().min(0, 'Preço não pode ser negativo.'),
  freteOleo: z.coerce.number().min(0, 'Frete não pode ser negativo.'),
  icmsOleo: z.coerce.number().min(0).max(100),
  custoIcmsOleo: z.coerce.number().default(0),
  precoBase: z.coerce.number().default(0),
  custoIndustria: z.coerce.number().default(0),
  financeiro: z.coerce.number().int().default(0),
  custoFinanceiro: z.coerce.number().default(0),
  tipoFrete: z.enum(['CIF', 'FOB']),
  frete: z.coerce.number().default(0),
  classificacao: z.enum(['Origem', 'Destino']),
  valorClassificacao: z.coerce.number().default(0),
  margem: z.coerce.number().min(0),
  comissao: z.coerce.number().min(0),
  optanteFunrural: z.enum(['Folha', 'Faturamento']),
});

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;

export interface ResultsState {
  precoBrutoSaca: number;
  funruralPercentual: number;
  icmsSaca: number;
  icmsPercentual: number;
  precoLiquidoSaca: number;
  liquidoAPagarTon: number;
  freteSaca: number;
  impostosSaca: number;
  custoIndustriaSaca: number;
  custoIcmsOleoSaca: number;
  custoFinanceiroSaca: number;
  classificacaoSaca: number;
  margemSaca: number;
  comissaoSaca: number;
  liquidoFinalSaca: number;
  liquidoFinalTon: number;
  liquidoFinalCarga: number;
  precoLiquidoFinalSaca: number;
}
