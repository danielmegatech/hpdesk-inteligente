import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const kbArticles = [
  {
    id: 'kb-1',
    question: 'Como configurar a impressora de rede?',
    answer: '1. Abra o Painel de Controle. 2. Vá em "Dispositivos e Impressoras". 3. Clique em "Adicionar uma impressora". 4. Selecione "A impressora que eu quero não está na lista" e siga as instruções para adicionar por endereço IP.',
  },
  {
    id: 'kb-2',
    question: 'Como acessar a VPN da empresa?',
    answer: 'Abra o cliente Cisco AnyConnect, digite o endereço vpn.suaempresa.com.br, e use seu usuário e senha de rede para conectar.',
  },
  {
    id: 'kb-3',
    question: 'O que fazer quando um software trava?',
    answer: 'Primeiro, tente fechar o programa pelo Gerenciador de Tarefas (Ctrl+Shift+Esc). Se o problema persistir após reabrir, reinicie o computador. Se ainda assim não funcionar, abra um ticket de suporte.',
  },
];

const KnowledgeBasePage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
        <p className="text-muted-foreground">Encontre soluções rápidas para problemas comuns.</p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {kbArticles.map(article => (
          <AccordionItem key={article.id} value={article.id}>
            <AccordionTrigger className="text-lg">{article.question}</AccordionTrigger>
            <AccordionContent className="text-base whitespace-pre-line">
              {article.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default KnowledgeBasePage;