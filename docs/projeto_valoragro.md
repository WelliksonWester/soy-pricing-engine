# 🧭 ValorAgro – Bússola do Projeto

## 1. Visão Geral
O **ValorAgro** é uma Progressive Web App (PWA) de alta performance projetada para resolver um dos maiores gargalos logísticos e financeiros das indústrias e tradings de soja: a precificação e faturamento de cargas. A solução automatiza cálculos fiscais complexos e garante a conformidade entre o preço de mercado (farelo/óleo) e o valor líquido a ser pago ao produtor.

---

## 2. Funcionalidades Core
*   **Calculadora de Precisão:** Conversão instantânea de preços por tonelada (indústria) para preços por saca de 60kg (produtor).
*   **Motor Fiscal:** Determinação automática de CFOP e CST baseada na natureza da operação (Intra/Interestadual) e tipo de vendedor.
*   **Exportação de Documentos:** Geração de PDFs para Instrução Normativa de Faturamento e Modelos de Nota Fiscal.
*   **Funcionamento Offline (PWA):** Capacidade de operar em balanças e armazéns com baixa conectividade.
*   **Autenticação ERP:** Acesso restrito via Firebase Auth para garantir que apenas usuários autorizados realizem simulações comerciais.

---

## 3. Regras de Negócio e Lógica Fiscal

### 3.1. Formação do Preço Base
O preço base da soja é derivado dos subprodutos (Crush Spread):
*   **Farelo de Soja (76%):** Rendimento padrão de extração.
*   **Óleo de Soja (18,5%):** Rendimento padrão de extração.
*   **Cálculo:** `(Preço Farelo * 0.76) + (Preço Óleo * 0.185) - Fretes dos Subprodutos`.

### 3.2. Tributação
*   **Funrural:**
    *   *Opção Faturamento:* 1,63% (Produtor Rural).
    *   *Opção Folha:* 0,20% (Produtor Rural).
*   **ICMS Interestadual:**
    *   7% para operações de Sul/Sudeste (exceto ES) para Norte/Nordeste/Centro-Oeste/ES.
    *   12% para as demais operações interestaduais.
*   **Diferimento:** Operações intraestaduais com soja no PR/MT geralmente possuem diferimento (CST 41/51).

---

## 4. Parametrização Dinâmica (via Firestore)
Diferente de calculadoras estáticas, o ValorAgro utiliza o **Firebase Firestore** para gerenciar variáveis voláteis do negócio. Isso permite que cada empresa ou usuário defina seus próprios parâmetros sem alterar o código:

| Parâmetro | Descrição |
| :--- | :--- |
| **Custo Indústria** | Valor fixo de esmagamento/processamento por tonelada. |
| **Taxa Financeira** | Custo do dinheiro no tempo (Selic/CDI) para cálculos de pagamento a prazo. |
| **Margem/Spread** | Lucro desejado sobre a operação. |
| **Comissão** | Taxa de corretagem ou originação. |

---

## 5. Guia de Estilo e UX
*   **Paleta de Cores:** Blue-gray (`#2A5D8F`) para sobriedade corporativa e tons de cinza claro (`#F3F3F3`) para legibilidade.
*   **Tipografia:** 'PT Sans' - escolhida pela clareza em dados numéricos extensos.
*   **Layout:** Baseado em painéis (Cards) que agrupam informações por contexto: Dados da Operação -> Condições Comerciais -> Impostos -> Resultados.
*   **Interatividade:** Feedback instantâneo via `Toasts` e diálogos modais para visualização de documentos.

---

## 6. Stack Tecnológica
*   **Frontend:** Next.js 15 (App Router), React, Tailwind CSS.
*   **UI:** ShadCN UI (componentes acessíveis).
*   **Backend:** Firebase (Auth, Firestore, App Hosting).
*   **Geração de Documentos:** jsPDF, html2canvas.
