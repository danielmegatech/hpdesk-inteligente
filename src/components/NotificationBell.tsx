import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppNotification, apiGetNotifications, apiMarkNotificationAsRead, apiDeleteNotification } from '@/api';
import { cn } from '@/lib/utils'; // Importando 'cn'
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NotificationIcon = ({ type }: { type: AppNotification['type'] }) => {
  switch (type) {
    case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    default: return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setNotifications(apiGetNotifications());
  }, []);

  const handleMarkAsRead = (id: string) => {
    apiMarkNotificationAsRead(id);
    setNotifications(apiGetNotifications());
  };

  const handleDelete = (id: string) => {
    apiDeleteNotification(id);
    setNotifications(apiGetNotifications());
  };

  const handleNotificationClick = (notification: AppNotification) => {
    if (notification.link) {
      navigate(notification.link);
      handleMarkAsRead(notification.id); // Mark as read when clicked and navigated
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-semibold">Notificações</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => notifications.forEach(n => !n.read && handleMarkAsRead(n.id))}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Nenhuma notificação.</p>
          ) : (
            <div className="flex flex-col">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={cn("flex items-start gap-2 p-4 border-b", { "bg-accent/20": !notification.read }, { "cursor-pointer hover:bg-accent/40": notification.link })}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationIcon type={notification.type} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    {notification.description && <p className="text-xs text-muted-foreground">{notification.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;