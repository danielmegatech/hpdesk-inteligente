import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client'; // Removido o import real do supabase
import { Skeleton } from '@/components/ui/skeleton';

// Definir um utilizador e sessão mock
const MOCK_USER: User = {
  id: 'mock-user-id-123',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'tecnico@helpdesk.app',
  email_confirmed_at: '2023-01-01T00:00:00Z',
  phone: '',
  confirmed_at: '2023-01-01T00:00:00Z',
  last_sign_in_at: '2024-01-01T00:00:00Z',
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    first_name: 'Técnico',
    last_name: 'Exemplo',
  },
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  is_anonymous: false,
};

const MOCK_SESSION: Session = {
  access_token: 'mock-access-token',
  token_type: 'bearer', // Corrigido para 'bearer' (minúsculas)
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'mock-refresh-token',
  user: MOCK_USER,
};


interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};

interface SessionContextProviderProps {
  children: React.ReactNode;
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento da sessão
    const loadMockSession = () => {
      // Em vez de chamar supabase.auth.onAuthStateChange, definimos a sessão mock diretamente
      setSession(MOCK_SESSION);
      setUser(MOCK_USER);
      setIsLoading(false);
    };

    loadMockSession();
    // Não há necessidade de unsubscribe para um mock
  }, []);

  const value = { session, user, isLoading };

  if (isLoading) {
    // Simple loading screen while checking session
    return (
      <div className="flex flex-col space-y-3 p-8 min-h-screen">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};