import { z } from 'zod';

export const calculatorSchema = z.object({
  tipoOperacao: z.enum(['Intraestadual', 'Interestadual']),
  tipoVendedor: z.enum(['Produtor Rural', 'Comerciante']),
  cfop: z.string(),
  cst: z.string(),
  estadoOrigem: z.string(),
  estadoDestino: z.string(),
  precoBase: z.coerce.number({ required_error: 'Preço base é obrigatório.' }).min(0.01, 'Preço base deve ser maior que zero.'),
  custoIndustria: z.coerce.number().optional(),
  tipoFrete: z.enum(['CIF', 'FOB']),
  frete: z.coerce.number().optional(),
  distancia: z.coerce.number().optional(),
  classificacao: z.enum(['Origem', 'Destino']),
  valorClassificacao: z.coerce.number().optional(),
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
  liquidoAPagarSaca: number;
  liquidoAPagarTon: number;
  freteSaca: number;
  tributosSaca: number;
  custoIndustriaSaca: number;
  margemSaca: number;
  liquidoFinalSaca: number;
  liquidoFinalTon: number;
  liquidoFinalCarga: number;
}
