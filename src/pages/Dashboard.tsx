import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to the Helpdesk</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          You are logged in as: <strong>{user?.email}</strong>
        </p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Dashboard;