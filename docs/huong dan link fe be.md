Tôi sẽ kiểm tra tài liệu Authentication Module và sau đó hướng dẫn chi tiết cách kết hợp backend với frontend.

Read file: docs/Authentication Module document maintain

Read file: docs/Authentication Module document maintain.md
Dựa vào tài liệu, tôi sẽ hướng dẫn chi tiết cách kết hợp backend với frontend. 

# Hướng dẫn Tích hợp Backend với Frontend

## 1. Cấu hình Môi trường

### 1.1 Backend Configuration (application.properties)
```properties
# CORS Configuration
spring.cors.allowed-origins=http://localhost:3000
spring.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.cors.allowed-headers=*
spring.cors.allow-credentials=true

# JWT Configuration
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# Server Configuration
server.port=8080
```

### 1.2 Frontend Configuration (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_JWT_COOKIE_NAME=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken
```

## 2. Cài đặt Dependencies

### 2.1 Frontend Dependencies
```bash
npm install axios jwt-decode @tanstack/react-query js-cookie
```

## 3. Thiết lập API Client

### 3.1 Tạo API Client (frontend/src/lib/api.ts)
```typescript
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await api.post('/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        Cookies.set('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (error) {
        // Refresh token expired or invalid
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

## 4. Thiết lập Authentication Context

### 4.1 Tạo Auth Context (frontend/src/contexts/AuthContext.tsx)
```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/api';

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);

      const decoded = jwtDecode(accessToken);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 5. Tạo Authentication Middleware

### 5.1 Middleware Configuration (frontend/src/middleware.ts)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  if (!accessToken && !isAuthPage && !isApiRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## 6. Tích hợp trong Components

### 6.1 Login Component (frontend/src/app/auth/login/page.tsx)
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
```

### 6.2 Protected Component Example
```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome {user?.username}</p>
    </div>
  );
}
```

## 7. Sử dụng API trong Components

### 7.1 Example API Call
```typescript
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data } = await api.get('/api/students');
      return data;
    },
  });
}
```

## 8. Xử lý Lỗi

### 8.1 Global Error Handler
```typescript
// frontend/src/utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 401:
        // Unauthorized - handled by axios interceptor
        break;
      case 403:
        // Forbidden
        window.location.href = '/forbidden';
        break;
      case 404:
        // Not found
        window.location.href = '/not-found';
        break;
      default:
        // Other errors
        console.error('API Error:', error.response.data);
    }
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.request);
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
};
```

## 9. Testing

### 9.1 API Integration Test
```typescript
// frontend/__tests__/api.test.ts
import api from '@/lib/api';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Client', () => {
  it('should handle successful login', async () => {
    const response = await api.post('/api/auth/login', {
      username: 'test',
      password: 'test',
    });

    expect(response.data).toHaveProperty('accessToken');
    expect(response.data).toHaveProperty('refreshToken');
  });
});
```

## 10. Deployment Considerations

1. Đảm bảo CORS configuration phù hợp với domain production
2. Sử dụng biến môi trường cho các URL và configuration
3. Implement rate limiting
4. Sử dụng HTTPS
5. Cấu hình cookie secure và httpOnly trong production

Bạn cần triển khai theo thứ tự sau:

1. Cấu hình backend theo hướng dẫn
2. Cài đặt dependencies frontend
3. Thiết lập API client và authentication context
4. Implement các components authentication
5. Test tích hợp
6. Deploy và cấu hình production

Bạn cần hỗ trợ thêm về phần nào cụ thể không?
