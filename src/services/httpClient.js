const withTimeout = (timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
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
    timeoutMs = 8000,
  } = {},
) => {
  const { controller, timeoutId } = withTimeout(timeoutMs);

  const token = localStorage.getItem('techhub_token');
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

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
  }
};
