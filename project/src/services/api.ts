const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/';
        }
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error' };
    }
  }

  // Authentication endpoints
  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Voice processing endpoints
  async registerVoiceProfile(profileName: string, phrase: string, audioBlob: Blob) {
    const formData = new FormData();
    formData.append('profileName', profileName);
    formData.append('phrase', phrase);
    formData.append('audio', audioBlob, 'voice-sample.wav');

    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/voice/register`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || 'Voice registration failed' };
    }
    return { data };
  }

  async authenticateVoice(profileId: string, audioBlob: Blob) {
    const formData = new FormData();
    formData.append('profileId', profileId);
    formData.append('audio', audioBlob, 'voice-auth.wav');

    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/voice/authenticate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || 'Voice authentication failed' };
    }
    return { data };
  }

  async getVoiceProfiles() {
    return this.request('/voice/profiles');
  }

  async deleteVoiceProfile(profileId: string) {
    return this.request(`/voice/profiles/${profileId}`, {
      method: 'DELETE',
    });
  }

  async updateVoiceThresholds(profileId: string, livenessThreshold: number, confidenceThreshold: number) {
    return this.request(`/voice/profiles/${profileId}/thresholds`, {
      method: 'PATCH',
      body: JSON.stringify({ livenessThreshold, confidenceThreshold }),
    });
  }

  // User management endpoints
  async getUserStats() {
    return this.request('/users/stats');
  }

  async getAuthLogs(page = 1, limit = 20, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request(`/users/logs?${params}`);
  }

  async updateProfile(name?: string, email?: string) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name, email }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/users/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async generateApiKey(keyName: string, permissions: string[]) {
    return this.request('/users/api-keys', {
      method: 'POST',
      body: JSON.stringify({ keyName, permissions }),
    });
  }

  async getApiKeys() {
    return this.request('/users/api-keys');
  }

  async revokeApiKey(keyId: string) {
    return this.request(`/users/api-keys/${keyId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService(); 