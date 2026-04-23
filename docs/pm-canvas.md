# 📋 Project Model Canvas – ValorAgro

Este documento apresenta o planejamento estratégico do projeto utilizando a metodologia PM Canvas (Finocchio), integrando visão de negócio e arquitetura técnica.

---

| **1. PITCH (JUSTIFICATIVA)** | **2. OBJETIVO SMART** | **3. BENEFÍCIOS** |
| :--- | :--- | :--- |
| Resolver a complexidade logística e fiscal no faturamento de soja, eliminando erros manuais em planilhas que geram prejuízos financeiros e atrasos nas balanças de carga. | Automatizar 100% dos cálculos de conversão (Tonelada/Saca), impostos (Funrural/ICMS) e geração de documentos fiscais em uma PWA funcional em 4 meses. | • Redução de 95% em erros de faturamento.<br>• Agilidade no checkout de cargas.<br>• Conformidade fiscal garantida.<br>• Funcionamento em locais sem internet (Offline). |

| **4. PRODUTO** | **5. REQUISITOS** | **6. STAKEHOLDERS** |
| :--- | :--- | :--- |
| **PWA ValorAgro**: Calculadora inteligente com motor fiscal integrado, exportação de PDFs e painel administrativo para gestão de parâmetros de mercado. | • Calculadora de Precisão (SUL/SUDESTE/NORTE).<br>• Geração de Instrução de Faturamento (PDF).<br>• Gestão dinâmica de CFOP/CST.<br>• Persistência de parâmetros via Firestore. | • Analistas Fiscais e Faturistas.<br>• Gerentes de Logística de Tradings.<br>• Produtores Rurais e Motoristas.<br>• Órgãos Fiscalizadores (Sefaz). |

| **7. EQUIPE** | **8. PREMISSAS** | **9. RESTRIÇÕES** |
| :--- | :--- | :--- |
| **Arquiteto Fullstack**: Definição da stack e Firebase.<br>**Desenvolvedor Frontend**: Interface ShadCN/Tailwind.<br>**Especialista Fiscal**: Validação das regras de ICMS/Funrural. | • Acesso às tabelas de ICMS interestadual.<br>• Disponibilidade de APIs do Google/Firebase.<br>• Usuários possuem dispositivos Android/iOS modernos. | • Prazo acadêmico/comercial rígido.<br>• Orçamento limitado para infraestrutura Cloud inicial.<br>• Uso exclusivo de Next.js 15 e Genkit. |

| **10. RISCOS** | **11. LINHA DO TEMPO** | **12. CUSTOS** |
| :--- | :--- | :--- |
| • Mudanças súbitas na legislação tributária.<br>• Curva de aprendizado no Next.js 15.<br>• Baixa adoção por usuários avessos à tecnologia no campo. | • **Mês 1**: Engine de Cálculo e UI.<br>• **Mês 2**: Integração Firebase e Firestore.<br>• **Mês 3**: Documentação UML e PDF.<br>• **Mês 4**: Testes e Homologação. | • Hospedagem: Firebase App Hosting (Free Tier).<br>• Banco de Dados: Firestore (Pay-as-you-go).<br>• Desenvolvimento: Mão de obra técnica. |

---

### **13. GRUPOS DE ENTREGA (MARCOS)**
1.  **MVP Funcional**: Calculadora básica e PWA configurado.
2.  **Documentação Técnica**: Diagramas UML concluídos:
    *   [Diagrama de Casos de Uso](./use-case.puml)
    *   [Diagrama de Sequência](./sequence-calculation.puml)
    *   [Diagrama de Classes de Domínio](./class-domain.puml)
3.  **Módulo Fiscal**: Automação de CFOP/CST e ICMS Interestadual.
4.  **Sistema de Exportação**: Geração de PDFs e Instruções de Faturamento.

---
*Documento gerado como base de engenharia para o projeto ValorAgro.*