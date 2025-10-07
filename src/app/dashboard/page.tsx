import { Calculator } from '@/components/valor-agro/Calculator';

export default function DashboardPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ValorAgro – Calculadora de Preço da Soja</h1>
        <p className="text-muted-foreground">Simulador para industrialização</p>
      </header>
      <Calculator />
    </main>
  );
}
