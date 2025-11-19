'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CalculatorIcon, FileText, Trash2 } from 'lucide-react';
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
  funruralPercentual: 1.5, // Default for Produtor Rural + Faturamento
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

const sulSudesteSemES = ['PR', 'RS', 'SC', 'SP', 'RJ', 'MG'];
const norteNordesteCOComES = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'RN', 'RO', 'RR', 'SE', 'TO'];

const tonToSaca60kg = (value: number) => (value / 1000) * 60;

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

  const tipoVendedor = form.watch('tipoVendedor');
  const optanteFunrural = form.watch('optanteFunrural');
  const tipoOperacao = form.watch('tipoOperacao');

  useEffect(() => {
    let funruralPercentual = 0;
    if (tipoVendedor === 'Produtor Rural') {
        funruralPercentual = optanteFunrural === 'Faturamento' ? 1.5 : 0.2;
    } else {
        funruralPercentual = 0;
    }
    setResults((prev) => ({ ...prev, funruralPercentual }));
  }, [tipoVendedor, optanteFunrural]);


  const onSubmit = (data: CalculatorFormValues) => {
    try {
      // Inputs from form (Ton)
      const precoBaseTon = data.precoBase ?? 0;
      const custoIndustriaTon = data.custoIndustria ?? 0;
      const freteSojaTon = data.tipoFrete === 'CIF' ? (data.frete ?? 0) : 0;
      const valorClassificacaoTon = (data.valorClassificacao ?? 0);

      // Inputs from form (direct values)
      const custoIcmsOleoTon = data.custoIcmsOleo ?? 0;
      const custoFinanceiroTon = data.custoFinanceiro ?? 0;
      
      // Convert Ton to Saca
      const precoBrutoSaca = tonToSaca60kg(precoBaseTon);
      const freteSaca = tonToSaca60kg(freteSojaTon);
      const custoIndustriaSaca = tonToSaca60kg(custoIndustriaTon);
      const custoIcmsOleoSaca = tonToSaca60kg(custoIcmsOleoTon);
      const custoFinanceiroSaca = tonToSaca60kg(custoFinanceiroTon);
      const classificacaoSaca = tonToSaca60kg(valorClassificacaoTon);
      
      // Preço Bruto 1
      const precoBruto1 = precoBrutoSaca - freteSaca - custoIndustriaSaca - custoIcmsOleoSaca - custoFinanceiroSaca - classificacaoSaca;

      // Percentage values from form
      const margemPercentual = data.margem / 100;
      const comissaoPercentual = data.comissao / 100;
      
      let funruralPercentual = 0;
      if (data.tipoVendedor === 'Produtor Rural') {
          funruralPercentual = data.optanteFunrural === 'Faturamento' ? 1.5 : 0.2;
      }
      
      let icmsPercentual = 0;
      if (data.tipoOperacao === 'Interestadual') {
        if (sulSudesteSemES.includes(data.estadoOrigem) && norteNordesteCOComES.includes(data.estadoDestino)) {
          icmsPercentual = 7;
        } else if (data.estadoOrigem !== data.estadoDestino) {
          icmsPercentual = 12;
        }
      }

      const funruralDecimal = funruralPercentual / 100;
      const icmsDecimal = icmsPercentual / 100;

      // Calculations based on Preço Bruto 1
      const margemSaca = precoBruto1 * margemPercentual;
      const comissaoSaca = precoBruto1 * comissaoPercentual;
      
      // Final Liquid Calculation
      const liquidoFinalSaca = precoBruto1 - margemSaca - comissaoSaca; // This is 'Preço Bruto à pagar/saca'

      const funruralSaca = liquidoFinalSaca * funruralDecimal;
      const icmsSaca = liquidoFinalSaca * icmsDecimal;
      const impostosSaca = funruralSaca + icmsSaca;

      const precoLiquidoFinalSaca = liquidoFinalSaca - impostosSaca;
      const liquidoFinalTon = precoLiquidoFinalSaca / 0.06;

      // Legacy/Display values
      const precoLiquidoSaca = precoBrutoSaca - impostosSaca; // Adjusted this line to use the final tax value
      const liquidoAPagarTon = precoLiquidoFinalSaca / 0.06; // Adjusted to be consistent

      setResults({
        precoBrutoSaca,
        funruralPercentual,
        icmsSaca,
        icmsPercentual,
        precoLiquidoSaca,
        liquidoAPagarTon,
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
        title: 'Sem dados para gerar',
        description: 'Por favor, execute uma simulação primeiro.',
      });
      return;
    }
    const data = form.getValues();
    const headers = 'Tipo de Operação,CFOP,CST,Preço Base,Frete,Imposto,Líquido/saca,Líquido/ton\n';
    const row = [
      data.tipoOperacao,
      data.cfop,
      data.cst,
      (data.precoBase ?? 0).toFixed(2),
      (data.tipoFrete === 'CIF' ? data.frete ?? 0 : 0).toFixed(2),
      results.impostosSaca.toFixed(2),
      results.precoLiquidoFinalSaca.toFixed(2),
      results.liquidoFinalTon.toFixed(2),
    ].join(',');

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + row;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'valor_agro_faturamento.csv');
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
            {isSimulated && <ResultsCard results={results} />}
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
            <FileText />
            Gerar IN Faturamento
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
