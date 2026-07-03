const withTimeout = (timeoutMs, externalSignal) => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException('Request timed out', 'TimeoutError'));
  }, timeoutMs);

  const abortFromExternalSignal = () => {
    controller.abort(externalSignal?.reason || new DOMException('Request aborted', 'AbortError'));
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      abortFromExternalSignal();
    } else {
      externalSignal.addEventListener('abort', abortFromExternalSignal, { once: true });
    }
  }

  return {
    controller,
    timeoutId,
    cleanup: () => {
      if (externalSignal) {
        externalSignal.removeEventListener('abort', abortFromExternalSignal);
      }
    },
  };
};

export const isRequestAbortError = (error) => {
  if (!error) return false;
  const name = error.name || '';
  const message = error.message || '';

  return (
    name === 'AbortError' ||
    name === 'TimeoutError' ||
    message.includes('aborted') ||
    message.includes('timed out')
  );
};

export const pingEndpoint = async (url, timeoutMs = 4000) => {
  const { controller, timeoutId } = withTimeout(timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Active concurrent requests (Map of URL -> Promise)
const activeRequests = new Map();

// Resolved requests cache (Map of URL -> { data, expiresAt })
const responseCache = new Map();
const CACHE_TTL = 60_000; // 60 seconds — aligns with the backend products/categories server-side cache window

export const requestJson = async (
  url,
  {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = 40000,
    signal,
    omitAuth = false,
  } = {},
) => {
  const isGet = method.toUpperCase() === 'GET';

  // 1. If not a GET request, invalidate the cache immediately since backend state is changing
  if (!isGet) {
    responseCache.clear();
  }

  // 2. Check if we have a valid cached response (only for GET)
  if (isGet) {
    const cached = responseCache.get(url);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // 3. Check if there is an active concurrent request for this URL
    if (activeRequests.has(url)) {
      return activeRequests.get(url);
    }
  }

  // 4. Execute the network request
  const fetchPromise = (async () => {
    const { controller, timeoutId, cleanup } = withTimeout(timeoutMs, signal);
    const token = localStorage.getItem('techhub_token');
    const authHeaders = !omitAuth && token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      let response;

      try {
        response = await fetch(url, {
          method,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeaders,
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });
      } catch (error) {
        if (isRequestAbortError(error)) {
          const isTimeout = error.name === 'TimeoutError' || controller.signal.reason?.name === 'TimeoutError';
          const abortError = new Error(isTimeout ? 'Request timed out' : 'Request aborted');
          abortError.name = isTimeout ? 'TimeoutError' : 'AbortError';
          abortError.isAbort = true;
          abortError.isTimeout = isTimeout;
          throw abortError;
        }

        throw error;
      }

      if (!response.ok) {
        try {
          const errorJson = await response.json();
          if (errorJson && errorJson.message) {
            throw new Error(errorJson.message);
          }
        } catch (e) {
          if (e.message && !e.message.startsWith('Request failed')) {
            throw e;
          }
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      const json = await response.json();
      let result = json;

      // Automatically unwrap standard enterprise API envelope
      if (json && typeof json === 'object' && json.success === true && 'data' in json) {
        result = json.data;
      }

      // Save to cache for GET requests
      if (isGet) {
        responseCache.set(url, {
          data: result,
          expiresAt: Date.now() + CACHE_TTL
        });
      }

      return result;
    } finally {
      clearTimeout(timeoutId);
      cleanup();
      // Remove from active concurrent requests
      if (isGet) {
        activeRequests.delete(url);
      }
    }
  })();

  if (isGet) {
    activeRequests.set(url, fetchPromise);
  }

  return fetchPromise;
};
