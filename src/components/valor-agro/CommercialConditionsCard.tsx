'use client';

import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { CalculatorFormValues } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CommercialConditionsCardProps {
  form: UseFormReturn<CalculatorFormValues>;
}

const NumericInput = ({ field, prefix, suffix, ...props }: any) => (
  <div className="relative">
    {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
    <Input
      type="number"
      step="0.01"
      {...field}
      {...props}
      className={cn(prefix ? 'pl-9' : 'pr-9')}
      onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
    />
    {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
  </div>
);

export function CommercialConditionsCard({ form }: CommercialConditionsCardProps) {
  const { control, watch, setValue } = form;
  const tipoFrete = watch('tipoFrete');

  useEffect(() => {
    if (tipoFrete === 'CIF') {
      setValue('classificacao', 'Origem');
    } else {
      setValue('classificacao', 'Destino');
      setValue('frete', 0);
      setValue('distancia', 0);
      setValue('valorClassificacao', 0);
    }
  }, [tipoFrete, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condições Comerciais</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="precoBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço base (R$/ton) *</FormLabel>
              <FormControl>
                <NumericInput field={field} prefix="R$" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="custoIndustria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo Indústria (R$/ton)</FormLabel>
              <FormControl>
                <NumericInput field={field} prefix="R$" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tipoFrete"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Frete</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CIF" />
                    </FormControl>
                    <FormLabel className="font-normal">FOB</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FOB" />
                    </FormControl>
                    <FormLabel className="font-normal">CIF</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="frete"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frete (R$/ton)</FormLabel>
              <FormControl>
                <NumericInput field={field} prefix="R$" disabled={tipoFrete !== 'CIF'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="distancia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distância (km)</FormLabel>
              <FormControl>
                <NumericInput field={field} suffix="km" disabled={tipoFrete !== 'CIF'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="classificacao"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Classificação</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  className="flex items-center space-x-4"
                  disabled
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Origem" />
                    </FormControl>
                    <FormLabel className="font-normal">Origem</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Destino" />
                    </FormControl>
                    <FormLabel className="font-normal">Destino</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="valorClassificacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Classificação (R$/ton)</FormLabel>
              <FormControl>
                 <NumericInput field={field} prefix="R$" disabled={tipoFrete !== 'CIF'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="margem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Margem (%) *</FormLabel>
                <FormControl>
                   <NumericInput field={field} suffix="%" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="comissao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comissão (%) *</FormLabel>
                <FormControl>
                   <NumericInput field={field} suffix="%" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
