'use client';

import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UFS } from '@/lib/states';
import type { CalculatorFormValues } from '@/lib/types';

interface OperationDataCardProps {
  form: UseFormReturn<CalculatorFormValues>;
}

export function OperationDataCard({ form }: OperationDataCardProps) {
  const { control, watch, setValue } = form;
  const tipoOperacao = watch('tipoOperacao');
  const tipoVendedor = watch('tipoVendedor');
  const estadoOrigem = watch('estadoOrigem');
  const estadoDestino = watch('estadoDestino');

  useEffect(() => {
    if (tipoOperacao === 'Intraestadual' && estadoOrigem !== estadoDestino) {
        setValue('estadoDestino', estadoOrigem);
    }
  }, [tipoOperacao, estadoOrigem, setValue]);


  useEffect(() => {
    let cfop = '';
    let cst = '';

    if (tipoOperacao === 'Intraestadual') {
      cst = '41';
      cfop = tipoVendedor === 'Produtor Rural' ? '5101' : '5102';
    } else {
      // Interestadual
      cst = '51';
      cfop = tipoVendedor === 'Produtor Rural' ? '6101' : '6102';
    }
    setValue('cfop', cfop, { shouldValidate: true });
    setValue('cst', cst, { shouldValidate: true });
  }, [tipoOperacao, tipoVendedor, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Operação</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="tipoOperacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Operação *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Intraestadual">Intraestadual</SelectItem>
                  <SelectItem value="Interestadual">Interestadual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tipoVendedor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Vendedor *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Produtor Rural">Produtor Rural</SelectItem>
                  <SelectItem value="Comerciante">Comerciante</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cfop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CFOP</FormLabel>
              <FormControl>
                <Input {...field} readOnly disabled className="bg-muted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cst"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CST</FormLabel>
              <FormControl>
                <Input {...field} readOnly disabled className="bg-muted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="estadoOrigem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Origem</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {UFS.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="estadoDestino"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Destino</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {UFS.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
