import { serviceRegistry, serviceRuntimeConfig } from '../config/serviceRegistry';
import { pingEndpoint, requestJson } from './httpClient';

const joinUrl = (baseUrl, path) => {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
};

export const checkAiServiceHealth = async () => {
  const healthUrl = joinUrl(serviceRegistry.ai, '/health');
  return pingEndpoint(healthUrl, serviceRuntimeConfig.requestTimeoutMs);
};

export const askAiAssistant = async (message, metadata = {}) => {
  const chatUrl = joinUrl(serviceRegistry.ai, '/chat');
  return requestJson(chatUrl, {
    method: 'POST',
    body: {
      message,
      metadata,
    },
    timeoutMs: serviceRuntimeConfig.requestTimeoutMs,
  });
};

export const askDisputeAssistant = async ({ userId, sessionId, message }) => {
  const chatUrl = joinUrl(serviceRegistry.ai, '/chat');
  return requestJson(chatUrl, {
    method: 'POST',
    body: {
      user_id: userId,
      session_id: sessionId,
      message,
    },
    timeoutMs: serviceRuntimeConfig.requestTimeoutMs,
    omitAuth: true,
  });
};
