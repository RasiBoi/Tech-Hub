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

export const requestJson = async (
  url,
  {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = 15000,
    signal,
    omitAuth = false,
  } = {},
) => {
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
    
    // Automatically unwrap standard enterprise API envelope
    if (json && typeof json === 'object' && json.success === true && 'data' in json) {
      return json.data;
    }

    return json;
  } finally {
    clearTimeout(timeoutId);
    cleanup();
  }
};
