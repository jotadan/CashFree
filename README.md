# CashFree — versão HTML/CSS/JS puro

Versão da CashFree **sem build e sem framework**: HTML + CSS + JavaScript puro (vanilla).

## Como rodar

Basta abrir o arquivo `index.html` no navegador. Não precisa instalar nada.

> Dica: como os scripts são carregados como arquivos locais, alguns navegadores
> funcionam melhor servindo a pasta por um servidor estático simples:
>
> ```bash
> cd site
> python3 -m http.server 8000   # depois acesse http://localhost:8000
> ```

## Estrutura

```
site/
├── index.html        # todas as seções (landing, dashboard, lojas, arquitetura, etc.)
├── favicon.svg
├── css/
│   └── styles.css    # design system completo (variáveis, componentes, responsivo)
└── js/
    ├── data.js       # dados mockados (CASHFREE_DATA) — separados da lógica
    └── app.js        # interações: menu mobile, abas, filtros, simulador, formulário...
```

## Interações implementadas (estado em memória, sem backend)

1. Menu mobile (hambúrguer) abrindo/fechando + header que muda ao rolar
2. Dashboard com 4 abas (Visão geral, Alertas, Recomendações, Programas)
3. Alertas que podem ser marcados como resolvidos (e restaurados)
4. Ordenar programas por maior cashback / filtrar por vencimento próximo
5. Lojas parceiras com filtro por categoria, ordenação e "Ativar benefício"
6. Simulador da extensão de navegador (ativação + captura passiva animada)
7. Simulador de economia com cálculo dinâmico (mensal/anual + pontos salvos)
8. Tabela comparativa responsiva (scroll horizontal no mobile)
9. Seção de Arquitetura / System Design com trade-offs em acordeão
10. Formulário de lista de espera com mensagem de sucesso

Todo o conteúdo está em português (pt-BR) e o layout é 100% responsivo
(desktop / tablet / celular).
