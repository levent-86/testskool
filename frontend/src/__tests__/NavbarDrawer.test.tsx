import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccessTokenProvider } from '../contexts/AccessProvider';
import { UserDataProvider } from '../contexts/UserProvider';
import { NavbarDrawer } from '../components/navbar/NavbarDrawer';


interface DrawerProps {
  drawerOpen: boolean;
  token: null | string;
  is_teacher?: boolean;
};


describe('NavbarDrawer component tests:', () => {
  const setHandleClose = vi.fn();
  const setDrawerOpen = vi.fn();

  beforeEach(() => {
    setHandleClose.mockClear();
    setDrawerOpen.mockClear();
  });

  const renderDrawer = ({ drawerOpen, token, is_teacher }: DrawerProps) => render(
    <MemoryRouter>
      <AccessTokenProvider>
        <UserDataProvider>
          <NavbarDrawer
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            handleClose={setHandleClose}
            access={token}
            is_teacher={is_teacher}
          />
        </UserDataProvider>
      </AccessTokenProvider>
    </MemoryRouter>
  );


  const mainElements = ['Home', 'Teachers', 'Students', 'Login', 'Register', 'F.A.Q.', 'Visit me on LinkedIn'];
  const authElements = ['Login', 'Register'];


  it('Should render drawer and main elements visible when drawer is open.', () => {
    renderDrawer({ drawerOpen: true, token: null });

    mainElements.forEach(e => {
      expect(screen.getByText(e)).toBeTruthy();
    });
  });


  it('Should NOT render drawer and main elements when drawer is closed.', () => {
    renderDrawer({ drawerOpen: false, token: null });

    mainElements.forEach(e => {
      expect(screen.queryByText(e)).toBeNull();
    });
  });


  it('Should Render "Login" and "Register" when access token is NOT provided', () => {
    renderDrawer({ drawerOpen: true, token: null });

    authElements.forEach(e => {
      expect(screen.getByText(e)).toBeTruthy();
    });
  });


  it('Should NOT render "Login" and "Register" when access token is provided.', () => {
    renderDrawer({ drawerOpen: true, token: 'access-token' });

    authElements.forEach(e => {
      expect(screen.queryByText(e)).toBeNull();
    });
  });


  it('Should NOT render Create Quiz with access token alone.', () => {
    renderDrawer({ drawerOpen: true, token: 'access-token', is_teacher: false });

    expect(screen.queryByText('Create Quiz')).toBeNull();
  });


  it('Should render Create Quiz if user is a teacher.', () => {
    renderDrawer({ drawerOpen: true, token: 'access-token', is_teacher: true });

    expect(screen.getByText('Create Quiz')).toBeTruthy();
  });


  it('Should call handleClose function when any MenuItem is clicked.', () => {
    renderDrawer({ drawerOpen: true, token: null });

    // Home
    fireEvent.click(screen.getByText('Home'));
    expect(setHandleClose).toHaveBeenCalledTimes(1);

    // Teachers
    fireEvent.click(screen.getByText('Teachers'));
    expect(setHandleClose).toHaveBeenCalledTimes(2);

    // Students
    fireEvent.click(screen.getByText('Students'));
    expect(setHandleClose).toHaveBeenCalledTimes(3);

    // Login
    fireEvent.click(screen.getByText('Login'));
    expect(setHandleClose).toHaveBeenCalledTimes(4);

    // Register
    fireEvent.click(screen.getByText('Register'));
    expect(setHandleClose).toHaveBeenCalledTimes(5);

    // F.A.Q.
    fireEvent.click(screen.getByText('F.A.Q.'));
    expect(setHandleClose).toHaveBeenCalledTimes(6);

    // LinkedIn
    fireEvent.click(screen.getByText('Visit me on LinkedIn'));
    expect(setHandleClose).toHaveBeenCalledTimes(7);
  });


  describe('Drawer routing:', () => {
    it('Should route to main drawer element routes.', () => {
      renderDrawer({ drawerOpen: true, token: null });

      // Home link
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink.getAttribute('href')).toBe('/');

      // Teachers link
      const teachersLink = screen.getByRole('link', { name: 'Teachers' });
      expect(teachersLink.getAttribute('href')).toBe('/teachers');

      // Students link
      const studentsLink = screen.getByRole('link', { name: 'Students' });
      expect(studentsLink.getAttribute('href')).toBe('/students');

      // Login link
      const loginLink = screen.getByRole('link', { name: 'Login' });
      expect(loginLink.getAttribute('href')).toBe('/login');

      // Register link
      const registerLink = screen.getByRole('link', { name: 'Register' });
      expect(registerLink.getAttribute('href')).toBe('/register');

      // F.A.Q: link
      const faqLink = screen.getByRole('link', { name: 'F.A.Q.' });
      expect(faqLink.getAttribute('href')).toBe('/faq');

      // LinkedIn: link
      const linkedinLink = screen.getByRole('link', { name: 'Visit me on LinkedIn' });
      expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com/in/mustafaleventfidanci/');
    });


    it('Should route to Create Quiz when user is a teacher.', () => {
      renderDrawer({ drawerOpen: true, token: 'access-token', is_teacher: true });

      const createQuizLink = screen.getByRole('link', { name: 'Create Quiz' });
      expect(createQuizLink.getAttribute('href')).toBe('/create-quiz');
    });


    it('Should call handleClose function when Create Quiz is clicked when user is a teacher.', () => {
      renderDrawer({ drawerOpen: true, token: 'access-token', is_teacher: true });

      fireEvent.click(screen.getByText('Create Quiz'));
      expect(setHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});
