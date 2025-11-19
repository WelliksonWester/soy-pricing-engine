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
import { formatCurrency } from '@/lib/utils';

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

const Cell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`border border-black p-1 text-xs ${className}`}>{children}</td>
);

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
        let newImgWidth = pdfWidth;
        let newImgHeight = newImgWidth / ratio;
        if (newImgHeight > pdfHeight) {
          newImgHeight = pdfHeight;
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
      <DialogContent className="max-w-4xl">
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
            <div ref={contentRef} className="p-4 bg-white text-black">
            <table className="w-full border-collapse border border-black table-fixed text-center">
                <tbody>
                {/* Row 1-2 */}
                <tr>
                    <Cell className="h-10 font-bold" colSpan={10}>{naturezaOperacao}</Cell>
                    <Cell className="font-bold" colSpan={3}>CFOP: {cfop}</Cell>
                </tr>
                <tr><Cell colSpan={13} className="h-4"></Cell></tr>
                
                {/* Headers */}
                <tr className="font-bold">
                    <Cell>Cód.</Cell>
                    <Cell colSpan={3}>Descrição do Produto</Cell>
                    <Cell>NCM</Cell>
                    <Cell>CST</Cell>
                    <Cell>CFOP</Cell>
                    <Cell>UN</Cell>
                    <Cell>Quant.</Cell>
                    <Cell>Vlr. Unit.</Cell>
                    <Cell>Vlr. Desc.</Cell>
                    <Cell>Valor Total</Cell>
                    <Cell>Alíq. ICMS</Cell>
                </tr>

                {/* Empty rows */}
                {Array.from({ length: 6 }).map((_, i) => <tr key={`empty-top-${i}`}><Cell colSpan={13} className="h-4"></Cell></tr>)}

                {/* Data Row */}
                <tr>
                    <Cell>12019000</Cell>
                    <Cell colSpan={3}>SOJA EM GRAO</Cell>
                    <Cell>12019000</Cell>
                    <Cell>{formValues.cst}</Cell>
                    <Cell>{cfop}</Cell>
                    <Cell>KG</Cell>
                    <Cell>40.000,00</Cell>
                    <Cell>{precoKg.toFixed(2)}</Cell>
                    <Cell>0,00</Cell>
                    <Cell>{valorTotal.toFixed(2)}</Cell>
                    <Cell>0,00</Cell>
                </tr>
                
                {/* Empty rows */}
                 {Array.from({ length: 11 }).map((_, i) => <tr key={`empty-mid-${i}`}><Cell colSpan={13} className="h-4"></Cell></tr>)}

                {/* Totals */}
                <tr>
                    <Cell colSpan={10} className="h-10"></Cell>
                    <Cell className="font-bold">TOTAL DA NOTA</Cell>
                    <Cell colSpan={2}>{formatCurrency(valorTotal)}</Cell>
                </tr>
                 <tr>
                    <Cell colSpan={10} className="h-4"></Cell>
                    <Cell className="font-bold">VLR. APROX. TRIBUTOS</Cell>
                    <Cell colSpan={2}>{formatCurrency(valorTotal)}</Cell>
                </tr>

                 {/* Empty rows */}
                 {Array.from({ length M: 9 }).map((_, i) => <tr key={`empty-bottom-${i}`}><Cell colSpan={13} className="h-4"></Cell></tr>)}
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
