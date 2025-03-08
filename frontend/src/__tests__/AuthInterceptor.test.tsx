/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import AuthInterceptor from '../components/AuthInterceptor';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { BaseURLS } from '../constants/base-urls';
import { ENDPOINTS } from '../constants/endpoints';
import api from '../services/api';
import { InternalAxiosRequestConfig } from 'axios';

// Mock useAccessToken
const mockSetAccess = vi.fn();
vi.mock('../hooks/useAccessToken', () => ({
  useAccessToken: () => ({
    setAccess: mockSetAccess,
  }),
}));

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock api
vi.mock('../services/api', () => {
  const mockApi = {
    interceptors: {
      request: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
  };
  return { default: mockApi };
});

describe('AuthInterceptor:', () => {
  let originalLocalStorage: Storage;

  beforeEach(() => {
    // Mock localStorage
    originalLocalStorage = window.localStorage;
    window.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } as unknown as Storage;

    // Reset mocks
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore original localStorage
    window.localStorage = originalLocalStorage;
  });

  it('Should do nothing if no access token exists.', async () => {
    // Arrange
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

    // Act
    render(<AuthInterceptor />);

    // Take interceptor function
    const interceptorFn = (api.interceptors.request.use as unknown as any).mock.calls[0][0];
    const config = { headers: {} } as InternalAxiosRequestConfig;
    await interceptorFn(config);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('access');
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('Should use existing token if not expired.', async () => {
    // Arrange
    const mockToken = 'valid-token';
    vi.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);
    vi.mocked(jwtDecode).mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 1000 });

    // Act
    render(<AuthInterceptor />);

    // Take interceptor function
    const interceptorFn = (api.interceptors.request.use as unknown as any).mock.calls[0][0];
    const config = { headers: {} } as InternalAxiosRequestConfig;
    await interceptorFn(config);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('access');
    expect(config.headers['Authorization']).toBe(`Bearer ${mockToken}`);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('Should refresh token if expired and update headers.', async () => {
    // Arrange
    const mockOldToken = 'expired-token';
    const mockRefresh = 'refresh-token';
    const mockNewAccessToken = 'new-access-token';
    const mockNewRefreshToken = 'new-refresh-token';
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(mockOldToken)
      .mockReturnValueOnce(mockRefresh);
    vi.mocked(jwtDecode).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 1000 });
    vi.mocked(axios.post).mockResolvedValue({
      data: { access: mockNewAccessToken, refresh: mockNewRefreshToken },
    });

    // Act
    render(<AuthInterceptor />);

    // Take interceptor function
    const interceptorFn = (api.interceptors.request.use as unknown as any).mock.calls[0][0];
    const config = { headers: {} } as InternalAxiosRequestConfig;
    await interceptorFn(config);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('access');
    expect(localStorage.getItem).toHaveBeenCalledWith('refresh');
    expect(axios.post).toHaveBeenCalledWith(
      `${BaseURLS.API}${ENDPOINTS.TOKEN}`,
      { refresh: mockRefresh }
    );
    expect(localStorage.setItem).toHaveBeenCalledWith('access', mockNewAccessToken);
    expect(localStorage.setItem).toHaveBeenCalledWith('refresh', mockNewRefreshToken);
    expect(mockSetAccess).toHaveBeenCalledWith(mockNewAccessToken);
    expect(config.headers['Authorization']).toBe(`Bearer ${mockNewAccessToken}`);
  });

  it('Should logout if refresh token is missing.', async () => {
    // Arrange
    const mockOldToken = 'expired-token';
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(mockOldToken)
      .mockReturnValueOnce(null);
    vi.mocked(jwtDecode).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 1000 });

    // Act
    render(<AuthInterceptor />);

    // Take interceptor function
    const interceptorFn = (api.interceptors.request.use as unknown as any).mock.calls[0][0];
    const config = { headers: {} } as InternalAxiosRequestConfig;
    await interceptorFn(config);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('access');
    expect(localStorage.getItem).toHaveBeenCalledWith('refresh');
    expect(localStorage.removeItem).toHaveBeenCalledWith('access');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refresh');
    expect(mockSetAccess).toHaveBeenCalledWith(null);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('Should logout if token refresh fails.', async () => {
    // Arrange
    const mockOldToken = 'expired-token';
    const mockRefresh = 'refresh-token';
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(mockOldToken)
      .mockReturnValueOnce(mockRefresh);
    vi.mocked(jwtDecode).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 1000 });
    vi.mocked(axios.post).mockRejectedValue(new Error('Refresh failed'));

    // Act
    render(<AuthInterceptor />);

    // Take interceptor function
    const interceptorFn = (api.interceptors.request.use as unknown as any).mock.calls[0][0];
    const config = { headers: {} } as InternalAxiosRequestConfig;
    await interceptorFn(config);

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      `${BaseURLS.API}${ENDPOINTS.TOKEN}`,
      { refresh: mockRefresh }
    );
    expect(localStorage.removeItem).toHaveBeenCalledWith('access');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refresh');
    expect(mockSetAccess).toHaveBeenCalledWith(null);
  });

  it('Should clean up interceptor on unmount.', () => {
    // Arrange
    const ejectSpy = vi.spyOn(api.interceptors.request, 'eject');

    // Act
    const { unmount } = render(<AuthInterceptor />);
    unmount();

    // Assert
    expect(ejectSpy).toHaveBeenCalled();
  });
});
