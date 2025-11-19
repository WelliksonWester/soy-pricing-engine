'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface FaturamentoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cfop: string;
}

export function FaturamentoDialog({ isOpen, onOpenChange, cfop }: FaturamentoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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
          <p><strong>1º</strong> Fornecedor emite nota fiscal CFOP <strong>[{cfop}]</strong>, conforme modelo de nota.</p>
          
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
      </DialogContent>
    </Dialog>
  );
}
