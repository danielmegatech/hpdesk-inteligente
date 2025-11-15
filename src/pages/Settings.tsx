import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/components/ThemeProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/use-settings';

const shiftSettings = {
  '1': { workStartTime: '07:00', workEndTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
  '2': { workStartTime: '09:00', workEndTime: '18:00', breakStartTime: '13:00', breakEndTime: '14:00' },
  '3': { workStartTime: '14:00', workEndTime: '22:00', breakStartTime: '20:00', breakEndTime: '21:00' },
};

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { settings, setSettings } = useSettings();

  const handleShiftChange = (value: '1' | '2' | '3') => {
    setSettings({
      ...settings,
      workShift: value,
      ...shiftSettings[value],
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center"><h1 className="text-3xl font-bold">Ajustes</h1><p className="text-muted-foreground">Personalize as configurações do aplicativo.</p></div>
      <Card>
        <CardHeader><CardTitle>Perfil</CardTitle><CardDescription>Atualize as suas informações de perfil.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" defaultValue="Técnico Exemplo" /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="tecnico@helpdesk.app" /></div>
          <Button>Guardar Alterações</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Turno de Trabalho</CardTitle><CardDescription>Selecione o seu turno para notificações e agendamentos inteligentes.</CardDescription></CardHeader>
        <CardContent>
          <RadioGroup value={settings.workShift} onValueChange={(value) => handleShiftChange(value as '1' | '2' | '3')}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="shift1" /><Label htmlFor="shift1">Turno 1 (07:00 - 17:00, Almoço: 12:00-13:00)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="shift2" /><Label htmlFor="shift2">Turno 2 (09:00 - 18:00, Almoço: 13:00-14:00)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="shift3" /><Label htmlFor="shift3">Turno 3 (14:00 - 22:00, Janta: 20:00-21:00)</Label></div>
          </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Horário Detalhado</CardTitle><CardDescription>Horário definido pelo turno selecionado.</CardDescription></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2"><Label htmlFor="workStartTime">Início do Turno</Label><Input id="workStartTime" type="time" value={settings.workStartTime} readOnly /></div>
          <div className="space-y-2"><Label htmlFor="workEndTime">Fim do Turno</Label><Input id="workEndTime" type="time" value={settings.workEndTime} readOnly /></div>
          <div className="space-y-2"><Label htmlFor="breakStartTime">Início do Intervalo</Label><Input id="breakStartTime" type="time" value={settings.breakStartTime} readOnly /></div>
          <div className="space-y-2"><Label htmlFor="breakEndTime">Fim do Intervalo</Label><Input id="breakEndTime" type="time" value={settings.breakEndTime} readOnly /></div>
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
        <CardHeader><CardTitle>Notificações</CardTitle><CardDescription>Gerencie como recebe notificações.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="new-task">Novas tarefas atribuídas</Label><Switch id="new-task" defaultChecked /></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="task-deadline">Prazos de tarefas a aproximar</Label><Switch id="task-deadline" defaultChecked /></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="massive-alert">Alertas de problemas massivos</Label><Switch id="massive-alert" /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;