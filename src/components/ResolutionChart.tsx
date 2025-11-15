import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  name: string;
  resolved: number;
  open: number;
}

interface ResolutionChartProps {
  data: ChartData[];
}

const ResolutionChart = ({ data }: ResolutionChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tickets Abertos vs. Resolvidos (Últimos 7 Dias)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Bar dataKey="resolved" name="Resolvidos" fill="hsl(142.1 76.2% 36.3%)" /> {/* Green */}
            <Bar dataKey="open" name="Abertos" fill="hsl(217.2 91.2% 59.8%)" /> {/* Blue */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResolutionChart;