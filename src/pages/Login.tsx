import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao Helpdesk App</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                  },
                },
              },
            }}
            theme="dark" // Using dark theme for better contrast with the card background
            view="sign_in"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Palavra-passe',
                  button_label: 'Entrar',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entrar',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Palavra-passe',
                  button_label: 'Registar',
                  social_provider_text: 'Registar com {{provider}}',
                  link_text: 'Não tem uma conta? Registar',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Palavra-passe',
                  button_label: 'Enviar instruções de recuperação',
                  link_text: 'Esqueceu a palavra-passe?',
                },
                update_password: {
                  password_label: 'Nova Palavra-passe',
                  button_label: 'Atualizar Palavra-passe',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;