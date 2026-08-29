import { serviceRegistry, serviceRuntimeConfig } from '../config/serviceRegistry';
import { pingEndpoint, requestJson } from './httpClient';

const joinUrl = (baseUrl, path) => {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
};

const withChatToken = (chatToken) =>
  (chatToken ? { 'X-AI-Chat-Token': chatToken } : {});

/** Dispute AI (FastAPI) health */
export const checkAiServiceHealth = async () => {
  const healthUrl = joinUrl(serviceRegistry.ai, '/health');
  return pingEndpoint(healthUrl, serviceRuntimeConfig.requestTimeoutMs);
};

/** Mia product recommend — Laravel AiController stub */
export const askAiAssistant = async (message, metadata = {}) => {
  const chatUrl = joinUrl(serviceRegistry.recommendAi, '/chat');
  return requestJson(chatUrl, {
    method: 'POST',
    body: {
      message,
      metadata,
    },
    timeoutMs: serviceRuntimeConfig.requestTimeoutMs,
  });
};

/** Dispute assistant — FastAPI /chat */
export const askDisputeAssistant = async ({
  userId,
  sessionId,
  message,
  chatToken,
}) => {
  const chatUrl = joinUrl(serviceRegistry.ai, '/chat');
  return requestJson(chatUrl, {
    method: 'POST',
    body: {
      user_id: userId,
      session_id: sessionId,
      message,
    },
    timeoutMs: Math.max(serviceRuntimeConfig.requestTimeoutMs, 60000),
    omitAuth: true,
    headers: withChatToken(chatToken),
  });
};

export const mintDisputeChatToken = async () => {
  const url = joinUrl(serviceRegistry.catalog, '/ai/chat-token');
  return requestJson(url, {
    method: 'POST',
    timeoutMs: serviceRuntimeConfig.requestTimeoutMs,
  });
};

export const listDisputeSessions = async ({ userId, chatToken }) => {
  const url = joinUrl(
    serviceRegistry.ai,
    `/chat_sessions?user_id=${encodeURIComponent(userId)}`,
  );
  return requestJson(url, {
    method: 'GET',
    omitAuth: true,
    headers: withChatToken(chatToken),
  });
};

export const createDisputeSession = async ({ userId, title, chatToken }) => {
  const url = joinUrl(serviceRegistry.ai, '/chat_sessions');
  return requestJson(url, {
    method: 'POST',
    body: { user_id: userId, title },
    omitAuth: true,
    headers: withChatToken(chatToken),
  });
};

export const fetchDisputeSessionTurns = async ({
  sessionId,
  userId,
  chatToken,
  limit = 50,
}) => {
  const url = joinUrl(
    serviceRegistry.ai,
    `/sessions/${encodeURIComponent(sessionId)}/turns?user_id=${encodeURIComponent(userId)}&limit=${limit}`,
  );
  return requestJson(url, {
    method: 'GET',
    omitAuth: true,
    headers: withChatToken(chatToken),
  });
};

/** LiveKit voice token — FastAPI POST /voice/token */
export const fetchVoiceToken = async ({ userId, room, name } = {}) => {
  const url = joinUrl(serviceRegistry.ai, '/voice/token');
  return requestJson(url, {
    method: 'POST',
    body: {
      user_id: userId ?? null,
      room: room ?? null,
      name: name ?? null,
    },
    timeoutMs: serviceRuntimeConfig.requestTimeoutMs,
    omitAuth: true,
  });
};

/** Optional FastAPI /config for admin multi-agent panel */
export const fetchAiConfig = async () => {
  const url = joinUrl(serviceRegistry.ai, '/config');
  return requestJson(url, {
    method: 'GET',
    omitAuth: true,
    timeoutMs: serviceRuntimeConfig.requestTimeoutMs,
  });
};

/** Optional FastAPI /ready readiness probes */
export const fetchAiReadiness = async () => {
  const url = joinUrl(serviceRegistry.ai, '/ready');
  return requestJson(url, {
    method: 'GET',
    omitAuth: true,
    timeoutMs: serviceRuntimeConfig.requestTimeoutMs,
  });
};
