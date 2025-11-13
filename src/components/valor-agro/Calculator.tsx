'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CalculatorIcon, FileDown, FileText, Trash2 } from 'lucide-react';
import { calculatorSchema, type ResultsState, type CalculatorFormValues } from '@/lib/types';
import { OperationDataCard } from './OperationDataCard';
import { CommercialConditionsCard } from './CommercialConditionsCard';
import { TaxesAndSimulationCard } from './TaxesAndSimulationCard';
import { ResultsCard } from './ResultsCard';
import { CfopDialog } from './CfopDialog';

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
  precoBase: 0,
  custoIndustria: 0,
  tipoFrete: 'CIF',
  frete: 0,
  distancia: 0,
  classificacao: 'Destino',
  valorClassificacao: 0,
  margem: 0,
  comissao: 0,
  optanteFunrural: 'Faturamento',
};

const initialResults: ResultsState = {
  precoBrutoSaca: 0,
  funruralPercentual: 0,
  icmsSaca: 0,
  icmsPercentual: 0,
  precoLiquidoSaca: 0,
  liquidoAPagarTon: 0,
  freteSaca: 0,
  tributosSaca: 0,
  custoIndustriaSaca: 0,
  margemSaca: 0,
  liquidoFinalSaca: 0,
  liquidoFinalTon: 0,
  liquidoFinalCarga: 0,
};

const sulSudesteSemES = ['PR', 'RS', 'SC', 'SP', 'RJ', 'MG'];
const norteNordesteCOComES = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'RN', 'RO', 'RR', 'SE', 'TO'];

export function Calculator() {
  const [results, setResults] = useState<ResultsState>(initialResults);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isCfopDialogOpen, setIsCfopDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: CalculatorFormValues) => {
    try {
      const margemDecimal = data.margem / 100;
      const comissaoDecimal = data.comissao / 100;
      const divisor = 1 - margemDecimal - comissaoDecimal;
      if (divisor <= 0) {
        toast({
          variant: 'destructive',
          title: 'Erro de Cálculo',
          description: 'A soma da Margem e Comissão não pode ser maior ou igual a 100%.',
        });
        return;
      }

      const precoBrutoTon = data.precoBase / divisor;
      const funruralPercentual = data.tipoVendedor === 'Comerciante' ? 0 : (data.optanteFunrural === 'Faturamento' ? 1.5 : 0.2);
      
      let icmsPercentual = 0;
      if (data.estadoOrigem === data.estadoDestino) {
        icmsPercentual = 0;
      } else if (sulSudesteSemES.includes(data.estadoOrigem) && norteNordesteCOComES.includes(data.estadoDestino)) {
        icmsPercentual = 7;
      } else {
        icmsPercentual = 12;
      }

      const icmsValorTon = precoBrutoTon * (icmsPercentual / 100);
      const tributoFunruralValorTon = precoBrutoTon * (funruralPercentual / 100);

      const precoLiquidoTon = precoBrutoTon - tributoFunruralValorTon;

      const freteValorTon = data.tipoFrete === 'CIF' ? data.frete ?? 0 : 0;
      const classificacaoValorTon = data.tipoFrete === 'CIF' ? data.valorClassificacao ?? 0 : 0;
      const custoIndustriaTon = data.custoIndustria ?? 0;

      const margemValorTon = precoBrutoTon * margemDecimal;

      const totalTributosTon = tributoFunruralValorTon + icmsValorTon;
      const outrosCustosTon = custoIndustriaTon + classificacaoValorTon;
      
      const liquidoAPagarTon = precoBrutoTon - totalTributosTon;

      const liquidoFinalTon = precoBrutoTon - freteValorTon - totalTributosTon - outrosCustosTon - margemValorTon;

      const tonToSaca = (val: number) => val / (1000 / 60);

      setResults({
        precoBrutoSaca: tonToSaca(precoBrutoTon),
        funruralPercentual,
        icmsSaca: tonToSaca(icmsValorTon),
        icmsPercentual,
        precoLiquidoSaca: tonToSaca(precoLiquidoTon),
        liquidoAPagarTon: liquidoAPagarTon,
        freteSaca: tonToSaca(freteValorTon),
        tributosSaca: tonToSaca(totalTributosTon),
        custoIndustriaSaca: tonToSaca(custoIndustriaTon),
        margemSaca: tonToSaca(margemValorTon),
        liquidoFinalSaca: tonToSaca(liquidoFinalTon),
        liquidoFinalTon: liquidoFinalTon,
        liquidoFinalCarga: liquidoFinalTon * 30, // Assumindo 30 tons/carga
      });

      setIsSimulated(true);
      toast({
        title: 'Simulação Concluída',
        description: 'Os resultados foram calculados com sucesso.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na Simulação',
        description: 'Verifique os valores inseridos e tente novamente.',
      });
    }
  };

  const handleClear = () => {
    form.reset(defaultValues);
    setResults(initialResults);
    setIsSimulated(false);
    toast({
      title: 'Campos Limpos',
      description: 'O formulário foi resetado para os valores padrão.',
    });
  };

  const handleExport = () => {
    if (!isSimulated) {
      toast({
        variant: 'destructive',
        title: 'Sem dados para exportar',
        description: 'Por favor, execute uma simulação primeiro.',
      });
      return;
    }
    const data = form.getValues();
    const headers = 'Tipo de Operação,CFOP,CST,Preço Base,Frete,Tributo,Líquido/saca,Líquido/ton\n';
    const row = [
      data.tipoOperacao,
      data.cfop,
      data.cst,
      data.precoBase.toFixed(2),
      (data.tipoFrete === 'CIF' ? data.frete ?? 0 : 0).toFixed(2),
      results.tributosSaca.toFixed(2),
      results.liquidoFinalSaca.toFixed(2),
      results.liquidoFinalTon.toFixed(2),
    ].join(',');

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + row;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'valor_agro_simulacao.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormError = () => {
     toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <OperationDataCard form={form} />
            <CommercialConditionsCard form={form} />
          </div>
          <div className="space-y-6">
            <TaxesAndSimulationCard form={form} results={results} />
            <ResultsCard results={results} isSimulated={isSimulated} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border bg-card p-4">
          <Button type="submit">
            <CalculatorIcon />
            Simular
          </Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            <Trash2 />
            Limpar
          </Button>
          <Button type="button" variant="outline" onClick={handleExport}>
            <FileDown />
            Exportar p/ Excel
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsCfopDialogOpen(true)}>
            <FileText />
            Gerar Modelo de Nota Fiscal
          </Button>
        </div>
      </form>
      <CfopDialog
        isOpen={isCfopDialogOpen}
        onOpenChange={setIsCfopDialogOpen}
        cfop={form.watch('cfop')}
        cst={form.watch('cst')}
      />
    </Form>
  );
}
