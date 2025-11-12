import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/components/ThemeProvider';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full max-w-2xl mx-auto">
       <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Ajustes</h1>
        <p className="text-muted-foreground">Personalize as configurações do aplicativo.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Selecione o tema visual para a interface do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Claro (Light)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Escuro (Dark)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">Padrão do Sistema</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;