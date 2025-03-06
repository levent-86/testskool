import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../services/api';
import { ENDPOINTS } from '../constants/endpoints';
import { TokenRefresh } from '../services/TokenRefresh';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token: string) =>
    token === 'valid-access'
      ? { exp: Math.floor(Date.now() / 1000) + 300 }
      : token === 'expired-access'
        ? { exp: Math.floor(Date.now() / 1000) - 60 }
        : token === 'new-access'
          ? { exp: Math.floor(Date.now() / 1000) + 600 }
          : {}
  ),
}));

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('TokenRefresh', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Returns 0 and sets access to null if no tokens exist', async () => {
    const setAccess = vi.fn();
    const refreshTime = await TokenRefresh(setAccess);

    expect(refreshTime).toBe(0);
    expect(setAccess).toHaveBeenCalledWith(null);
    expect(api.post).not.toHaveBeenCalled();
  });

  it('Refreshes token when expired', async () => {
    localStorage.setItem('access', 'expired-access');
    localStorage.setItem('refresh', 'valid-refresh');

    vi.mocked(api.post).mockResolvedValueOnce({
      status: 200,
      data: { access: 'new-access', refresh: 'new-refresh' },
    });

    const setAccess = vi.fn();
    const refreshTime = await TokenRefresh(setAccess);

    expect(api.post).toHaveBeenCalledWith(ENDPOINTS.TOKEN, {
      refresh: 'valid-refresh',
    });
    expect(setAccess).toHaveBeenCalledWith('new-access');
    expect(localStorage.getItem('access')).toBe('new-access');
    expect(localStorage.getItem('refresh')).toBe('new-refresh');
    expect(refreshTime).toBeGreaterThan(0);
  });

  it('Does not refresh if token is valid', async () => {
    localStorage.setItem('access', 'valid-access');
    localStorage.setItem('refresh', 'valid-refresh');

    const setAccess = vi.fn();
    const refreshTime = await TokenRefresh(setAccess);

    expect(api.post).not.toHaveBeenCalled();
    expect(setAccess).not.toHaveBeenCalled();
    expect(refreshTime).toBeGreaterThan(0);
  });

  it('Sets access to null if refresh fails', async () => {
    localStorage.setItem('access', 'expired-access');
    localStorage.setItem('refresh', 'valid-refresh');

    vi.mocked(api.post).mockRejectedValueOnce(new Error('Refresh failed'));

    const setAccess = vi.fn();
    const refreshTime = await TokenRefresh(setAccess);

    expect(api.post).toHaveBeenCalledWith(ENDPOINTS.TOKEN, {
      refresh: 'valid-refresh',
    });
    expect(setAccess).toHaveBeenCalledWith(null);
    expect(refreshTime).toBe(0);
  });
});
