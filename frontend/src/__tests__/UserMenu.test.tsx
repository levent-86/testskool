import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { UserDataProvider } from '../contexts/UserProvider';
import { AccessTokenProvider } from '../contexts/AccessProvider';
import * as hooks from '../hooks/useAccessToken';
import UserMenu from '../components/navbar/UserMenu';


const renderUserMenu = () => {
  return render(
    <MemoryRouter>
      <AccessTokenProvider>
        <UserDataProvider>
          <UserMenu />
        </UserDataProvider>
      </AccessTokenProvider>
    </MemoryRouter>
  );
};

describe('UserMenu Component:', () => {
  it('Should render button.', () => {
    renderUserMenu();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('Should render main elements when button is clicked.', async () => {
    renderUserMenu();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeTruthy();
      expect(screen.getByText('F.A.Q.')).toBeTruthy();
      expect(screen.getByText('Visit me on LinkedIn')).toBeTruthy();
      expect(screen.getByText('Logout')).toBeTruthy();
    });
  });

  it('Should route to the related routes.', async () => {
    renderUserMenu();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {

      // My profile
      const myProfileLink = screen.getByRole('link', { name: 'My Profile' });
      expect(myProfileLink.getAttribute('href')).toBe('/my-profile');

      // F.A.Q.
      const faqLink = screen.getByRole('link', { name: 'F.A.Q.' });
      expect(faqLink.getAttribute('href')).toBe('/faq');

      // Linkedin
      const linkedinLink = screen.getByRole('link', { name: 'Visit me on LinkedIn' });
      expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com/in/mustafaleventfidanci/');
    });
  });

  it('Should call setAccess with null when Logout is clicked.', async () => {
    const setAccessMock = vi.fn();
    vi.spyOn(hooks, 'useAccessToken').mockReturnValue({ access: 'some-token', setAccess: setAccessMock });

    renderUserMenu();
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('My Profile')).toBeTruthy();
    });
    await userEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(setAccessMock).toHaveBeenCalledWith(null);
    });

    setAccessMock.mockClear();
  });
});
