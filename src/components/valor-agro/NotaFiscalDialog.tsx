'use client';

import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { CalculatorFormValues, ResultsState } from '@/lib/types';

interface NotaFiscalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formValues: CalculatorFormValues;
  results: ResultsState;
}

const getNaturezaOperacao = (cfop: string) => {
  switch (cfop) {
    case '5101': return 'Venda prod. do estabelecimento';
    case '5102': return 'Venda merc. adquirida/recebida';
    case '6101': return 'Venda prod. estab. fora do estado';
    case '6102': return 'Venda merc. adquirida fora do est.';
    default: return 'Natureza da Operação';
  }
};

const Cell = ({ children, className = '', colSpan = 1, rowSpan = 1 }: { children: React.ReactNode; className?: string; colSpan?: number, rowSpan?: number }) => (
    <td colSpan={colSpan} rowSpan={rowSpan} className={`border border-black p-1 text-xs text-center align-middle ${className}`}>
        {children}
    </td>
);

const EmptyCell = ({ className = '', ...props }: any) => <Cell {...props} className={`h-4 ${className}`}>&nbsp;</Cell>;

export function NotaFiscalDialog({ isOpen, onOpenChange, formValues, results }: NotaFiscalDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const input = contentRef.current;
    if (input) {
      html2canvas(input, { 
        scale: 2,
        useCORS: true 
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        let newImgWidth = pdfWidth - 20; // with margin
        let newImgHeight = newImgWidth / ratio;

        if (newImgHeight > pdfHeight - 20) {
          newImgHeight = pdfHeight - 20;
          newImgWidth = newImgHeight * ratio;
        }

        const x = (pdfWidth - newImgWidth) / 2;
        const y = (pdfHeight - newImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
        pdf.save('modelo_nota_fiscal.pdf');
      });
    }
  };

  const { cfop } = formValues;
  const { liquidoFinalSaca } = results;

  const naturezaOperacao = getNaturezaOperacao(cfop);
  const precoKg = liquidoFinalSaca > 0 ? (liquidoFinalSaca / 60) : 0;
  const valorTotal = precoKg * 40000;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
            <div className="flex justify-center">
                <Image 
                src="https://i.ibb.co/KpT35Mss/Captura-de-tela-2025-10-16-103235.png" 
                alt="ValorAgro Logo" 
                width={60} 
                height={60} 
                />
            </div>
            <DialogTitle className="text-center text-xl font-bold">Modelo de Nota Fiscal</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full">
            <div ref={contentRef} className="p-4 bg-white text-black text-[10px]">
                <table className="w-full border-collapse border border-black">
                    <tbody>
                        {/* HEADER */}
                        <tr>
                            <Cell className="border-r-0" colSpan={9}>
                                <div className="text-left font-bold">Natureza da Operação</div>
                                <div className="text-left text-sm h-6">{naturezaOperacao}</div>
                            </Cell>
                            <Cell className="border-l-0 border-r-0" colSpan={2}>
                                <div className="text-left font-bold">CFOP</div>
                                <div className="text-left text-sm h-6">{cfop}</div>
                            </Cell>
                            <Cell className="border-l-0" colSpan={2}>
                                <div className="text-left font-bold">Inscrição Estadual do Substituto Tr.</div>
                                <div className="h-6">&nbsp;</div>
                            </Cell>
                        </tr>
                        <tr>
                            <Cell className="border-r-0" colSpan={5}>
                                <div className="text-left font-bold">Nome</div>
                                <div className="text-left text-sm h-6">PLANTA BRASIL AGRONEGOCIOS LTDA</div>
                            </Cell>
                            <Cell className="border-l-0 border-r-0" colSpan={4}>
                                <div className="text-left font-bold">CNPJ</div>
                                <div className="text-left text-sm h-6">XX.XXX.XXX/XXXX-XX</div>
                            </Cell>
                             <Cell className="border-l-0 border-r-0" colSpan={2}>
                                <div className="text-left font-bold">Data Emissão</div>
                                <div className="text-left text-sm h-6 text-red-600">DATA DIA</div>
                            </Cell>
                             <Cell className="border-l-0" colSpan={2}>
                                <div className="text-left font-bold">Data Saída</div>
                                <div className="text-left text-sm h-6 text-red-600">DATA DIA</div>
                            </Cell>
                        </tr>
                        <tr>
                            <Cell colSpan={5}>
                                <div className="text-left font-bold">Endereço</div>
                                <div className="text-left text-sm h-6">AVENIDA MIGUEL SUTIL - 8388</div>
                            </Cell>
                            <Cell colSpan={2}>
                                 <div className="text-left font-bold">Bairro</div>
                                <div className="text-left text-sm h-6 text-red-600">SANTA ROSA</div>
                            </Cell>
                            <Cell colSpan={2}>
                                 <div className="text-left font-bold">Cep</div>
                                <div className="text-left text-sm h-6">78.040-365</div>
                            </Cell>
                             <Cell className="border-b-0" colSpan={4} rowSpan={2}>
                                <div className="h-full border border-blue-500 flex items-center justify-center font-bold text-blue-500 text-sm">VERIFICAR DATA LIMITE P/ EMISSÃO</div>
                            </Cell>
                        </tr>
                         <tr>
                            <Cell colSpan={3}>
                                <div className="text-left font-bold">Município</div>
                                <div className="text-left text-sm h-6 text-red-600">CUIABÁ</div>
                            </Cell>
                            <Cell colSpan={3}>
                                 <div className="text-left font-bold">Fone</div>
                                <div className="h-6">&nbsp;</div>
                            </Cell>
                            <Cell>
                                 <div className="text-left font-bold">UF</div>
                                <div className="text-left text-sm h-6">MT</div>
                            </Cell>
                             <Cell colSpan={2}>
                                 <div className="text-left font-bold">Inscrição Estadual</div>
                                <div className="text-left text-sm h-6">XX.XXX.XXX-X</div>
                            </Cell>
                        </tr>

                        {/* DADOS DO PRODUTO */}
                        <tr><Cell className="font-bold bg-gray-200" colSpan={13}>DADOS DO PRODUTO</Cell></tr>
                        <tr className="font-bold">
                            <Cell>Cód.</Cell>
                            <Cell colSpan={3}>Descrição dos Produtos</Cell>
                            <Cell>Sit Trib</Cell>
                            <Cell>UN.</Cell>
                            <Cell>Quantidade</Cell>
                            <Cell colSpan={2}>Valor Unitário</Cell>
                            <Cell colSpan={2}>Valor Total</Cell>
                            <Cell colSpan={2}>Alíq. ICMS</Cell>
                        </tr>
                        <tr>
                            <Cell>&nbsp;</Cell>
                            <Cell className="text-left text-red-600" colSpan={3}>SOJA EM GRÃOS</Cell>
                            <Cell className="text-red-600">{formValues.cst}</Cell>
                            <Cell className="text-red-600">KG</Cell>
                            <Cell>40.000</Cell>
                            <Cell className="text-red-600" colSpan={2}>{precoKg.toFixed(2)}</Cell>
                            <Cell className="text-red-600" colSpan={2}>{valorTotal.toFixed(2)}</Cell>
                            <Cell colSpan={2}>&nbsp;</Cell>
                        </tr>
                        {Array.from({ length: 9 }).map((_, i) => <tr key={`empty-prod-${i}`}><Cell colSpan={13}>&nbsp;</Cell></tr>)}

                        {/* CALCULO DO IMPOSTO */}
                        <tr><Cell className="font-bold bg-gray-200" colSpan={13}>CALCULO DO IMPOSTO</Cell></tr>
                        <tr className="font-bold">
                            <Cell colSpan={2}>Cálculo do Imposto</Cell>
                            <Cell colSpan={2}>Valor do ICMS</Cell>
                            <Cell colSpan={3}>Base de Calculo Icms Substit.</Cell>
                            <Cell colSpan={3}>Valor do ICMS Substituição</Cell>
                            <Cell colSpan={3}>Valor Total de Produtos</Cell>
                        </tr>
                        <tr>
                            <Cell colSpan={2}>&nbsp;</Cell>
                            <Cell colSpan={2}>&nbsp;</Cell>
                            <Cell colSpan={3}>&nbsp;</Cell>
                            <Cell colSpan={3}>&nbsp;</Cell>
                            <Cell className="text-red-600 font-bold" colSpan={3} rowSpan={2}>{valorTotal.toFixed(2)}</Cell>
                        </tr>
                         <tr>
                            <Cell colSpan={2}>Valor do Frete</Cell>
                            <Cell colSpan={2}>Valor do Seguro</Cell>
                            <Cell colSpan={3}>Outras Despesas.</Cell>
                            <Cell colSpan={3}>Valor Total do IPI</Cell>
                        </tr>
                        <tr>
                            <Cell colSpan={2}>&nbsp;</Cell>
                            <Cell colSpan={2}>&nbsp;</Cell>
                            <Cell colSpan={3}>&nbsp;</Cell>
                            <Cell colSpan={3}>&nbsp;</Cell>
                            <Cell className="font-bold" colSpan={3}>Valor Total da Nota</Cell>
                        </tr>
                        <tr>
                            <Cell colSpan={10}>&nbsp;</Cell>
                            <Cell className="text-red-600 font-bold" colSpan={3}>{valorTotal.toFixed(2)}</Cell>
                        </tr>

                        {/* TRANSPORTADOR */}
                        <tr><Cell className="font-bold bg-gray-200" colSpan={13}>TRANSPORTADOR/ VOLUMES TRANSPORTADOS</Cell></tr>
                        <tr>
                           <Cell colSpan={4}><div className="text-left font-bold">Nome/Razão Social</div></Cell>
                           <Cell colSpan={2}><div className="text-left font-bold">1-emitente 2-destinat</div></Cell>
                           <Cell colSpan={2}><div className="text-left font-bold">Placa do Veículo</div></Cell>
                           <Cell><div className="text-left font-bold">U.F</div></Cell>
                           <Cell colSpan={4}><div className="text-left font-bold">CPF/CNPJ</div></Cell>
                        </tr>
                         <tr>
                           <Cell colSpan={4}>&nbsp;</Cell>
                           <Cell colSpan={2}>&nbsp;</Cell>
                           <Cell colSpan={2}>&nbsp;</Cell>
                           <Cell>&nbsp;</Cell>
                           <Cell colSpan={4}>&nbsp;</Cell>
                        </tr>
                        <tr>
                           <Cell colSpan={4}><div className="text-left font-bold">Endereço</div></Cell>
                           <Cell colSpan={3}><div className="text-left font-bold">Município</div></Cell>
                           <Cell><div className="text-left font-bold">U.F</div></Cell>
                           <Cell colSpan={5}><div className="text-left font-bold">Inscrição Estadual</div></Cell>
                        </tr>
                        <tr>
                           <Cell colSpan={4}>&nbsp;</Cell>
                           <Cell colSpan={3}>&nbsp;</Cell>
                           <Cell>&nbsp;</Cell>
                           <Cell colSpan={5}>&nbsp;</Cell>
                        </tr>
                        <tr>
                           <Cell colSpan={2}><div className="text-left font-bold">Quantidade</div></Cell>
                           <Cell><div className="text-left font-bold">Espécie</div></Cell>
                           <Cell><div className="text-left font-bold">Marca</div></Cell>
                           <Cell><div className="text-left font-bold">Número</div></Cell>
                           <Cell colSpan={3}><div className="text-left font-bold">Peso Bruto</div></Cell>
                           <Cell colSpan={5}><div className="text-left font-bold">Peso Líquido</div></Cell>
                        </tr>
                         <tr>
                           <Cell colSpan={2}>&nbsp;</Cell>
                           <Cell>&nbsp;</Cell>
                           <Cell>&nbsp;</Cell>
                           <Cell>&nbsp;</Cell>
                           <Cell colSpan={3}>&nbsp;</Cell>
                           <Cell colSpan={5}>&nbsp;</Cell>
                        </tr>
                        
                        {/* DADOS ADICIONAIS */}
                         <tr><Cell className="font-bold bg-gray-200" colSpan={13}>DADOS ADICIONAIS</Cell></tr>
                         <tr>
                            <Cell colSpan={9} rowSpan={2} className="text-left align-top">
                                <div className="font-bold">INSERIR DADOS DA CND DO EMITENTE</div>
                                <div>Informar se o FETHAB foi recolhido na operação anterior.</div>
                                <div>Informar se a soja é Intacta ou oriunda de armazém participante.</div>
                            </Cell>
                            <Cell colSpan={4} className="text-left align-top"><div className="font-bold">Reservado ao Fisco</div></Cell>
                         </tr>
                         <tr><Cell colSpan={4} className="h-10">&nbsp;</Cell></tr>
                         <tr>
                            <Cell colSpan={4}><div className="text-left font-bold">Data do Recebimento</div></Cell>
                            <Cell colSpan={5}><div className="text-left font-bold">Identificação e Assinatura do Recebedor</div></Cell>
                            <Cell colSpan={4} rowSpan={2} className="text-left align-top">
                                <div className="font-bold">Nota Fiscal</div>
                                <div className="text-lg">000.000</div>
                            </Cell>
                         </tr>
                         <tr>
                            <Cell colSpan={4} className="h-12">&nbsp;</Cell>
                            <Cell colSpan={5}>&nbsp;</Cell>
                         </tr>
                         <tr>
                            <Cell colSpan={13} className="text-center font-bold text-sm">
                                <div>OBS: NOTAS FISCAIS COM RASURAS OU COM DADOS INCORRETOS NÃO SERÃO ACEITAS</div>
                                <div className="mt-2 text-lg">MODELO DE NOTA FISCAL.</div>
                            </Cell>
                         </tr>
                    </tbody>
                </table>
            </div>
        </ScrollArea>
        <DialogFooter className="pt-4 pr-6 sm:justify-end">
          <Button onClick={handleDownloadPdf} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
