import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/components/ThemeProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/use-settings';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { settings, setSettings } = useSettings();
  const [selectedShift, setSelectedShift] = useState('custom');
  const [localSettings, setLocalSettings] = useState(settings);

  const shifts = {
    '1': { workStartTime: '07:00', workEndTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
    '2': { workStartTime: '09:00', workEndTime: '18:00', breakStartTime: '13:00', breakEndTime: '14:00' },
    '3': { workStartTime: '14:00', workEndTime: '22:00', breakStartTime: '20:00', breakEndTime: '21:00' },
  };

  useEffect(() => {
    setLocalSettings(settings);
    // Determine if current settings match a predefined shift
    const currentShiftKey = Object.keys(shifts).find(key => 
      shifts[key as keyof typeof shifts].workStartTime === settings.workStartTime &&
      shifts[key as keyof typeof shifts].workEndTime === settings.workEndTime &&
      shifts[key as keyof typeof shifts].breakStartTime === settings.breakStartTime &&
      shifts[key as keyof typeof shifts].breakEndTime === settings.breakEndTime
    );
    setSelectedShift(currentShiftKey || 'custom');
  }, [settings]);

  const handleShiftChange = (shiftKey: string) => {
    setSelectedShift(shiftKey);
    if (shiftKey in shifts) {
      setSettings(prev => ({ ...prev, ...shifts[shiftKey as keyof typeof shifts] }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
    setSelectedShift('custom');
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = () => {
    setSettings(prev => ({
      ...prev,
      name: localSettings.name,
      email: localSettings.email,
      phone: localSettings.phone,
      location: localSettings.location,
    }));
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center"><h1 className="text-3xl font-bold">Ajustes</h1><p className="text-muted-foreground">Personalize as configurações do aplicativo.</p></div>
      <Card>
        <CardHeader><CardTitle>Perfil</CardTitle><CardDescription>Atualize as suas informações de perfil.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" value={localSettings.name} onChange={handleProfileChange} /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={localSettings.email} onChange={handleProfileChange} /></div>
          <div className="space-y-2"><Label htmlFor="phone">Telefone</Label><Input id="phone" type="tel" value={localSettings.phone} onChange={handleProfileChange} /></div>
          <div className="space-y-2"><Label htmlFor="location">Local de Trabalho</Label><Input id="location" value={localSettings.location} onChange={handleProfileChange} /></div>
          <Button onClick={handleSaveProfile}>Guardar Alterações</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Meu Horário de Trabalho e Intervalo</CardTitle><CardDescription>Selecione um turno predefinido ou defina um horário personalizado.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedShift} onValueChange={handleShiftChange} className="mb-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="shift1" /><Label htmlFor="shift1">Turno 1 (07:00 - 17:00, Almoço 12:00-13:00)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="shift2" /><Label htmlFor="shift2">Turno 2 (09:00 - 18:00, Almoço 13:00-14:00)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="shift3" /><Label htmlFor="shift3">Turno 3 (14:00 - 22:00, Janta 20:00-21:00)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="custom" id="custom" /><Label htmlFor="custom">Personalizado</Label></div>
          </RadioGroup>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="space-y-2"><Label htmlFor="workStartTime">Início do Turno</Label><Input id="workStartTime" type="time" value={settings.workStartTime} onChange={handleTimeChange} /></div>
            <div className="space-y-2"><Label htmlFor="workEndTime">Fim do Turno</Label><Input id="workEndTime" type="time" value={settings.workEndTime} onChange={handleTimeChange} /></div>
            <div className="space-y-2"><Label htmlFor="breakStartTime">Início do Intervalo</Label><Input id="breakStartTime" type="time" value={settings.breakStartTime} onChange={handleTimeChange} /></div>
            <div className="space-y-2"><Label htmlFor="breakEndTime">Fim do Intervalo</Label><Input id="breakEndTime" type="time" value={settings.breakEndTime} onChange={handleTimeChange} /></div>
          </div>
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