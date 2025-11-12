import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const SettingsPage = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Ajustes e Preferências</CardTitle>
          <CardDescription>
            Personalize a interface e outras configurações do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;