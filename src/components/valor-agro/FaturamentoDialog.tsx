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

interface FaturamentoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cfop: string;
}

export function FaturamentoDialog({ isOpen, onOpenChange, cfop }: FaturamentoDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const input = scrollableContentRef.current;
    if (input) {
      // Temporarily remove height restrictions to capture full content
      const originalHeight = input.style.height;
      const originalOverflow = input.style.overflow;
      input.style.height = 'auto';
      input.style.overflow = 'visible';

      html2canvas(input, { 
        scale: 2, // Improve quality
        scrollY: -window.scrollY,
        useCORS: true 
      }).then((canvas) => {
        // Restore original styles
        input.style.height = originalHeight;
        input.style.overflow = originalOverflow;
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const pdfHeight = pdfWidth / ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('instrucao_faturamento.pdf');
      });
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
          <ScrollArea className="h-[60vh] pr-2">
            <div ref={scrollableContentRef} className="p-6 bg-white">
              <DialogHeader>
                <div className="flex justify-center">
                  <Image 
                    src="https://i.ibb.co/KpT35Mss/Captura-de-tela-2025-10-16-103235.png" 
                    alt="ValorAgro Logo" 
                    width={80} 
                    height={80} 
                  />
                </div>
                <DialogTitle className="text-center text-xl font-bold mt-4">Instrução Normativa de Faturamento</DialogTitle>
              </DialogHeader>
              <div className="py-4 text-sm space-y-3">
                <p><strong>1º</strong> Fornecedor emite nota fiscal CFOP <strong>{cfop}</strong>, conforme modelo de nota.</p>
                
                <p><strong>2º</strong> Fornecedor encaminha via e-mail os seguintes documentos:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Nota Fiscal Eletronica</li>
                  <li>XML</li>
                  <li>Ticket de Pesagem</li>
                  <li>Ordem de carregamento</li>
                  <li>Laudo de classificação</li>
                </ul>

                <p><strong>Destinatário:</strong> faturamento@valoragro.com.br e colocar em cópia para a transportadora e demais interessados.</p>

                <div>
                  <p><strong>Assunto do e-mail:</strong></p>
                  <p className="font-mono bg-muted p-2 rounded-md text-xs mt-1">NF XXXX – [NOME DA EMPRESA] X VALOR AGRO – PLACA XXX-XXXX</p>
                </div>

                <p><strong>3º</strong> Valor Agro troca a nota fiscal e responde no mesmo e-mail com DANFe + XML para a transportadora manifestar.</p>

                <p><strong>4º</strong> Transportadora manifesta a nota fiscal da Valor Agro e encaminha CTe + XML do CTe.</p>
                
                <p><strong>5º Horário para troca de notas:</strong> segunda a sexta-feira, das 07h30 às 17h00.</p>
                
                <div>
                  <p><strong>6º Plantões de final de semana ou eventuais dúvidas, entrar em contato:</strong></p>
                  <p className="mt-1">Wellikson Wester - (66) 9 9612-9264</p>
                </div>
              </div>
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
