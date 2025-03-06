import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { describe, expect, it } from 'vitest';
import { AccessTokenProvider } from '../contexts/AccessProvider';


const renderLogin = () => render(
  <MemoryRouter>
    <AccessTokenProvider>
      <Login />
    </AccessTokenProvider>
  </MemoryRouter>
);

describe('Login Page', () => {
  it('renders login page with correct elements', () => {
    renderLogin();

    expect(screen.getByRole('heading', { level: 5 }).textContent).toBe('Login');
    expect(screen.getByPlaceholderText('john-doe')).toBeTruthy();
    expect(screen.getByPlaceholderText('Min. 8 characters')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
    expect(screen.getByText('You don\'t have an account yet?')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Register instead' })).toBeTruthy();
  });

  it('does not render register-specific elements', () => {
    renderLogin();

    expect(screen.queryByPlaceholderText('Password Confirmation')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Register' })).toBeNull();
    expect(screen.queryByText('This website is for demonstration purposes only.')).toBeNull();
  });
});
