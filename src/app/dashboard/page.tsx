'use client';

import { Calculator } from '@/components/valor-agro/Calculator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <main className="relative p-4 sm:p-6 lg:p-8">
      <Button
        variant="outline"
        size="icon"
        onClick={handleLogout}
        className="absolute top-4 right-4"
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Sair</span>
      </Button>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ValorAgro – Calculadora de Preço da Soja</h1>
        <p className="text-muted-foreground">Calculadora de custo da soja para indústria</p>
      </header>
      <Calculator />
    </main>
  );
}
