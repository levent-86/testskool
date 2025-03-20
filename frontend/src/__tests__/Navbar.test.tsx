import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, it, afterEach, describe, beforeAll, afterAll } from 'vitest';
import { Navbar } from '../components/Navbar';
import userEvent from '@testing-library/user-event';
import { AccessTokenProvider } from '../contexts/AccessProvider';
import { UserDataProvider } from '../contexts/UserProvider';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ENDPOINTS } from '../constants/endpoints';
import { BaseURLS } from '../constants/base-urls';


const renderNavbar = () => render(
  <MemoryRouter>
    <AccessTokenProvider>
      <UserDataProvider>
        <Navbar />
      </UserDataProvider>
    </AccessTokenProvider>
  </MemoryRouter>
);


// Clean local storage after each
afterEach(() => {
  localStorage.clear();
});

const mainElements = ['TestSkool', 'Home', 'Teachers', 'Students', 'Login/Register'];
const menuItems = [/login/i, /register/i, /f.a.q./i, /visit me on LinkedIn/i];


// VISIBILITY TESTS
describe('Visibility tests of Navbar before request:', () => {

  it('Should render Navbar and visible main elements.', () => {
    renderNavbar();

    mainElements.forEach((e) => {
      expect(screen.getByText(e)).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: /theme/i })).toBeTruthy();
  });


  it('Should render "Login/Register" elements when clicked.', async () => {
    renderNavbar();

    const user = userEvent.setup();

    const loginRegisterButton = screen.getByText('Login/Register');
    await user.click(loginRegisterButton);

    menuItems.forEach(e => expect(screen.getByRole('link', { name: e })).toBeTruthy());
  });
});


describe('Visibility tests with token presence', () => {
  it('Should render Profile button when access token provided.', () => {
    localStorage.setItem('access', 'some-access-token'); // access token provided

    renderNavbar();

    expect(screen.getByRole('button', { name: /your account/i })).toBeTruthy();
  });


  describe('Visibility tests with token presence and user interaction', () => {
    it('Should NOT enough to access to profile button elemnt only if access token provided.', async () => {
      localStorage.setItem('access', 'some-access-token'); // access token provided
      renderNavbar();

      const user = userEvent.setup();

      const profileButton = screen.getByRole('button', { name: 'Your Account' });
      await user.click(profileButton);

      expect(screen.queryByRole('link', { name: /my profile/i })).toBeFalsy();
      expect(screen.queryByRole('link', { name: /f.a.q./i })).toBeFalsy();
      expect(screen.queryByRole('menuitem', { name: /logout/i })).toBeFalsy();
      expect(screen.queryByRole('link', { name: /visit me on linkedin/i })).toBeFalsy();

      // also logged out
      expect(screen.getByText('Logged out')).toBeTruthy();
    });


    it('Should NOT render Login/Register when access token provided.', () => {
      localStorage.setItem('access', 'some-access-token'); // access token provided
      renderNavbar();

      expect(screen.queryByText('Login/Register')).toBeNull();
    });


    it('Should NOT render Profile button when access token is not provided.', () => {
      renderNavbar();

      expect(screen.queryByRole('button', { name: 'Your Account' })).toBeNull();
    });
  });
});



// ROUTE TESTS
describe('Routing tests before request', () => {
  it('Should route to the related routes of the main elements of navbar.', () => {
    renderNavbar();

    // Logo link
    const logoLink = screen.getByRole('link', { name: 'TestSkool' });
    expect(logoLink.getAttribute('href')).toBe('/');

    // Home link
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink.getAttribute('href')).toBe('/');

    // Teachers link
    const teachersLink = screen.getByRole('link', { name: 'Teachers' });
    expect(teachersLink.getAttribute('href')).toBe('/teachers');

    // Students link
    const studentsLink = screen.getByRole('link', { name: 'Students' });
    expect(studentsLink.getAttribute('href')).toBe('/students');
  });


  describe('Routing tests with user interaction before request', () => {
    it('Should route to the related routes when clicked to the Login/Register button elements.', async () => {
      renderNavbar();

      const user = userEvent.setup();

      // Login/Register button
      const loginRegisterDropdown = screen.getByRole('button', { name: 'Login/Register' });
      await user.click(loginRegisterDropdown);

      const loginLink = screen.getByRole('link', { name: 'Login' });
      expect(loginLink.getAttribute('href')).toBe('/login');

      // Register
      const registerLink = screen.getByRole('link', { name: 'Register' });
      expect(registerLink.getAttribute('href')).toBe('/register');

      // F.A.Q.
      const faq = screen.getByRole('link', { name: 'F.A.Q.' });
      expect(faq.getAttribute('href')).toBe('/faq');

      // LinkedIn link
      const linkedinLink = screen.getByRole('link', { name: 'Visit me on LinkedIn' });
      expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com/in/mustafaleventfidanci/');
    });
  });
});


describe('Routing tests with user interaction after request', () => {
  const server = setupServer(
    http.get(BaseURLS.API + ENDPOINTS.MY_PROFILE, () => {
      return HttpResponse.json(
        {
          'id': 2,
          'username': 'test-user',
          'first_name': 'Foo',
          'last_name': 'Bar',
          'email': 'test-user@example.com',
          'is_teacher': true, // User is a teacher as default
          'subject': ['math', 'art'],
          'is_Student': false,
          'about': 'about test user',
          'profile_picture': null,
          'date_joined': '2025-01-01T11:16:13Z'
        },
        { 'status': 200 }
      );
    })
  );


  // Reset data
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Should render Profile button elements.', async () => {
    localStorage.setItem('access', 'some-access-token'); // access token provided
    renderNavbar();

    const user = userEvent.setup();

    const profileButton = screen.getByRole('button', { name: 'Your Account' });
    await user.click(profileButton);

    expect(screen.getByRole('link', { name: /my profile/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /f.a.q./i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /visit me on linkedin/i })).toBeTruthy();
  });

  it('Should route to the related routes when clicked to Profile elements.', async () => {
    localStorage.setItem('access', 'some-access-token'); // access token provided
    renderNavbar();

    const user = userEvent.setup();

    const profileButton = screen.getByRole('button', { name: 'Your Account' });
    await user.click(profileButton);

    const myProfile = screen.getByRole('link', { name: /my profile/i });
    const faq = screen.getByRole('link', { name: /f.a.q/i });
    const linkedIn = screen.getByRole('link', { name: /visit me on linkedin/i });

    expect(myProfile.getAttribute('href')).toBe('/my-profile');
    expect(faq.getAttribute('href')).toBe('/faq');
    expect(linkedIn.getAttribute('href')).toBe('https://www.linkedin.com/in/mustafaleventfidanci/');
  });

  it('Should show user first name when clicked to profile button.', async () => {
    localStorage.setItem('access', 'some-access-token'); // access token provided

    renderNavbar();

    const user = userEvent.setup();

    // My Profile
    const userDropdown = screen.getByRole('button', { name: 'Your Account' });

    await user.click(userDropdown);
    const myProfileLink = screen.getByRole('link', { name: 'My Profile' });
    expect(myProfileLink).toBeTruthy();
    expect(screen.getByText('Foo')).toBeTruthy();
  });

  it('Should render Create Quiz button for teacher.', async () => {
    localStorage.setItem('access', 'some-access-token');

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Create Quiz' }));
    });
  });

  it('Should NOT render Create Quiz button for student.', async () => {
    localStorage.setItem('access', 'some-access-token');

    // Login as a student
    server.use(
      http.get(BaseURLS.API + ENDPOINTS.MY_PROFILE, () => {
        return HttpResponse.json(
          {
            'id': 2,
            'username': 'student-user',
            'first_name': 'Foo',
            'last_name': 'Bar',
            'email': 'test-user@example.com',
            'is_teacher': false,
            'subject': ['math', 'art'],
            'is_Student': true, // user is a student now
            'about': 'about test user',
            'profile_picture': null,
            'date_joined': '2025-01-01T11:16:13Z'
          },
          { 'status': 200 }
        );
      }),
    );

    renderNavbar();

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Create Quiz' })).toBeFalsy();
    });
  });

  it('Should route to Create Quiz when button is clicked.', async () => {
    localStorage.setItem('access', 'some-access-token'); // access token provided

    renderNavbar();

    await waitFor(() => {
      const createQuiz = screen.getByRole('link', { name: 'Create Quiz' });
      expect(createQuiz.getAttribute('href')).toBe('/create-quiz');
    });
  });

  it('Should show Looged out message to user when clicked to Logout button.', async () => {
    localStorage.setItem('access', 'some-access-token'); // access token provided

    renderNavbar();

    const user = userEvent.setup();

    // My Profile
    const userDropdown = screen.getByRole('button', { name: 'Your Account' });
    await user.click(userDropdown);

    const logoutBtn = screen.getByRole('menuitem', { name: /logout/i });
    await user.click(logoutBtn);
    expect(screen.getByText('Logged out')).toBeTruthy();
  });

  it('Should NOT render Profile and Create Quiz buttons after logged out.', async () => {
    localStorage.setItem('access', 'some-access-token'); // access token provided

    renderNavbar();

    const user = userEvent.setup();

    // My Profile
    const userDropdown = screen.getByRole('button', { name: 'Your Account' });
    await user.click(userDropdown);

    const logoutBtn = screen.getByRole('menuitem', { name: /logout/i });
    await user.click(logoutBtn);

    // There are no Profile button
    expect(screen.queryByRole('button', { name: 'Your Account' })).toBeFalsy();

    // There are no Create Quiz button
    expect(screen.queryByRole('link', { name: 'Create Quiz' })).toBeFalsy();
  });
});
