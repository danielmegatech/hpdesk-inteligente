import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecentTicket {
  id: string;
  title: string;
  requester: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'Aberto' | 'Em Progresso' | 'Resolvido';
}

interface RecentTicketsProps {
  tickets: RecentTicket[];
}

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return 'destructive';
    case 'Média':
      return 'secondary';
    case 'Baixa':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Aberto':
      return 'outline';
    case 'Em Progresso':
      return 'secondary';
    case 'Resolvido':
      return 'default';
    default:
      return 'outline';
  }
};

const RecentTickets = ({ tickets }: RecentTicketsProps) => {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Tickets Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium leading-none">{ticket.id} - {ticket.title}</p>
                <p className="text-sm text-muted-foreground">{ticket.requester}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTickets;