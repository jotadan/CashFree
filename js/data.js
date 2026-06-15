
const CASHFREE_DATA = {
  programs: [
    { id: 'meliuz', name: 'Méliuz', kind: 'cashback', cashback: 38.7, points: 0, expiresInDays: 45, color: '#ec4899', logo: 'M', status: 'conectado' },
    { id: 'ame', name: 'Ame Digital', kind: 'cashback', cashback: 52.3, points: 0, expiresInDays: 18, color: '#7c3aed', logo: 'A', status: 'conectado' },
    { id: 'cuponomia', name: 'Cuponomia', kind: 'cashback', cashback: 16.4, points: 0, expiresInDays: 60, color: '#f59e0b', logo: 'C', status: 'pendente' },
    { id: 'banco-prime', name: 'Banco Prime', kind: 'pontos', cashback: 0, points: 6800, expiresInDays: 7, color: '#2563eb', logo: 'B', status: 'conectado' },
    { id: 'cartao-flex', name: 'Cartão Flex', kind: 'pontos', cashback: 0, points: 12400, expiresInDays: 30, color: '#059669', logo: 'F', status: 'conectado' },
    { id: 'milhas-go', name: 'Milhas Go', kind: 'milhas', cashback: 0, points: 4200, expiresInDays: 21, color: '#0891b2', logo: 'G', status: 'conectado' },
  ],

  storeCategories: ['Moda', 'Eletrônicos', 'Mercado', 'Viagens', 'Educação', 'Serviços digitais'],

  stores: [
    { id: 'techhouse', name: 'TechHouse', category: 'Eletrônicos', cashback: 8, coupon: null, highlight: 'Cashback alto', logo: 'TH' },
    { id: 'modamais', name: 'ModaMais', category: 'Moda', cashback: 6, coupon: 'MODA15', highlight: 'Cupom expirando', logo: 'MM' },
    { id: 'mercadoja', name: 'Mercado Já', category: 'Mercado', cashback: 3, coupon: null, highlight: null, logo: 'MJ' },
    { id: 'viagempro', name: 'ViagemPro', category: 'Viagens', cashback: 10, coupon: 'VIAJE10', highlight: 'Cashback alto', logo: 'VP' },
    { id: 'educaonline', name: 'EducaOnline', category: 'Educação', cashback: 12, coupon: null, highlight: 'Melhor oportunidade', logo: 'EO' },
    { id: 'casasmart', name: 'CasaSmart', category: 'Serviços digitais', cashback: 5, coupon: 'FRETE10', highlight: null, logo: 'CS' },
  ],

  alerts: [
    { id: 'a1', title: '8.400 pontos vencem em 7 dias', description: 'Pontos do Banco Prime expiram em breve. Resgate ou troque por produtos.', severity: 'alta', daysLeft: 7 },
    { id: 'a2', title: 'Cupom MODA15 expira amanhã', description: 'Cupom de 15% na ModaMais válido apenas até amanhã.', severity: 'alta', daysLeft: 1 },
    { id: 'a3', title: 'Cashback Ame Digital vence em 18 dias', description: 'R$ 52,30 disponíveis para resgate antes do vencimento.', severity: 'média', daysLeft: 18 },
    { id: 'a4', title: 'Milhas Go próximas do vencimento', description: '4.200 milhas expiram em 21 dias. Use em passagens ou produtos.', severity: 'média', daysLeft: 21 },
  ],

  recommendations: [
    { id: 'r1', title: 'Compre na EducaOnline hoje para obter 12% de cashback', reason: 'Maior taxa de cashback entre as lojas parceiras conectadas à sua conta.', potential: 24.0 },
    { id: 'r2', title: 'Use seus pontos do Cartão Flex antes do vencimento', reason: '12.400 pontos disponíveis com vencimento parcial em 30 dias.', potential: 62.0 },
    { id: 'r3', title: 'Ative o cupom MODA15 antes de finalizar a compra', reason: 'Combine cupom de 15% com 6% de cashback na ModaMais.', potential: 31.5 },
    { id: 'r4', title: 'A TechHouse está com cashback acima da média', reason: '8% de cashback hoje, contra média de 5% da categoria Eletrônicos.', potential: 18.0 },
  ],

  benefits: [
    { icon: '👛', title: 'Visão consolidada', text: 'Todos os seus saldos de cashback, pontos e milhas reunidos em um só painel.' },
    { icon: '🔔', title: 'Alertas de expiração', text: 'Avisos automáticos antes que pontos, cashback e cupons expirem.' },
    { icon: '✨', title: 'Recomendações inteligentes', text: 'Sugestões de onde comprar e quando usar para maximizar o retorno.' },
    { icon: '🎟️', title: 'Cupons e cashback juntos', text: 'Combine cupons e cashback da mesma loja sem alternar entre apps.' },
    { icon: '🧩', title: 'Extensão de navegador', text: 'Captura passiva de oportunidades enquanto você navega pelas lojas.' },
    { icon: '📈', title: 'Menos perdas, mais economia', text: 'Recupere benefícios esquecidos e transforme-os em economia real.' },
  ],

  painPoints: [
    'Consumidores usam diversos programas diferentes ao mesmo tempo',
    'Cada programa tem regras, prazos e plataformas próprias',
    'Pontos expiram sem uso por falta de acompanhamento',
    'Cashback fica espalhado em várias plataformas',
    'Usuários não sabem onde vale mais a pena comprar',
    'Benefícios financeiros são perdidos no dia a dia',
  ],

  lostStats: [
    { value: 'R$ 127,50', label: 'em cashback esquecido' },
    { value: '8.400', label: 'pontos próximos de expirar' },
    { value: '12', label: 'cupons não utilizados' },
    { value: '5', label: 'programas diferentes para acompanhar' },
  ],

  steps: [
    { n: 1, title: 'Conecte seus programas', text: 'Adicione seus programas de cashback, pontos e fidelidade em poucos cliques.' },
    { n: 2, title: 'Instale a extensão CashFree', text: 'A extensão identifica oportunidades de cashback e cupons enquanto você navega.' },
    { n: 3, title: 'Navegue normalmente', text: 'Compre nas lojas parceiras como sempre — a CashFree trabalha em segundo plano.' },
    { n: 4, title: 'Receba alertas automáticos', text: 'Saiba antes de qualquer ponto, cashback ou cupom expirar.' },
    { n: 5, title: 'Veja recomendações no dashboard', text: 'Descubra onde comprar e quando usar para extrair o máximo de cada benefício.' },
    { n: 6, title: 'Use antes que expire', text: 'Transforme benefícios esquecidos em economia real, mês após mês.' },
  ],

  comparison: [
    { feature: 'Centralização de múltiplos programas', cashfree: true, meliuz: false, ame: false, cuponomia: false },
    { feature: 'Alertas de expiração', cashfree: true, meliuz: false, ame: true, cuponomia: false },
    { feature: 'Recomendações inteligentes', cashfree: true, meliuz: true, ame: false, cuponomia: true },
    { feature: 'Extensão de navegador', cashfree: true, meliuz: true, ame: false, cuponomia: true },
    { feature: 'Gestão de pontos e cashback', cashfree: true, meliuz: false, ame: true, cuponomia: false },
    { feature: 'Cupons integrados', cashfree: true, meliuz: true, ame: false, cuponomia: true },
    { feature: 'Visão consolidada', cashfree: true, meliuz: false, ame: false, cuponomia: false },
    { feature: 'Independência de ecossistema fechado', cashfree: true, meliuz: false, ame: false, cuponomia: true },
  ],

  // --- System Design ---
  layers: [
    { name: 'Camada de Experiência', cls: 'layer--green', blocks: ['Web App', 'Mobile Responsive', 'Browser Extension'] },
    { name: 'Camada de Aplicação', cls: 'layer--blue', blocks: ['API Gateway', 'Auth Service', 'Recommendation Engine', 'Notification Service'] },
    { name: 'Camada de Dados', cls: 'layer--violet', blocks: ['MongoDB (NoSQL)', 'Cache (Redis)', 'Logs & Métricas'] },
    { name: 'Camada de Integrações', cls: 'layer--amber', blocks: ['Lojas Parceiras', 'Bancos', 'Programas de Fidelidade', 'Gateways de Cashback'] },
  ],

  flow: [
    'O usuário acessa o site ou a extensão CashFree',
    'A extensão identifica oportunidades de cashback e cupons nas lojas parceiras',
    'Os dados capturados são enviados ao backend via API Gateway',
    'O backend consolida saldos, pontos, cashback e datas de expiração',
    'O motor de recomendações calcula as melhores oportunidades',
    'O usuário visualiza tudo de forma unificada no dashboard',
    'O serviço de notificações envia alertas sobre benefícios a vencer',
  ],

  components: [
    'Web App', 'Browser Extension', 'API Gateway', 'Auth Service', 'Cashback Aggregation Service',
    'Recommendation Engine', 'Notification Service', 'Partner Integration Layer', 'MongoDB / NoSQL', 'Cache de consultas frequentes',
  ],

  entities: [
    { name: 'User', fields: ['id', 'nome', 'email', 'programas[]', 'preferências'] },
    { name: 'RewardProgram', fields: ['id', 'nome', 'tipo', 'regras', 'parceiro'] },
    { name: 'CashbackBalance', fields: ['id', 'userId', 'programId', 'valor', 'expiraEm'] },
    { name: 'LoyaltyPoints', fields: ['id', 'userId', 'programId', 'saldo', 'expiraEm'] },
    { name: 'Coupon', fields: ['id', 'código', 'storeId', 'desconto', 'validade'] },
    { name: 'PartnerStore', fields: ['id', 'nome', 'categoria', 'cashbackPct', 'cupons[]'] },
    { name: 'Transaction', fields: ['id', 'userId', 'storeId', 'valor', 'cashbackGerado'] },
    { name: 'Recommendation', fields: ['id', 'userId', 'tipo', 'score', 'potencial'] },
    { name: 'Notification', fields: ['id', 'userId', 'tipo', 'mensagem', 'lida'] },
  ],

  nfr: [
    { icon: '🛡️', title: 'Segurança & Criptografia', text: 'Dados sensíveis criptografados em repouso e em trânsito (TLS, AES-256).' },
    { icon: '📐', title: 'Escalabilidade', text: 'Serviços stateless e horizontalmente escaláveis atrás do API Gateway.' },
    { icon: '⚡', title: 'Baixa latência', text: 'Cache de saldos e recomendações para um dashboard sempre rápido.' },
    { icon: '🗄️', title: 'Alta disponibilidade', text: 'Réplicas de banco e tolerância a falhas em múltiplas zonas.' },
    { icon: '🔒', title: 'LGPD & Privacidade', text: 'Consentimento explícito, minimização de dados e direito ao esquecimento.' },
    { icon: '📊', title: 'Observabilidade', text: 'Logs estruturados, métricas e tracing distribuído para monitoramento.' },
    { icon: '🚨', title: 'Prevenção a fraudes', text: 'Detecção de anomalias em transações e validação de origem dos benefícios.' },
    { icon: '👥', title: 'Controle de permissões', text: 'RBAC e escopos de acesso por serviço e por usuário.' },
  ],

  tradeoffs: [
    { q: 'Por que começar com MVP focado na extensão de navegador?', a: 'A captura passiva via extensão entrega valor imediato sem depender de integrações bancárias formais, que exigem parcerias e homologações demoradas.' },
    { q: 'Por que usar Node.js no backend?', a: 'Ecossistema maduro, alta produtividade, ótimo para I/O intensivo (muitas chamadas a APIs de parceiros) e código JavaScript/TypeScript compartilhado com o front-end.' },
    { q: 'Por que usar MongoDB / NoSQL?', a: 'Programas de fidelidade têm esquemas heterogêneos e em evolução. Um modelo de documentos acomoda regras variadas sem migrações rígidas e escala horizontalmente.' },
    { q: 'Limitações iniciais do MVP', a: 'Dados parcialmente dependentes da navegação do usuário, cobertura limitada de parceiros e ausência de conciliação bancária automática.' },
    { q: 'Como evoluir?', a: 'Adicionar integrações via Open Finance, APIs oficiais de programas de fidelidade e parcerias diretas com gateways de cashback para dados em tempo real.' },
  ],

  totals: { activeCoupons: 12, estimatedMonthlySavings: 87.4 },

  // --- Planos de assinatura ---
  plans: {
    tiers: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        badge: null,
        cta: 'Começar Grátis',
        desc: 'Para organizar seus benefícios sem nenhum custo.',
        highlights: [
          'Cupons básicos de lojas parceiras',
        ],
      },
      {
        id: 'economiza',
        name: 'Economiza',
        price: 9.9,
        badge: 'Mais Popular',
        cta: 'Assinar Economiza',
        desc: 'Mais cupons, cashback turbinado e alertas completos.',
        highlights: [
          'Cupons exclusivos e ampliados',
          'Cashback turbinado em até +10%',
          'Acesso antecipado a campanhas',
          'Suporte prioritário',
        ],
      },
      {
        id: 'economiza-plus',
        name: 'Economiza+',
        price: 19.9,
        badge: 'Premium',
        cta: 'Assinar Economiza+',
        desc: 'A experiência completa, com vantagens exclusivas.',
        highlights: [
          'Tudo do plano Economiza',
          'Cupons exclusivos premium ilimitados',
          'Cashback turbinado em até +20%',
          'Sorteios e brindes exclusivos',
          'Resgate prioritário de ofertas limitadas',
        ],
      },
    ],
    benefits: [
      { label: 'Cupons de lojas parceiras', values: ['Básicos', 'Exclusivos', 'Exclusivos Premium'] },
      { label: 'Quantidade de cupons disponíveis', values: ['Limitada', 'Ampliada', 'Ilimitada'] },
      { label: 'Acesso antecipado a campanhas', values: [false, true, true] },
      { label: 'Cupons com maior desconto', values: [false, true, true] },
      { label: 'Promoções exclusivas para assinantes', values: [false, true, true] },
      { label: 'Cashback turbinado em campanhas especiais', values: [false, 'Até +10%', 'Até +20%'] },
      { label: 'Sorteios e brindes exclusivos', values: [false, false, true] },
      { label: 'Notificação de cupons próximos do vencimento', values: [false, true, true] },
      { label: 'Resgate prioritário de ofertas limitadas', values: [false, false, true] },
      { label: 'Suporte prioritário', values: [false, true, true] },
      { label: 'Selo de Assinante no perfil', values: [false, true, true] },
    ],
  },
}