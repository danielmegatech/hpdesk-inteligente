import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/components/ThemeProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Ajustes</h1>
        <p className="text-muted-foreground">Personalize as configurações do aplicativo.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Perfil</CardTitle><CardDescription>Atualize suas informações de perfil.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" defaultValue="Técnico Exemplo" /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="tecnico@helpdesk.app" /></div>
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Aparência</CardTitle><CardDescription>Selecione o tema visual para a interface.</CardDescription></CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="light" id="light" /><Label htmlFor="light">Claro</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="dark" id="dark" /><Label htmlFor="dark">Escuro</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="system" id="system" /><Label htmlFor="system">Padrão do Sistema</Label></div>
          </RadioGroup>
        </CardContent>
      </Card>
       <Card>
        <CardHeader><CardTitle>Notificações</CardTitle><CardDescription>Gerencie como você recebe notificações.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="new-task">Novas tarefas atribuídas</Label><Switch id="new-task" defaultChecked /></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="task-deadline">Prazos de tarefas se aproximando</Label><Switch id="task-deadline" defaultChecked /></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="massive-alert">Alertas de problemas massivos</Label><Switch id="massive-alert" /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;