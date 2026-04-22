'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CalculatorIcon, FileText, Trash2 } from 'lucide-react';
import { calculatorSchema, type ResultsState, type CalculatorFormValues } from '@/lib/types';
import { performFullSimulation } from '@/lib/services/soy-service';
import { OperationDataCard } from './OperationDataCard';
import { CommercialConditionsCard } from './CommercialConditionsCard';
import { TaxesAndSimulationCard } from './TaxesAndSimulationCard';
import { ResultsCard } from './ResultsCard';
import { FaturamentoDialog } from './FaturamentoDialog';
import { NotaFiscalDialog } from './NotaFiscalDialog';

const defaultValues: Partial<CalculatorFormValues> = {
  tipoOperacao: 'Intraestadual',
  tipoVendedor: 'Produtor Rural',
  cfop: '5101',
  cst: '41',
  estadoOrigem: 'PR',
  estadoDestino: 'PR',
  precoFarelo: 0,
  freteFarelo: 0,
  precoOleo: 0,
  freteOleo: 0,
  icmsOleo: 0,
  custoIcmsOleo: 0,
  precoBase: 0,
  custoIndustria: 0,
  financeiro: 0,
  custoFinanceiro: 0,
  tipoFrete: 'CIF',
  frete: 0,
  classificacao: 'Destino',
  valorClassificacao: 0,
  margem: 0,
  comissao: 0,
  optanteFunrural: 'Faturamento',
};

const initialResults: ResultsState = {
  precoBrutoSaca: 0,
  funruralPercentual: 1.5,
  icmsSaca: 0,
  icmsPercentual: 0,
  precoLiquidoSaca: 0,
  liquidoAPagarTon: 0,
  freteSaca: 0,
  impostosSaca: 0,
  custoIndustriaSaca: 0,
  custoIcmsOleoSaca: 0,
  custoFinanceiroSaca: 0,
  classificacaoSaca: 0,
  margemSaca: 0,
  comissaoSaca: 0,
  liquidoFinalSaca: 0,
  liquidoFinalTon: 0,
  liquidoFinalCarga: 0,
  precoLiquidoFinalSaca: 0,
};

export function Calculator() {
  const [results, setResults] = useState<ResultsState>(initialResults);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isFaturamentoDialogOpen, setIsFaturamentoDialogOpen] = useState(false);
  const [isNotaFiscalDialogOpen, setIsNotaFiscalDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: CalculatorFormValues) => {
    try {
      const simulationResults = performFullSimulation(data);
      setResults(simulationResults);
      setIsSimulated(true);
      toast({
        title: 'Simulação Concluída',
        description: 'Os resultados foram calculados com sucesso.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na Simulação',
        description: 'Ocorreu um erro ao processar os cálculos.',
      });
    }
  };

  const handleClear = () => {
    form.reset(defaultValues);
    setResults(initialResults);
    setIsSimulated(false);
    toast({ title: 'Campos Limpos' });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <OperationDataCard form={form} />
            <CommercialConditionsCard form={form} />
          </div>
          <div className="space-y-6">
            <TaxesAndSimulationCard form={form} results={results} />
            {isSimulated && <ResultsCard results={results} />}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border bg-card p-4">
          <Button type="submit">
            <CalculatorIcon className="mr-2 h-4 w-4" />
            Simular
          </Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            disabled={!isSimulated}
            onClick={() => setIsFaturamentoDialogOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar IN Faturamento
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            disabled={!isSimulated}
            onClick={() => setIsNotaFiscalDialogOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Modelo de Nota Fiscal
          </Button>
        </div>
      </form>
      <FaturamentoDialog
        isOpen={isFaturamentoDialogOpen}
        onOpenChange={setIsFaturamentoDialogOpen}
        cfop={form.watch('cfop')}
      />
      <NotaFiscalDialog
        isOpen={isNotaFiscalDialogOpen}
        onOpenChange={setIsNotaFiscalDialogOpen}
        formValues={form.getValues()}
        results={results}
      />
    </Form>
  );
}
