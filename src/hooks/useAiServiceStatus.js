import { useEffect, useMemo, useState } from 'react';
import { serviceRuntimeConfig } from '../config/serviceRegistry';
import { checkAiServiceHealth } from '../services/aiService';

export const useAiServiceStatus = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let isCancelled = false;

    const updateStatus = async () => {
      const isOnline = await checkAiServiceHealth();
      if (isCancelled) return;
      setStatus(isOnline ? 'online' : 'offline');
    };

    updateStatus();

    const pollTimer = setInterval(
      updateStatus,
      serviceRuntimeConfig.healthPollIntervalMs,
    );

    return () => {
      isCancelled = true;
      clearInterval(pollTimer);
    };
  }, []);

  return useMemo(() => {
    if (status === 'online') {
      return {
        status,
        indicatorClass: 'bg-green-400 animate-pulse',
        label: 'Online',
      };
    }

    if (status === 'offline') {
      return {
        status,
        indicatorClass: 'bg-rose-400',
        label: 'Offline',
      };
    }

    return {
      status,
      indicatorClass: 'bg-amber-400 animate-pulse',
      label: 'Checking',
    };
  }, [status]);
};
