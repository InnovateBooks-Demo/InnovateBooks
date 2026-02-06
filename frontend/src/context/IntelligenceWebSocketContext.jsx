import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { authService } from '../utils/auth';

const IntelligenceWebSocketContext = createContext(null);

export const useIntelligenceWebSocket = () => {
  const context = useContext(IntelligenceWebSocketContext);
  if (!context) {
    throw new Error('useIntelligenceWebSocket must be used within IntelligenceWebSocketProvider');
  }
  return context;
};

export const IntelligenceWebSocketProvider = ({ children, orgId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [signals, setSignals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const token = authService.getToken();
    if (!token) return;

    // Convert http to ws protocol
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    const wsEndpoint = orgId 
      ? `${wsUrl}/api/intelligence/ws/${orgId}`
      : `${wsUrl}/api/intelligence/ws/admin/global`;

    try {
      wsRef.current = new WebSocket(wsEndpoint);

      wsRef.current.onopen = () => {
        console.log('Intelligence WebSocket connected');
        setIsConnected(true);
        // Send ping every 30 seconds to keep connection alive
        const pingInterval = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
        wsRef.current.pingInterval = pingInterval;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);

          // Handle different message types
          switch (data.type) {
            case 'SIGNAL_CREATED':
              setSignals(prev => [data.signal, ...prev].slice(0, 50));
              setNotifications(prev => [{
                id: Date.now(),
                type: 'signal',
                title: 'New Signal',
                message: data.signal.title,
                severity: data.signal.severity,
                timestamp: data.timestamp
              }, ...prev].slice(0, 20));
              break;
            case 'SIGNAL_ACKNOWLEDGED':
              setSignals(prev => prev.map(s => 
                s.signal_id === data.signal_id 
                  ? { ...s, acknowledged: true, acknowledged_by: data.acknowledged_by }
                  : s
              ));
              break;
            case 'RISK_CREATED':
              setNotifications(prev => [{
                id: Date.now(),
                type: 'risk',
                title: 'New Risk Identified',
                message: `Risk Score: ${data.risk_score}`,
                severity: data.risk_score >= 7 ? 'critical' : 'warning',
                timestamp: data.timestamp
              }, ...prev].slice(0, 20));
              break;
            case 'RECOMMENDATION_CREATED':
            case 'AUTO_RECOMMENDATION_CREATED':
              setNotifications(prev => [{
                id: Date.now(),
                type: 'recommendation',
                title: data.type === 'AUTO_RECOMMENDATION_CREATED' ? 'Auto-Generated Recommendation' : 'New Recommendation',
                message: `Priority: ${data.priority}`,
                severity: data.priority <= 2 ? 'critical' : 'info',
                timestamp: data.timestamp
              }, ...prev].slice(0, 20));
              break;
            case 'pong':
              // Keep-alive response
              break;
            default:
              console.log('Unknown WebSocket message type:', data.type);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      wsRef.current.onclose = () => {
        console.log('Intelligence WebSocket disconnected');
        setIsConnected(false);
        if (wsRef.current?.pingInterval) {
          clearInterval(wsRef.current.pingInterval);
        }
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setIsConnected(false);
    }
  }, [API_URL, orgId]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current?.pingInterval) {
      clearInterval(wsRef.current.pingInterval);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const value = {
    isConnected,
    lastMessage,
    signals,
    notifications,
    clearNotification,
    clearAllNotifications,
    reconnect: connect
  };

  return (
    <IntelligenceWebSocketContext.Provider value={value}>
      {children}
    </IntelligenceWebSocketContext.Provider>
  );
};

export default IntelligenceWebSocketProvider;
