import { useEffect, useRef, useState } from 'react';
import {
  fetchAiConfig,
  fetchAiHealth,
  fetchAiReadiness,
} from '../services/aiService';
import { serviceRuntimeConfig } from '../config/serviceRegistry';

/**
 * Poll AI-Agent /health (incl. Neo4j ping), /config once, /ready on status change.
 * Mirrors AI-Agent/ui useHealth for Tech-Hub dispute + admin surfaces.
 */
export function useAiHealth(intervalMs = serviceRuntimeConfig.healthPollIntervalMs) {
  const [health, setHealth] = useState({
    online: false,
    status: 'unknown',
    neo4j: null,
  });
  const [readiness, setReadiness] = useState(null);
  const [config, setConfig] = useState(null);
  const lastStatus = useRef('');

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const poll = async () => {
      if (document.hidden) return;
      try {
        const snapshot = await fetchAiHealth();
        if (!cancelled) setHealth(snapshot);
      } catch {
        if (!cancelled) {
          setHealth({ online: false, status: 'offline', neo4j: null });
        }
      }
    };

    const start = () => {
      if (timer != null) return;
      void poll();
      timer = window.setInterval(poll, intervalMs);
    };

    const stop = () => {
      if (timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs]);

  useEffect(() => {
    fetchAiConfig().then(setConfig).catch(() => {});
  }, []);

  useEffect(() => {
    const { status } = health;
    if (status === 'unknown' || status === lastStatus.current) return;
    lastStatus.current = status;
    fetchAiReadiness().then(setReadiness).catch(() => {});
  }, [health.status]);

  return { health, readiness, config };
}
