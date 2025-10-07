'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CfopDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cfop: string;
  cst: string;
}

export function CfopDialog({ isOpen, onOpenChange, cfop, cst }: CfopDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Códigos Fiscais Gerados</DialogTitle>
          <DialogDescription>
            Estes são os códigos fiscais correspondentes à operação selecionada.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">CFOP</p>
            <p className="text-2xl font-bold">{cfop}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">CST</p>
            <p className="text-2xl font-bold">{cst}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
