import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, afterEach, beforeEach, vi } from 'vitest';
import { Navbar } from '../components/Navbar';
import { NavbarDrawer } from '../components/navbar/NavbarDrawer';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


// Clean local storage after each
afterEach(() => {
  localStorage.clear();
});

/* VISIBILITY TESTS */

it('Visibility - Should render Navbar and visible main elements.', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText('TestSkool')).toBeTruthy();
  expect(screen.getByText('Home')).toBeTruthy();
  expect(screen.getByText('Teachers')).toBeTruthy();
  expect(screen.getByText('Students')).toBeTruthy();
  expect(screen.getByText('Login/Register')).toBeTruthy();
});


it('Visibility - Should render Login/Register elements when clicked.', async () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const user = userEvent.setup();

  const loginRegisterButton = screen.getByText('Login/Register');
  await user.click(loginRegisterButton);
  expect(screen.getByRole('link', { name: 'Login' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Register' })).toBeTruthy();
});


it('Visibility - Should render Profile button and Create Quiz button when access token provided.', () => {
  localStorage.setItem('access', 'some-access-token'); // access token provided
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText('Create Quiz')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Your Account' })).toBeTruthy();
});


it('Visibility - Should render Profile button elements when access token provided.', async () => {
  localStorage.setItem('access', 'some-access-token'); // access token provided
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const user = userEvent.setup();

  const profileButton = screen.getByRole('button', { name: 'Your Account' });
  await user.click(profileButton);
  expect(screen.getByRole('link', { name: 'My Profile' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'F.A.Q.' })).toBeTruthy();
  expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeTruthy();
});


it('Visibility - Should NOT render Login/Register when access token provided.', async () => {
  localStorage.setItem('access', 'some-access-token'); // access token provided
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.queryByText('Login/Register')).toBeNull();
});


it('Visibility - Should NOT render Profile button and Create Quiz button when access token is not provided.', async () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.queryByRole('button', { name: 'Your Account' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Create Quiz' })).toBeNull();
});


/* ROUTE TESTS */

it('Routing - Should route to the related routes of the main elements of navbar.', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  // Logo link
  fireEvent.click(screen.getByRole('link', { name: 'TestSkool' }));
  expect(window.location.pathname).toBe('/');

  // Home link
  const homeLink = screen.getByRole('link', { name: 'Home' });
  fireEvent.click(homeLink);
  expect(window.location.pathname).toBe('/');

  // Teachers link
  fireEvent.click(screen.getByRole('link', { name: 'Teachers' }));
  expect(window.location.pathname).toBe('/teachers');

  // Students link
  fireEvent.click(screen.getByRole('link', { name: 'Students' }));
  expect(window.location.pathname).toBe('/students');
});


it('Routing - Should route to the related routes when clicked to the Login/Register button elements.', async () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Login
  const loginRegisterDropdown = screen.getByRole('button', { name: 'Login/Register' });
  user.click(loginRegisterDropdown);
  await waitFor(() => {
    const loginLink = screen.getByRole('link', { name: 'Login' });
    user.click(loginLink);
    expect(window.location.pathname).toBe('/login');
  });

  // Register
  user.click(loginRegisterDropdown);
  const registerLink = await screen.findByRole('link', { name: 'Register' });
  await user.click(registerLink);
  expect(window.location.pathname).toBe('/register');

  // F.A.Q.
  user.click(loginRegisterDropdown);
  const faq = await screen.findByRole('link', { name: 'F.A.Q.' });
  await user.click(faq);
  expect(window.location.pathname).toBe('/faq');
});


it('Routing - Should route to the related routes when clicked to the Profile button elements.', async () => {
  localStorage.setItem('access', 'some-access-token'); // access token provided

  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // My Profile
  const userDropdown = screen.getByRole('button', { name: 'Your Account' });

  await waitFor(() => {
    user.click(userDropdown);
    const myProfileLink = screen.getByRole('link', { name: 'My Profile' });
    user.click(myProfileLink);
    expect(window.location.pathname).toBe('/my-profile');
  });

  // F.A.Q
  user.click(userDropdown);
  const faqLink = screen.getByRole('link', { name: 'F.A.Q.' });
  user.click(faqLink);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/faq');
  });
});


it('Routing - Should route to the related route when Create Quiz button is clicked.', () => {
  localStorage.setItem('access', 'some-access-token'); // access token provided

  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('link', { name: 'Create Quiz' }));
  expect(window.location.pathname).toBe('/create-quiz');
});


// RESPONSIVE TESTS

const setHandleClose = vi.fn();
const setDrawerOpen = vi.fn();

beforeEach(() => {
  setHandleClose.mockClear();
  setDrawerOpen.mockClear();
});


it('Responsive - Should call handleClose function when a MenuItem is clicked.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access={null}
    />
  );

  // Home
  fireEvent.click(screen.getByText('Home'));
  expect(setHandleClose).toHaveBeenCalledTimes(1);

  // Teachers
  fireEvent.click(screen.getByText('Teachers'));
  expect(setHandleClose).toHaveBeenCalledTimes(2);

  // Students
  fireEvent.click(screen.getByText('Students'));
  expect(setHandleClose).toHaveBeenCalledTimes(3);

  // F.A.Q.
  fireEvent.click(screen.getByText('F.A.Q.'));
  expect(setHandleClose).toHaveBeenCalledTimes(4);

  // Login
  fireEvent.click(screen.getByText('Login'));
  expect(setHandleClose).toHaveBeenCalledTimes(5);

  // Register
  fireEvent.click(screen.getByText('Register'));
  expect(setHandleClose).toHaveBeenCalledTimes(6);
});


it('Responsive - Should call handleClose function when Create Quiz is clicked after access token provided.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access='some-access-token' // access token provided
    />
  );

  fireEvent.click(screen.getByText('Create Quiz'));
  expect(setHandleClose).toHaveBeenCalledTimes(1);
});

// Responsive visibilitiy

it('Res. visibilitiy - Should render drawer and main elements are be visible.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access={null}
    />
  );

  expect(screen.getByText('Home')).toBeTruthy();
  expect(screen.getByText('Teachers')).toBeTruthy();
  expect(screen.getByText('Students')).toBeTruthy();
  expect(screen.getByText('F.A.Q.')).toBeTruthy();
});


it('Res. visibilitiy - Should Render "Login" and "Register" when no access is provided', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access={null} // access token not provided
    />
  );

  expect(screen.getByText('Login')).toBeTruthy();
  expect(screen.getByText('Register')).toBeTruthy();
});


it('Res. visibilitiy - Should render Create Quiz when access token provided.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access="some-access-token" // access token provided
    />
  );

  expect(screen.getByText('Create Quiz')).toBeTruthy();
});


it('Res. visibilitiy - Should NOT render "Login" and "Register" when access token is provided.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access="some-access-token" // access token provided
    />
  );

  expect(screen.queryByText('Login')).toBeNull();
  expect(screen.queryByText('Register')).toBeNull();
});


it('Res. visibilitiy - Should NOT render Create Quiz when access token is not provided.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access={null} // access token not provided
    />
  );

  expect(screen.queryByText('Create Quiz')).toBeNull();
});


// Responsive routing

it('Res. routing - Should route to the related routes of the main elements of drawer.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access={null}
    />
  );

  // Home link
  const homeLink = screen.getByRole('link', { name: 'Home' });
  fireEvent.click(homeLink);
  expect(window.location.pathname).toBe('/');

  // Teachers link
  fireEvent.click(screen.getByRole('link', { name: 'Teachers' }));
  expect(window.location.pathname).toBe('/teachers');

  // Students link
  fireEvent.click(screen.getByRole('link', { name: 'Students' }));
  expect(window.location.pathname).toBe('/students');
});


it('Res. routing - Should route to the related routes when clicked to "Login" and "Register".', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access={null}
    />
  );

  // Login link
  const homeLink = screen.getByRole('link', { name: 'Login' });
  fireEvent.click(homeLink);
  expect(window.location.pathname).toBe('/login');

  // Register link
  fireEvent.click(screen.getByRole('link', { name: 'Register' }));
  expect(window.location.pathname).toBe('/register');
});


it('Res. routing - Should route to the related route when Create Quiz is clicked.', () => {
  render(
    <NavbarDrawer
      drawerOpen={true}
      setDrawerOpen={setDrawerOpen}
      handleClose={setHandleClose}
      access='some-access-token'
    />
  );

  const homeLink = screen.getByRole('link', { name: 'Create Quiz' });
  fireEvent.click(homeLink);
  expect(window.location.pathname).toBe('/create-quiz');
});
