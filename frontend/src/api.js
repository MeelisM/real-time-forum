const apiBaseUrl = 'http://localhost:8080/api';

export async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const responseText = await response.text();
    if (!response.ok) {
        throw new Error(responseText || 'Request failed');
    }

    return JSON.parse(responseText);
}
