/**
 * Netlify-compatible API utility
 * 
 * This utility helps make API calls work in both development and production (Netlify)
 * environments without code changes.
 */

// Function to determine if we're running in a Netlify environment
export const isNetlify = (): boolean => {
  return window.location.hostname.includes('netlify.app') || 
         process.env.NODE_ENV === 'production';
};

// Returns the appropriate API base URL
export const getApiBaseUrl = (): string => {
  return isNetlify() ? '/.netlify/functions/api' : '/api';
};

// Creates a full API URL from a path
export const getApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}/${cleanPath}`;
};

// Generic fetch function that works in both environments
export const fetchApi = async <T>(
  path: string, 
  options?: RequestInit
): Promise<T> => {
  const url = getApiUrl(path);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }
  
  return response.json();
};

// Utility functions for common request types
export const apiGet = <T>(path: string): Promise<T> => {
  return fetchApi<T>(path, { method: 'GET' });
};

export const apiPost = <T>(path: string, data: any): Promise<T> => {
  return fetchApi<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const apiPut = <T>(path: string, data: any): Promise<T> => {
  return fetchApi<T>(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const apiDelete = <T>(path: string): Promise<T> => {
  return fetchApi<T>(path, { method: 'DELETE' });
};

export default {
  getApiBaseUrl,
  getApiUrl,
  fetchApi,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};