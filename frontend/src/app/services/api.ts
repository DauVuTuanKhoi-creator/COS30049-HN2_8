// API Service Layer for FastAPI Backend Communication
// Configure your FastAPI backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  detail: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'secureguard_user';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorDetail = `HTTP error! status: ${response.status}`;

        try {
          const error: ApiError = await response.json();
          errorDetail = error.detail || errorDetail;
        } catch {
          // Non-JSON error responses still need a stable fallback message.
        }

        if (response.status === 401 || response.status === 403) {
          this.clearStoredAuth();
          throw new Error(`${errorDetail} Please sign in again.`);
        }

        throw new Error(errorDetail);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private setAuthToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  private clearStoredAuth(): void {
    this.removeAuthToken();
    localStorage.removeItem(AUTH_USER_KEY);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  // Authentication endpoints
  async signIn(email: string, password: string): Promise<{ 
    access_token: string; 
    token_type: string; 
    user: { id: string; email: string; name: string } 
  }> {
    const response = await this.request<{ 
      access_token: string; 
      token_type: string; 
      user: { id: string; email: string; name: string } 
    }>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setAuthToken(response.access_token);
    return response;
  }

  async signUp(name: string, email: string, password: string): Promise<{ 
    access_token: string; 
    token_type: string; 
    user: { id: string; email: string; name: string } 
  }> {
    const response = await this.request<{ 
      access_token: string; 
      token_type: string; 
      user: { id: string; email: string; name: string } 
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    this.setAuthToken(response.access_token);
    return response;
  }

  async getCurrentUser(): Promise<{ id: string; email: string; name: string }> {
    return this.request('/api/auth/me');
  }

  signOut(): void {
    this.clearStoredAuth();
  }

  // Detection endpoints
  async analyzeText(text: string): Promise<{
    isSpam: boolean;
    isMalware: boolean;
    confidence: number;
    threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    details: {
      suspiciousPatterns: string[];
      riskFactors: string[];
      safetyScore: number;
    };
  }> {
    return this.request('/api/detect/text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async analyzeFile(fileName: string, fileSize: number, fileType: string): Promise<{
    isSpam: boolean;
    isMalware: boolean;
    confidence: number;
    threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    details: {
      suspiciousPatterns: string[];
      riskFactors: string[];
      safetyScore: number;
    };
  }> {
    return this.request('/api/detect/file', {
      method: 'POST',
      body: JSON.stringify({ 
        file_name: fileName, 
        file_size: fileSize, 
        file_type: fileType 
      }),
    });
  }

  async uploadFileForScan(file: File): Promise<{
    isSpam: boolean;
    isMalware: boolean;
    confidence: number;
    threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    details: {
      suspiciousPatterns: string[];
      riskFactors: string[];
      safetyScore: number;
    };
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}/api/detect/file/upload`;
    const token = this.getAuthToken();

    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;

      try {
        const error: ApiError = await response.json();
        errorDetail = error.detail || errorDetail;
      } catch {
        // Non-JSON error responses still need a stable fallback message.
      }

      if (response.status === 401 || response.status === 403) {
        this.clearStoredAuth();
        throw new Error(`${errorDetail} Please sign in again.`);
      }

      throw new Error(errorDetail);
    }

    return await response.json();
  }

  async getScanHistory(): Promise<Array<{
    id: string;
    type: 'text' | 'file';
    timestamp: string;
    result: {
      isSpam: boolean;
      isMalware: boolean;
      confidence: number;
      threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
      reasons: string[];
      details: {
        suspiciousPatterns: string[];
        riskFactors: string[];
        safetyScore: number;
      };
    };
    preview: string;
  }>> {
    return this.request('/api/scans/history');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService(API_BASE_URL);
