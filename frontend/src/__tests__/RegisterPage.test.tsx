import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Register from '../pages/Register';
import { AccessTokenProvider } from '../contexts/AccessProvider';


const renderRegister = () => render(
  <MemoryRouter>
    <AccessTokenProvider>
      <Register />
    </AccessTokenProvider>
  </MemoryRouter>
);

describe('Register Page', () => {
  it('renders register page with correct elements', () => {
    renderRegister();

    expect(screen.getByRole('heading', { level: 5 }).textContent).toBe('Register');
    expect(screen.getByPlaceholderText('john-doe')).toBeTruthy();
    expect(screen.getByPlaceholderText('Min. 8 characters')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password Confirmation')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Register' })).toBeTruthy();
    expect(screen.getByText('This website is for demonstration purposes only.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Login instead' })).toBeTruthy();
  });

  it('does not render login-specific elements', () => {
    renderRegister();

    expect(screen.queryByRole('button', { name: 'Login' })).toBeNull();
    expect(screen.queryByText('You don\'t have an account yet?')).toBeNull();
  });
});
