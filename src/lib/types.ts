import { z } from 'zod';

export const calculatorSchema = z.object({
  tipoOperacao: z.enum(['Intraestadual', 'Interestadual']),
  tipoVendedor: z.enum(['Produtor Rural', 'Comerciante']),
  cfop: z.string(),
  cst: z.string(),
  estadoOrigem: z.string(),
  estadoDestino: z.string(),
  precoFarelo: z.coerce.number({ required_error: 'Preço do farelo é obrigatório.' }).min(0, 'Preço não pode ser negativo.'),
  freteFarelo: z.coerce.number({ required_error: 'Frete do farelo é obrigatório.' }).min(0, 'Frete não pode ser negativo.'),
  precoOleo: z.coerce.number({ required_error: 'Preço do óleo é obrigatório.' }).min(0, 'Preço não pode ser negativo.'),
  freteOleo: z.coerce.number({ required_error: 'Frete do óleo é obrigatório.' }).min(0, 'Frete não pode ser negativo.'),
  precoBase: z.coerce.number({ required_error: 'Preço base é obrigatório.' }).min(0.01, 'Preço base deve ser maior que zero.'),
  custoIndustria: z.coerce.number().optional().default(0),
  financeiro: z.coerce.number().int('Financeiro deve ser um número inteiro.').optional().default(0),
  tipoFrete: z.enum(['CIF', 'FOB']),
  frete: z.coerce.number().optional().default(0),
  distancia: z.coerce.number().optional().default(0),
  classificacao: z.enum(['Origem', 'Destino']),
  valorClassificacao: z.coerce.number().optional().default(0),
  margem: z.coerce.number({ required_error: 'Margem é obrigatória.' }).min(0, 'Margem não pode ser negativa.'),
  comissao: z.coerce.number({ required_error: 'Comissão é obrigatória.' }).min(0, 'Comissão não pode ser negativa.'),
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
  tributosSaca: number;
  custoIndustriaSaca: number;
  classificacaoSaca: number;
  margemSaca: number;
  liquidoFinalSaca: number;
  liquidoFinalTon: number;
  liquidoFinalCarga: number;
}
