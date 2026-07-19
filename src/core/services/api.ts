const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }

  const result = await response.json();
  // Standard envelope wrapper unpack
  return result.success ? result.data : result;
}

export function logout() {
  localStorage.removeItem('token');
  window.location.reload();
}
