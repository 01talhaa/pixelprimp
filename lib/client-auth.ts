/**
 * Client authentication utility
 * Handles automatic token refresh when access token expires
 */

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    // Try the request with the current access token
    let response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies
    })

    // If we get a 401, the access token might be expired
    if (response.status === 401) {
      // Attempt to refresh the token
      const refreshed = await refreshAccessToken()
      
      if (refreshed) {
        // Retry the original request with the new token
        response = await fetch(url, {
          ...options,
          credentials: 'include',
        })
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/client/login'
        throw new Error('Session expired')
      }
    }

    return response
  } catch (error) {
    console.error('Fetch with auth error:', error)
    throw error
  }
}

async function refreshAccessToken(): Promise<boolean> {
  // If already refreshing, wait for that to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/auth/client/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        console.log('Token refreshed successfully')
        return true
      } else {
        console.error('Token refresh failed')
        return false
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Check if the user is authenticated
 */
export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetchWithAuth('/api/auth/client/me')
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Get current client data
 */
export async function getCurrentClient() {
  try {
    const response = await fetchWithAuth('/api/auth/client/me')
    if (response.ok) {
      const data = await response.json()
      return data.client
    }
    return null
  } catch (error) {
    console.error('Error getting current client:', error)
    return null
  }
}

/**
 * Setup automatic token refresh before expiration
 * Refresh 1 minute before the access token expires (14 minutes)
 */
export function setupAutoRefresh() {
  // Refresh every 14 minutes (1 minute before token expires)
  const refreshInterval = 14 * 60 * 1000 // 14 minutes in milliseconds
  
  const intervalId = setInterval(async () => {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      clearInterval(intervalId)
      window.location.href = '/client/login'
    }
  }, refreshInterval)

  // Cleanup function
  return () => clearInterval(intervalId)
}
