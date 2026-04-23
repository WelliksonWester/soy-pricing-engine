'use client';

import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { CalculatorFormValues } from '@/lib/types';
import { calculateBasePrice, calculateIcmsOleoCost, calculateFinancialCost } from '@/lib/services/soy-service';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface CommercialConditionsCardProps {
  form: UseFormReturn<CalculatorFormValues>;
}

const NumericInput = ({ field, prefix, suffix, noStep, className, ...props }: any) => (
  <div className="relative">
    {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{prefix}</span>}
    <Input
      type="number"
      step={noStep ? undefined : "0.01"}
      {...field}
      {...props}
      className={cn(prefix ? 'pl-8' : '', suffix ? 'pr-8' : '', className)}
      onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
    />
    {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
  </div>
);

export function CommercialConditionsCard({ form }: CommercialConditionsCardProps) {
  const { control, watch, setValue } = form;
  
  const values = watch();

  useEffect(() => {
    const basePrice = calculateBasePrice(
      values.precoFarelo || 0,
      values.freteFarelo || 0,
      values.precoOleo || 0,
      values.freteOleo || 0
    );
    
    const icmsCost = calculateIcmsOleoCost(
      values.precoOleo || 0,
      values.freteOleo || 0,
      values.icmsOleo || 0
    );

    const finCost = calculateFinancialCost(basePrice, values.financeiro || 0);

    setValue('precoBase', basePrice);
    setValue('custoIcmsOleo', icmsCost);
    setValue('custoFinanceiro', finCost);
    
  }, [values.precoFarelo, values.freteFarelo, values.precoOleo, values.freteOleo, values.icmsOleo, values.financeiro, setValue]);

  useEffect(() => {
    if (values.tipoFrete === 'CIF') {
      setValue('classificacao', 'Origem');
    } else {
      setValue('classificacao', 'Destino');
      setValue('frete', 0);
      setValue('valorClassificacao', 0);
    }
  }, [values.tipoFrete, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condições Comerciais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="precoFarelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Farelo (R$/ton)</FormLabel>
                <NumericInput field={field} prefix="R$" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="freteFarelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frete Farelo (R$/ton)</FormLabel>
                <NumericInput field={field} prefix="R$" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="precoOleo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Óleo (R$/ton)</FormLabel>
                <NumericInput field={field} prefix="R$" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="freteOleo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frete Óleo (R$/ton)</FormLabel>
                <NumericInput field={field} prefix="R$" />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="precoBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço base (Auto)</FormLabel>
                <NumericInput field={field} prefix="R$" readOnly className="bg-muted" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={control}
              name="financeiro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias Fin.</FormLabel>
                  <NumericInput field={field} suffix="d" noStep />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="custoFinanceiro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo Fin.</FormLabel>
                  <NumericInput field={field} prefix="R$" readOnly className="bg-muted text-xs" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="custoIndustria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Indústria (R$/ton)</FormLabel>
                <NumericInput field={field} prefix="R$" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={control}
              name="icmsOleo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ICMS Óleo</FormLabel>
                  <NumericInput field={field} suffix="%" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="custoIcmsOleo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo ICMS</FormLabel>
                  <NumericInput field={field} prefix="R$" readOnly className="bg-muted text-xs" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="tipoFrete"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frete</FormLabel>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-2">
                  <div className="flex items-center space-x-1"><RadioGroupItem value="CIF" id="cif" /><label htmlFor="cif">CIF</label></div>
                  <div className="flex items-center space-x-1"><RadioGroupItem value="FOB" id="fob" /><label htmlFor="fob">FOB</label></div>
                </RadioGroup>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="frete"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Frete Soja</FormLabel>
                <NumericInput field={field} prefix="R$" disabled={values.tipoFrete !== 'CIF'} />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="margem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Margem %</FormLabel>
                  <NumericInput field={field} suffix="%" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="comissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comissão %</FormLabel>
                  <NumericInput field={field} suffix="%" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
