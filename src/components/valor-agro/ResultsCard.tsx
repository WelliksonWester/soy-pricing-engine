'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import type { ResultsState } from '@/lib/types';

interface ResultsCardProps {
  results: ResultsState;
  isSimulated: boolean;
}

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const SummaryRow = ({ label, value, isTotal = false }: { label: string; value: string, isTotal?: boolean }) => (
  <div className={`flex items-baseline justify-between ${isTotal ? 'text-lg' : 'text-base'}`}>
    <p className={isTotal ? "font-semibold" : ""}>{label}</p>
    <p className={isTotal ? "font-bold text-primary" : "font-medium"}>{value}</p>
  </div>
)

export function ResultsCard({ results, isSimulated }: ResultsCardProps) {
  if (!isSimulated) {
    return (
      <Card className="flex h-full items-center justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Os resultados aparecerão aqui após a simulação.</p>
        </CardContent>
      </Card>
    );
  }

  const {
    precoBrutoSaca,
    freteSaca,
    tributosSaca,
    liquidoFinalSaca,
    liquidoFinalTon,
    liquidoFinalCarga
  } = results;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultado</CardTitle>
        <CardDescription>Resumo final da simulação de preços.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-lg border p-4">
            <ResultRow label="Preço Bruto/saca" value={formatCurrency(precoBrutoSaca)} />
            <ResultRow label="Frete/saca (se CIF)" value={formatCurrency(freteSaca)} />
            <ResultRow label="Tributos/saca" value={formatCurrency(tributosSaca)} />
        </div>
        
        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">Resumo do Custo e Líquido</h3>
           <div className="flex flex-col space-y-2 rounded-md bg-accent/30 p-4">
            <SummaryRow label="Preço Bruto" value={formatCurrency(precoBrutoSaca)} />
            <SummaryRow label="- Frete" value={formatCurrency(freteSaca)} />
            <SummaryRow label="- Tributos" value={formatCurrency(tributosSaca)} />
            <Separator className="my-1 bg-accent" />
            <SummaryRow label="= Líquido Final/saca" value={formatCurrency(liquidoFinalSaca)} isTotal={true}/>
           </div>
        </div>

        <Separator />
        
        <div className="space-y-2">
            <ResultRow label="Líquido/ton" value={formatCurrency(liquidoFinalTon)} />
            <ResultRow label="Líquido/carga (30 ton)" value={formatCurrency(liquidoFinalCarga)} />
        </div>

      </CardContent>
    </Card>
  );
}
