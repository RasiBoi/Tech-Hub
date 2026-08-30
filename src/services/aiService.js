import { serviceRegistry, serviceRuntimeConfig } from '../config/serviceRegistry';
import { pingEndpoint, requestJson } from './httpClient';

const joinUrl = (baseUrl, path) => {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
};

const withChatToken = (chatToken) =>
  (chatToken ? { 'X-AI-Chat-Token': chatToken } : {});

const isChatTokenRejected = (error) => {
  const status = error?.status;
  const message = String(error?.message || '');
  return (
    status === 401 ||
    /invalid chat token|unauthorized/i.test(message)
  );
};

const shouldAttachChatToken = () =>
  String(import.meta.env.VITE_AI_SEND_CHAT_TOKEN || '').toLowerCase() === 'true';

/**
 * FastAPI validates X-AI-Chat-Token against AI_CHAT_TOKEN_SECRET.
 * A token minted by local Laravel with a different secret is rejected as 401,
 * while the same route succeeds with no header. Only attach the header when
 * VITE_AI_SEND_CHAT_TOKEN=true (secrets aligned). On 401, retry without it.
 */
const requestAiJson = async (url, { chatToken, ...options } = {}) => {
  const tokenToSend = shouldAttachChatToken() ? chatToken : undefined;
  try {
    return await requestJson(url, {
      ...options,
      omitAuth: true,
      headers: {
        ...withChatToken(tokenToSend),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    if (tokenToSend && isChatTokenRejected(error)) {
      return requestJson(url, {
        ...options,
        omitAuth: true,
      });
    }
    throw error;
  }
};

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
  return requestAiJson(chatUrl, {
    method: 'POST',
    body: {
      user_id: userId,
      session_id: sessionId,
      message,
    },
    timeoutMs: Math.max(serviceRuntimeConfig.requestTimeoutMs, 60000),
    chatToken,
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
  return requestAiJson(url, {
    method: 'GET',
    chatToken,
  });
};

export const createDisputeSession = async ({ userId, title, chatToken }) => {
  const url = joinUrl(serviceRegistry.ai, '/chat_sessions');
  return requestAiJson(url, {
    method: 'POST',
    body: { user_id: userId, title },
    chatToken,
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
  return requestAiJson(url, {
    method: 'GET',
    chatToken,
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
