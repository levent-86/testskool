import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import api from '../services/api';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '../constants/endpoints';
import { MemoryRouter } from 'react-router-dom';
import { AlertMessages } from '../components/AlertMessages';
import { AccessTokenProvider } from '../contexts/AccessProvider';
import { BaseURLS } from '../constants/base-urls';
import Form from '../components/Form';


interface UserRequest {
  username?: string;
  password?: string;
  confirm?: string;
};


const renderForm = (page: 'login' | 'register') => render(
  <MemoryRouter>
    <AccessTokenProvider>
      <Form page={page} />
    </AccessTokenProvider>
  </MemoryRouter>
);


const renderReqForm = (page: 'login' | 'register') => render(
  <MemoryRouter>
    <AccessTokenProvider>
      <AlertMessages />
      <Form page={page} />
    </AccessTokenProvider>
  </MemoryRouter>
);


describe('Rendering test related pages:', () => {
  it('renders login page correctly.', () => {
    renderForm('login');

    // Login text
    expect(screen.getByRole('heading', { level: 5 }).textContent).toBe('Login');

    // Username input
    expect(screen.getByPlaceholderText('john-doe')).toBeTruthy();

    // Password input
    expect(screen.getByPlaceholderText('Min. 8 characters')).toBeTruthy();

    // Show / hide password button
    expect(screen.getByLabelText('display the password')).toBeTruthy();

    // Login button
    expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();

    // Suggestion text
    expect(screen.getByText('You don\'t have an account yet?')).toBeTruthy();

    // Suggestion link
    expect(screen.getByRole('link', { name: 'Register instead' })).toBeTruthy();

    // Helpful prompt message
    expect(screen.getByText('Do you have questions?')).toBeTruthy();

    // Helpful prompt link
    expect(screen.getByRole('link', { name: 'Look up F.A.Q. page' })).toBeTruthy();


    // Not renders anything from register page
    expect(screen.getByRole('heading', { level: 5 }).textContent).not.toBe('Register');
    expect(screen.queryByPlaceholderText('Password Confirmation')).toBeNull();
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Register' })).toBeNull();
    expect(screen.queryByText('This website is for demonstration purposes only.')).toBeNull();
    expect(screen.queryByText('Please do NOT enter any real personal information!')).toBeNull();
    expect(screen.queryByText('Do you have an account already?')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Login instead' })).toBeNull();
  });


  it('renders register page correctly.', () => {
    renderForm('register');

    // Register text
    expect(screen.getByRole('heading', { level: 5 }).textContent).toBe('Register');

    // Register button
    expect(screen.getByRole('button', { name: 'Register' })).toBeTruthy();

    // Disclaimer message
    expect(screen.getByText('This website is for demonstration purposes only.')).toBeTruthy();

    // Warning message
    expect(screen.getByText('Please do NOT enter any real personal information!')).toBeTruthy();

    // Suggestion message
    expect(screen.getByText('Do you have an account already?')).toBeTruthy();

    // Suggestion link
    expect(screen.getByRole('link', { name: 'Login instead' })).toBeTruthy();

    // Helpful prompt message
    expect(screen.getByText('Do you have questions?')).toBeTruthy();

    // Helpful prompt link
    expect(screen.getByRole('link', { name: 'Look up F.A.Q. page' })).toBeTruthy();

    // Not renders anything belongs to login page
    expect(screen.getByRole('heading', { level: 5 }).textContent).not.toBe('Login');
    expect(screen.queryByRole('button', { name: 'Login' })).toBeNull();
    expect(screen.queryByText('You don\'t have an account yet?')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Register instead' })).toBeNull();
  });


  describe('Visibility tests with user interaction:', () => {
    it('does not render select input but shows skeleton when switching without data.', async () => {
      renderForm('register');

      const user = userEvent.setup();

      // Find checkbox and click on it
      const checkBox = screen.getByRole('checkbox');
      await user.click(checkBox);

      // Select / option input should NOT be visible
      expect(screen.queryByRole('combobox')).toBeNull();

      // Skeleton is visible
      expect(screen.getByTestId('skeleton')).toBeTruthy();
    });


    it('Should route to the related routes when clicked to the Login and F.A.Q. links', () => {
      renderForm('register');

      const registerLink = screen.getByRole('link', { name: 'Login instead' });
      const faqLink = screen.getByRole('link', { name: 'Look up F.A.Q. page' });

      expect(registerLink.getAttribute('href')).toBe('/login');
      expect(faqLink.getAttribute('href')).toBe('/faq');
    });


    it('Should route to the related routes when clicked to the Register link', () => {
      renderForm('login');

      const loginLink = screen.getByRole('link', { name: 'Register instead' });

      expect(loginLink.getAttribute('href')).toBe('/register');
    });
  });
});


describe('Validation handling on inputs - before request:', () => {
  it('Login inputs shown as valid or invalid depending on user interaction.', async () => {
    renderForm('login');

    const user = userEvent.setup();

    // Inputs
    const usernameInp = screen.getByPlaceholderText('john-doe') as HTMLInputElement;
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters') as HTMLInputElement;

    // Inputs are valid as default
    expect(usernameInp.getAttribute('aria-invalid')).toBe('false');
    expect(passwordInp.getAttribute('aria-invalid')).toBe('false');

    // And their values are empty as default
    expect(usernameInp.value).toBe('');
    expect(passwordInp.value).toBe('');

    // Provide value and clear on username input
    await user.type(usernameInp, 'john-doe');
    await user.clear(usernameInp);

    // Password input still valid while username input is invalid
    expect(usernameInp.getAttribute('aria-invalid')).toBe('true');
    expect(passwordInp.getAttribute('aria-invalid')).toBe('false');

    // Provide value and clear on password input
    await user.type(passwordInp, '12345678');
    await user.clear(passwordInp);

    // Both inputs are invalid now
    expect(usernameInp.getAttribute('aria-invalid')).toBe('true');
    expect(passwordInp.getAttribute('aria-invalid')).toBe('true');

    // Provide value to username input
    await user.type(usernameInp, 'john-doe');

    // Now username input shown valid while password input is invalid
    expect(usernameInp.getAttribute('aria-invalid')).toBe('false');
    expect(passwordInp.getAttribute('aria-invalid')).toBe('true');

    // Provide value to password input
    await user.type(passwordInp, '12345678');

    // Now password input shown valid
    expect(passwordInp.getAttribute('aria-invalid')).toBe('false');

    // And both inputs are filled
    expect(usernameInp.value).toBe('john-doe');
    expect(passwordInp.value).toBe('12345678');
  });


  it('Register inputs shown as valid or invalid depending on user interaction.', async () => {
    renderForm('register');

    const user = userEvent.setup();

    // Input
    const confirmInp = screen.getByPlaceholderText('Password Confirmation') as HTMLInputElement;

    // Confirm input is valid and empty as default
    expect(confirmInp.getAttribute('aria-invalid')).toBe('false');
    expect(confirmInp.value).toBe('');

    // Provide value and clear on confirm password
    await user.type(confirmInp, '12345678');
    await user.clear(confirmInp);

    // Main three inputs are invalid
    expect(confirmInp.getAttribute('aria-invalid')).toBe('true');

    // Fill confirm input
    await user.type(confirmInp, '12345678');

    // Now confirm input filled and valid
    expect(confirmInp.getAttribute('aria-invalid')).toBe('false');
    expect(confirmInp.value).toBe('12345678');
  });
});


describe('User interaction tests before request:', () => {
  it('Register button should NOT post if ALL main inputs are not filled.', async () => {
    renderForm('register');

    const user = userEvent.setup();

    // Register button
    const registerBtn = screen.getByRole('button', { name: 'Register' });

    const postSpy = vi.spyOn(api, 'post');

    // Click register button while all inputs are empty
    await user.click(registerBtn);
    expect(postSpy).not.toHaveBeenCalled();

    // fill one (username) input only, shouldn't enough to submit
    const usernameInp = screen.getByPlaceholderText('john-doe');
    await user.type(usernameInp, 'john-doe');
    await user.click(registerBtn);
    expect(postSpy).not.toHaveBeenCalled();

    // fill two (username and password) inputs only, shouldn't enough to submit
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    await user.type(passwordInp, '12345678');
    await user.click(registerBtn);
    expect(postSpy).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });


  it('Register button should send request when main inputs are filled.', async () => {
    renderForm('register');

    const user = userEvent.setup();

    // Register button
    const registerBtn = screen.getByRole('button', { name: 'Register' });

    const postSpy = vi.spyOn(api, 'post');

    // fill all inputs
    const usernameInp = screen.getByPlaceholderText('john-doe');
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    const confirmInp = screen.getByPlaceholderText('Password Confirmation');

    await user.type(usernameInp, 'john-doe');
    await user.type(passwordInp, '12345678');
    await user.type(confirmInp, '12345678');

    await user.click(registerBtn);
    expect(postSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });


  it('disables button and shows loading on valid submit', async () => {
    // request will never resolve
    vi.spyOn(api, 'post').mockImplementation(() => new Promise(() => { }));

    renderForm('register');

    const user = userEvent.setup();

    // Fill inputs
    await user.type(screen.getByPlaceholderText('john-doe'), 'john-doe');
    await user.type(screen.getByPlaceholderText('Min. 8 characters'), '12345678');
    await user.type(screen.getByPlaceholderText('Password Confirmation'), '12345678');

    // User clicks to Register button
    const registerBtn = screen.getByRole('button', { name: 'Register' }) as HTMLInputElement;
    await user.click(registerBtn);

    // While waiting the resolve, Register button is disabled and showin progress bar
    expect(registerBtn.disabled).toBeTruthy();
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });


  it('Login button does not post if only one input is not filled.', async () => {
    renderForm('login');

    const user = userEvent.setup();

    // Submit button
    const submitBtn = screen.getByRole('button', { name: 'Login' });

    const postSpy = vi.spyOn(api, 'post');

    // fill username input only shouldn't enough to submit
    const usernameInp = screen.getByPlaceholderText('john-doe');
    await user.type(usernameInp, 'john-doe');
    await user.click(submitBtn);
    expect(postSpy).not.toHaveBeenCalled();

    // fill password input only shouldn't enough to submit
    await user.clear(usernameInp);
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    await user.type(passwordInp, '12345678');
    await user.click(submitBtn);
    expect(postSpy).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });


  it('Login button does not post if password is under 8 characters', async () => {
    renderForm('login');

    const user = userEvent.setup();

    // Submit button
    const submitBtn = screen.getByRole('button', { name: 'Login' });

    const postSpy = vi.spyOn(api, 'post');

    // Click submit button should not work while all inputs are empty
    await user.click(submitBtn);
    expect(postSpy).not.toHaveBeenCalled();

    // fill password input less than 8 characters shouldn't enough to submit
    const usernameInp = screen.getByPlaceholderText('john-doe');
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    await user.type(usernameInp, 'john-doe');
    await user.type(passwordInp, '1234567');
    await user.click(submitBtn);
    expect(postSpy).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});


describe('User interaction oriented visibility tests for Login page after request:', () => {
  const server = setupServer(
    http.post(BaseURLS.API + ENDPOINTS.LOGIN, async ({ request }) => {

      const requestBody = await request.json();
      if (!requestBody) {
        throw new HttpResponse(null, { status: 500 });
      }

      const { username } = requestBody as UserRequest;
      const { password } = requestBody as UserRequest;


      // Set conditions for post request
      if (password && username) {

        // Non-existent username
        if (username === 'non-exist-username') {
          throw new HttpResponse(JSON.stringify({ message: 'No active account found with the given credentials' }), { status: 401 });

          // password and username mismatch with password
        } else if (username === 'mismatch-username' && password === 'mismatch-password') {
          throw new HttpResponse(JSON.stringify({ message: 'No active account found with the given credentials' }), { status: 401 });

          // Send success message
        } else {
          return new HttpResponse(null, { status: 200 });
        }
      }
    })
  );


  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());


  it('Should show error message with AlertMessages component if username doesn\'t exists.', async () => {
    renderReqForm('login');

    const user = userEvent.setup();

    // Inputs and login button
    const usernameInp = screen.getByPlaceholderText('john-doe');
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    // User tries to login with a non-existent username
    await user.type(usernameInp, 'non-exist-username');
    await user.type(passwordInp, '12345678');

    // Now it sohuld show error message
    await user.click(loginBtn);
    expect(await screen.findByText('No active account found with the given credentials')).toBeTruthy();

    // Not success message
    expect(screen.queryByText('You will be redirected to Home page in 5 seconds.')).not.toBeTruthy();
  });


  it('Should show error message with AlertMessages component when username and password mismatch.', async () => {
    renderReqForm('login');

    const user = userEvent.setup();

    // Inputs and login button
    const usernameInp = screen.getByPlaceholderText('john-doe');
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    // User tries to login with a user and/or password mismatches
    await user.type(usernameInp, 'mismatch-username');
    await user.type(passwordInp, 'mismatch-password');

    // Now it sohuld show error message
    await user.click(loginBtn);
    expect(await screen.findByText('No active account found with the given credentials')).toBeTruthy();

    // Not success message
    expect(screen.queryByText('You will be redirected to Home page in 5 seconds.')).not.toBeTruthy();
  });


  it('Successful login should show a message that user will be redirected to the home page,  and clean login inputs.', async () => {
    renderForm('login');

    const user = userEvent.setup();

    // Inputs and login button
    const usernameInp = screen.getByPlaceholderText('john-doe') as HTMLInputElement;
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters') as HTMLInputElement;
    const loginBtn = screen.getByRole('button', { name: 'Login' });

    // User tries to login with a user and/or password mismatches
    await user.type(usernameInp, 'success-username');
    await user.type(passwordInp, 'success-password');

    // Now it should show success message
    await user.click(loginBtn);
    expect(await screen.findByText('You will be redirected to Home page in 5 seconds.')).toBeTruthy();

    // Not error message
    expect(screen.queryByText('No active account found with the given credentials')).not.toBeTruthy();

    // Also inputs are cleaned
    expect(usernameInp.value).toBe('');
    expect(passwordInp.value).toBe('');
  });
});


describe('User interaction oriented visibility tests for Register page after request:', () => {
  const server = setupServer(
    http.get(BaseURLS.API + ENDPOINTS.SUBJECT_LIST, () => {
      return HttpResponse.json(
        [
          { id: 1, name: 'art' },
          { id: 5, name: 'biology' },
          { id: 4, name: 'chemistry' },
          { id: 7, name: 'computer science' },
          { id: 6, name: 'literature' },
          { id: 2, name: 'math' },
          { id: 3, name: 'physics' }
        ],
        { status: 200 }
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());


  it('Should render Select / Option input.', async () => {
    renderForm('register');

    const user = userEvent.setup();

    // Find checkbox and click on it
    const checkBox = screen.getByRole('checkbox');
    await user.click(checkBox);

    // Select / option input should be visible
    expect(screen.queryByRole('combobox')).toBeTruthy();

    // Click on select element
    const selectElement = screen.getByRole('combobox');
    await user.click(selectElement);

    // Any of sucbject should be shown as an option
    expect(screen.getByRole('option', { name: 'Art' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Biology' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Chemistry' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Computer Science' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Literature' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Math' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Physics' })).toBeTruthy();
  });


  it('Select/Option input should be shown as valid or invalid depending on user interaction.', async () => {
    renderForm('register');

    const user = userEvent.setup();

    // Find checkbox and click on it
    const checkBox = screen.getByRole('checkbox');
    await user.click(checkBox);

    // Combmbox is already valid as default
    const comboBox = screen.getByRole('combobox');
    expect(comboBox.classList.contains('Mui-error')).toBe(false);

    // Expand combobox
    await user.click(comboBox);
    const option = screen.getByRole('option', { name: 'Art' });

    // Click an element to select
    await user.click(option);

    expect(comboBox.classList.contains('Mui-error')).toBe(false);

    // Click to the same element to unselect
    await user.click(option);

    // Now combobox is invalid
    expect(comboBox.classList.contains('Mui-error')).toBe(true);
  });


  it('Should NOT send a post request if user clicked to "I\'m a teacher!" button but didn\'t provide a subject.', async () => {
    renderForm('register');

    const user = userEvent.setup();

    const postSpy = vi.spyOn(api, 'post');

    // inputs
    const submitBtn = screen.getByRole('button', { name: 'Register' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');
    const checkBox = screen.getByRole('checkbox');

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '12345678');
    await user.type(confirm, '12345678');

    // User clicks to checkbox but not provides a subject
    user.click(checkBox);

    // Click submit button but post request didn't sent
    await user.click(submitBtn);
    expect(postSpy).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });


  it('Should send a post request if all inputs (including subject) are provided.', async () => {
    renderForm('register');

    const user = userEvent.setup();

    const postSpy = vi.spyOn(api, 'post');

    // inputs
    const submitBtn = screen.getByRole('button', { name: 'Register' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');
    const checkBox = screen.getByRole('checkbox');

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '12345678');
    await user.type(confirm, '12345678');

    // User clicks to checkbox
    await user.click(checkBox);

    // Click on select element
    const selectElement = screen.getByRole('combobox');
    await user.click(selectElement);

    // Any of sucbject should be shown as an option
    const option1 = screen.getByRole('option', { name: 'Art' });
    const option2 = screen.getByRole('option', { name: 'Math' });
    const option3 = screen.getByRole('option', { name: 'Biology' });

    // User clicks some elements to select
    await user.click(option1);
    await user.click(option2);
    await user.click(option3);

    // Click submit button and post request sent
    await user.click(submitBtn);
    expect(postSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});


describe('Error message handling on GET request for Register page with AlertMessages component.', () => {
  const server = setupServer(
    http.get(BaseURLS.API + ENDPOINTS.SUBJECT_LIST, () => {
      return HttpResponse.json(
        [
          { id: 1, name: 'art' },
          { id: 5, name: 'biology' },
          { id: 4, name: 'chemistry' },
          { id: 7, name: 'computer science' },
          { id: 6, name: 'literature' },
          { id: 2, name: 'math' },
          { id: 3, name: 'physics' }
        ],
        { status: 200 }
      );
    })
  );


  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());


  it('Should show an error message when encounters with network error during fetching subjects.', async () => {

    // Create network error
    server.use(
      http.get(BaseURLS.API + ENDPOINTS.SUBJECT_LIST, () => {
        return HttpResponse.error();
      }),
    );

    renderReqForm('register');

    const user = userEvent.setup();

    // Find checkbox and click on it
    const checkBox = screen.getByRole('checkbox');
    await user.click(checkBox);

    // Now alert message should be shown
    expect(screen.getByText('Unable to fetch: Network Error')).toBeTruthy();
  });


  it('Should show an error message on GET request from server when server is throttled.', async () => {
    // Create server error
    server.use(
      http.get(BaseURLS.API + ENDPOINTS.SUBJECT_LIST, () => {
        return new HttpResponse(null, { status: 429, statusText: 'Too many requests.' });
      }),
    );

    renderReqForm('register');

    const user = userEvent.setup();

    // Find checkbox and click on it
    const checkBox = screen.getByRole('checkbox');
    await user.click(checkBox);

    expect(screen.getByText('Too many requests.')).toBeTruthy();
  });
});


describe('Error / Success message handling on POST requestfor Register page with AlertMessages component.', () => {
  const server = setupServer(
    http.post(BaseURLS.API + ENDPOINTS.REGISTER, async ({ request }) => {

      const requestBody = await request.json();
      if (!requestBody) {
        throw new HttpResponse(null, { status: 500 });
      }
      const { username } = requestBody as UserRequest;
      const { password } = requestBody as UserRequest;
      const { confirm } = requestBody as UserRequest;


      // Set conditions for post request
      if (password && confirm && username) {

        // Ensure if username has no space character
        if (username.includes(' ')) {
          throw new HttpResponse(JSON.stringify({ message: 'Space is not allowed on username.' }), { status: 412 });

          // Ensure if password and check password are same
        } else if (password !== confirm) {
          throw new HttpResponse(JSON.stringify({ message: 'Password and confirmation didn\'t match.' }), { status: 417 });

          // Send success message
        } else {
          return new HttpResponse(JSON.stringify({ message: 'Account registered successfully. You are ready to log in!' }), { status: 201 });
        }
      }
    })
  );


  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Should show error message when form username field fails with expectation.', async () => {
    renderReqForm('register');

    const user = userEvent.setup();

    // Inputs
    const submitBtn = screen.getByRole('button', { name: 'Register' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');

    // User fills inputs
    await user.type(username, 'john doe');
    await user.type(password, '12345678');
    await user.type(confirm, '12345678');

    await user.click(submitBtn);

    // Should show error
    expect(await screen.findByText('Space is not allowed on username.')).toBeTruthy();

    // Should NOT show success
    expect(screen.queryByText('You will be redirected to Login page in 5 seconds.')).not.toBeTruthy();
  });


  it('Should show error if password and confirm password are mismatch.', async () => {
    renderReqForm('register');

    const user = userEvent.setup();

    // Inputs
    const submitBtn = screen.getByRole('button', { name: 'Register' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '12345678');
    await user.type(confirm, '01234567');

    await user.click(submitBtn);

    expect(await screen.findByText('Password and confirmation didn\'t match.')).toBeTruthy();
  });


  it('Should show success message if inputs are filled as expected, and register page inputs are cleaned.', async () => {
    renderReqForm('register');

    const user = userEvent.setup();

    // Inputs
    const submitBtn = screen.getByRole('button', { name: 'Register' });
    const username = screen.getByPlaceholderText('john-doe') as HTMLInputElement;
    const password = screen.getByPlaceholderText('Min. 8 characters') as HTMLInputElement;
    const confirm = screen.getByPlaceholderText('Password Confirmation') as HTMLInputElement;

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '12345678');
    await user.type(confirm, '12345678');

    await user.click(submitBtn);

    // Now should show success message and routing message
    expect(await screen.findByText('Account registered successfully. You are ready to log in!')).toBeTruthy();
    expect(await screen.findByText('You will be redirected to Login page in 5 seconds.')).toBeTruthy();

    // Also register page inputs are cleaned
    expect(username.value).toBe('');
    expect(password.value).toBe('');
    expect(confirm.value).toBe('');
  });
});
