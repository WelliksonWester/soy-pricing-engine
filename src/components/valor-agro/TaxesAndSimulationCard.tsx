'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import type { ResultsState, CalculatorFormValues } from '@/lib/types';
import type { UseFormReturn } from 'react-hook-form';

interface TaxesAndSimulationCardProps {
  form: UseFormReturn<CalculatorFormValues>;
  results: ResultsState;
}

const ReadonlyInput = ({ label, value, prefix, suffix }: { label: string; value: string; prefix?: string; suffix?: string }) => (
  <FormItem>
    <FormLabel>{label}</FormLabel>
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
      <Input readOnly disabled value={value} className="bg-muted text-foreground font-medium" />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
    </div>
  </FormItem>
);

export function TaxesAndSimulationCard({ form, results }: Omit<TaxesAndSimulationCardProps, 'form'> & { form: UseFormReturn<CalculatorFormValues> }) {
  const { control, watch } = form;
  const tipoVendedor = watch('tipoVendedor');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostos</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {control && (
          <FormField
            control={control}
            name="optanteFunrural"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Optante pelo Funrural</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={tipoVendedor === 'Comerciante'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Folha">Folha</SelectItem>
                    <SelectItem value="Faturamento">Faturamento</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}
         <ReadonlyInput
            label="Funrural | Gilrat | Senar (%)"
            value={results.funruralPercentual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            suffix="%"
          />
        <ReadonlyInput
            label="ICMS (%)"
            value={results.icmsPercentual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            suffix="%"
        />
        <ReadonlyInput label="ICMS" value={formatCurrency(results.icmsSaca)} />
        <ReadonlyInput label="Preço bruto/saca (R$)" value={formatCurrency(results.precoBrutoSaca)} />
        <ReadonlyInput label="Preço líquido/saca (R$)" value={formatCurrency(results.precoLiquidoSaca)} />
      </CardContent>
    </Card>
  );
}
