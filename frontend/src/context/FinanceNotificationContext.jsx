import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../utils/auth';
import { toast } from 'sonner';

const FinanceNotificationContext = createContext(null);

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const FinanceNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Fetch notifications via REST API
  const fetchNotifications = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/api/finance-events/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    const token = authService.getToken();
    if (!token || wsRef.current?.readyState === WebSocket.OPEN) return;

    // Convert HTTPS to WSS for WebSocket connection
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    const ws = new WebSocket(`${wsUrl}/api/finance-events/ws/${token}`);

    ws.onopen = () => {
      console.log('Finance WebSocket connected');
      setConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Finance WebSocket disconnected');
      setConnected(false);
      wsRef.current = null;

      // Attempt reconnection with backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        setTimeout(connectWebSocket, delay);
      }
    };

    wsRef.current = ws;

    // Setup ping/pong interval
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, []);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data) => {
    const { type, message, severity } = data;

    switch (type) {
      case 'connected':
        console.log('WebSocket connected:', message);
        break;
      case 'overdue_receivable':
        toast.error(message, { description: `₹${data.amount?.toLocaleString()} overdue by ${data.days_overdue} days` });
        addNotification(data);
        break;
      case 'payment_due':
        toast.warning(message, { description: `₹${data.amount?.toLocaleString()} due in ${data.days_to_due} days` });
        addNotification(data);
        break;
      case 'billing_approved':
        toast.success(message, { description: `₹${data.amount?.toLocaleString()} approved` });
        addNotification(data);
        break;
      case 'period_close_alert':
        toast.info(message, { description: `Period ${data.period} close in progress` });
        addNotification(data);
        break;
      case 'period_closed':
        toast.success(message);
        addNotification(data);
        break;
      default:
        if (severity === 'critical') {
          toast.error(message);
        } else if (severity === 'warning') {
          toast.warning(message);
        } else {
          toast.info(message);
        }
        addNotification(data);
    }
  };

  // Add a notification to the list
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep max 50
    setUnreadCount(prev => prev + 1);
  };

  // Mark all as read
  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  // Clear a specific notification
  const clearNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Initialize
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      fetchNotifications();
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchNotifications, connectWebSocket]);

  // Refresh notifications periodically
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60000); // Every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <FinanceNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        connected,
        fetchNotifications,
        markAllAsRead,
        clearNotification,
        addNotification
      }}
    >
      {children}
    </FinanceNotificationContext.Provider>
  );
};

export const useFinanceNotifications = () => {
  const context = useContext(FinanceNotificationContext);
  if (!context) {
    throw new Error('useFinanceNotifications must be used within FinanceNotificationProvider');
  }
  return context;
};

export default FinanceNotificationContext;
