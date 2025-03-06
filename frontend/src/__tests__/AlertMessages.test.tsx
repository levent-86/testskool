import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { act } from 'react';
import api from '../services/api';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { AlertMessages } from '../components/AlertMessages';
import { ENDPOINTS } from '../constants/endpoints';
import { BaseURLS } from '../constants/base-urls';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AlertMessages Component', () => {
  it('shows success message from Axios response', async () => {
    server.use(
      http.post(BaseURLS.API + ENDPOINTS.LOGIN, () => {
        return HttpResponse.json({ message: 'Operation successful' }, { status: 200 });
      })
    );

    render(<AlertMessages />);

    await act(async () => {
      await api.post(BaseURLS.API + ENDPOINTS.LOGIN, {});
    });

    await waitFor(() => {
      expect(screen.getByText('Operation successful')).toBeTruthy();
      expect(screen.getByRole('alert').classList.contains('MuiAlert-colorSuccess')).toBe(true);
    });
  });

  it('shows error message on network failure', async () => {
    server.use(
      http.post(BaseURLS.API + ENDPOINTS.LOGIN, () => {
        return HttpResponse.error();
      })
    );

    render(<AlertMessages />);

    await act(async () => {
      await api.post(BaseURLS.API + ENDPOINTS.LOGIN, {}).catch(() => { });
    });

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch: Network Error')).toBeTruthy();
      expect(screen.getByRole('alert').classList.contains('MuiAlert-colorError')).toBe(true);
    });
  });

  it('shows throttling message on 429 response', async () => {
    server.use(
      http.post(BaseURLS.API + ENDPOINTS.LOGIN, () => {
        return new HttpResponse(null, { status: 429, statusText: 'Too Many Requests' });
      })
    );

    render(<AlertMessages />);

    await act(async () => {
      await api.post(BaseURLS.API + ENDPOINTS.LOGIN, {}).catch(() => { });
    });

    await waitFor(() => {
      expect(screen.getByText('Too Many Requests')).toBeTruthy();
      expect(screen.getByRole('alert').classList.contains('MuiAlert-colorError')).toBe(true);
    });
  });
});
