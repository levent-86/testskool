import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Register from '../pages/Register';
import userEvent from '@testing-library/user-event';
import api from '../services/api';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { ENDPOINTS } from '../constants/endpoints';
import { MemoryRouter } from 'react-router-dom';
import { AlertMessages } from '../components/AlertMessages';


interface UserRequest {
  username?: string;
  password?: string;
  confirm?: string;
}


/* VISIBILITY TESTS BEFORE REQUEST */
describe('Visibility tests of Register component before request.', () => {
  it('Should render main inputs and texts.', async () => {
    render(<Register />);

    // Welcoming message
    expect(screen.getByText('Welcome To TestSkool')).toBeTruthy();

    // Call to action message
    expect(screen.getByText('Join Us Today!')).toBeTruthy();

    // username input
    expect(screen.getByPlaceholderText('john-doe')).toBeTruthy();

    // password input
    expect(screen.getByPlaceholderText('Min. 8 characters')).toBeTruthy();

    // Display password button
    expect(screen.getByLabelText('display the password')).toBeTruthy();

    // Confirm password input
    expect(screen.getByPlaceholderText('Password Confirmation')).toBeTruthy();

    // Display confirm button
    expect(screen.getByLabelText('display the confirm')).toBeTruthy();

    // Checkbox
    expect(screen.getByRole('checkbox')).toBeTruthy();

    // Submit button
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();

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
  });


  /* WITH USER INTERACTIONS */
  describe('Visibility tests with user interaction', () => {
    it('Should NOT render Select / Option input when user clicked to switch.', async () => {
      render(<Register />);

      const user = userEvent.setup();

      // Find checkbox and click on it
      const checkBox = screen.getByRole('checkbox');
      await user.click(checkBox);

      // Select / option input should NOT be visible
      expect(screen.queryByRole('combobox')).toBeNull();
    });


    it('Should render skeleton when switch button clicked.', async () => {
      render(<Register />);

      const user = userEvent.setup();

      // Find checkbox and click on it
      const checkBox = screen.getByRole('checkbox');
      await user.click(checkBox);
      expect(screen.getByTestId('skeleton')).toBeTruthy();
    });


    it('Should mask / unmask password and confirm password inputs when mask / unmask button clicked', async () => {
      render(<Register />);

      const user = userEvent.setup();

      // password input
      const passwordInput = screen.getByPlaceholderText('Min. 8 characters');

      // Display password button
      const passwordDisplay = screen.getByLabelText('display the password');

      // Confirm password input
      const confirmInput = screen.getByPlaceholderText('Password Confirmation');

      // Display confirm button
      const confirmDisplay = screen.getByLabelText('display the confirm');

      // Both input type should be password at first
      expect(passwordInput).toHaveProperty('type', 'password');
      expect(confirmInput).toHaveProperty('type', 'password');

      // Click on mask / unmask buttons
      await user.click(passwordDisplay);
      await user.click(confirmDisplay);

      // Now both input type should be text
      expect(passwordInput).toHaveProperty('type', 'text');
      expect(confirmInput).toHaveProperty('type', 'text');
    });


    it('Main inputs shown as valid or invalid depending on user interaction.', async () => {
      render(<Register />);

      const user = userEvent.setup();

      // Username input
      const usernameInp = screen.getByPlaceholderText('john-doe');
      const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
      const confirmInp = screen.getByPlaceholderText('Password Confirmation');

      // Main inputs are valid as default
      expect(usernameInp.getAttribute('aria-invalid')).toBe('false');
      expect(passwordInp.getAttribute('aria-invalid')).toBe('false');
      expect(confirmInp.getAttribute('aria-invalid')).toBe('false');

      // Provide value and clear on username
      await user.type(usernameInp, 'john-doe');
      await user.clear(usernameInp);

      // other main inputs are still stays valid while username input is invalid
      expect(usernameInp.getAttribute('aria-invalid')).toBe('true');
      expect(passwordInp.getAttribute('aria-invalid')).toBe('false');
      expect(confirmInp.getAttribute('aria-invalid')).toBe('false');

      // Provide value and clear on password
      await user.type(passwordInp, '12345678');
      await user.clear(passwordInp);

      // Confirm input is still valid while first two inputs are invalid
      expect(usernameInp.getAttribute('aria-invalid')).toBe('true');
      expect(passwordInp.getAttribute('aria-invalid')).toBe('true');
      expect(confirmInp.getAttribute('aria-invalid')).toBe('false');

      // Provide value and clear on confirm password
      await user.type(confirmInp, '12345678');
      await user.clear(confirmInp);

      // Main three inputs are invalid
      expect(usernameInp.getAttribute('aria-invalid')).toBe('true');
      expect(passwordInp.getAttribute('aria-invalid')).toBe('true');
      expect(confirmInp.getAttribute('aria-invalid')).toBe('true');
    });
  });
});



/* USER INTERACTION TESTS BEFORE REQUEST */
describe('User interaction tests of Register component before request.', () => {
  it('Submit button should NOT post a request if main inputs are not filled.', async () => {
    render(<Register />);

    const user = userEvent.setup();

    // Submit button
    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    vi.spyOn(api, 'post').mockResolvedValueOnce({});

    // Click submit button while all inputs are empty
    await user.click(submitBtn);
    expect(api.post).not.toHaveBeenCalled();

    // fill one (username) input only, shouldn't enough to submit
    const usernameInp = screen.getByPlaceholderText('john-doe');
    await user.type(usernameInp, 'john-doe');
    await user.click(submitBtn);
    expect(api.post).not.toHaveBeenCalled();

    // fill two (username and password) inputs only, shouldn't enough to submit
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    await user.type(passwordInp, '12345678');
    await user.click(submitBtn);
    expect(api.post).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });


  it('Submit button should send request when main inputs are filled.', async () => {
    render(<Register />);

    const user = userEvent.setup();

    // Submit button
    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    vi.spyOn(api, 'post').mockResolvedValueOnce({});

    // fill all inputs
    const usernameInp = screen.getByPlaceholderText('john-doe');
    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');
    const confirmInp = screen.getByPlaceholderText('Password Confirmation');

    await user.type(usernameInp, 'john-doe');
    await user.type(passwordInp, '12345678');
    await user.type(confirmInp, '12345678');

    await user.click(submitBtn);
    expect(api.post).toHaveBeenCalled();

    vi.restoreAllMocks();
  });


  it('Should route to the related routes when clicked to the Login link and F.A.Q. link', async () => {
    render(<Register />);

    const loginLink = screen.getByRole('link', { name: 'Login instead' });
    const faqLink = screen.getByRole('link', { name: 'Look up F.A.Q. page' });

    fireEvent.click(loginLink);
    expect(window.location.pathname).toBe('/login');

    fireEvent.click(faqLink);
    expect(window.location.pathname).toBe('/faq');
  });
});



/* VISIBILITY TESTS AFTER REQUEST */
describe('User interaction oriented visibility tests after request.', () => {
  const apiUrl = 'http://127.0.0.1:8000';
  const server = setupServer(
    http.get(apiUrl + ENDPOINTS.GET_SUBJECTS, () => {
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
        { status: 201 }
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());


  it('Should render Select / Option input.', async () => {
    render(
      <MemoryRouter>
        <AlertMessages />
        <Register />
      </MemoryRouter>
    );

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
    expect(screen.queryByText('art')).toBeTruthy();
    expect(screen.queryByText('biology')).toBeTruthy();
    expect(screen.queryByText('chemistry')).toBeTruthy();
    expect(screen.queryByText('computer science')).toBeTruthy();
    expect(screen.queryByText('literature')).toBeTruthy();
    expect(screen.queryByText('math')).toBeTruthy();
    expect(screen.queryByText('physics')).toBeTruthy();
  });


  it('Select/Option input should be shown as valid or invalid depending on user interaction.', async () => {
    render(<Register />);
    const user = userEvent.setup();

    // Find checkbox and click on it
    const checkBox = screen.getByRole('checkbox');
    await user.click(checkBox);

    // Combmbox is already valid as default
    const comboBox = screen.queryByRole('combobox') as HTMLElement;
    expect(comboBox.classList.contains('Mui-error')).toBe(false);

    // Expand combobox
    await user.click(comboBox);
    const option = screen.queryByText('art') as Element;

    // Click an element to select
    await user.click(option);
    // Click to the same element to unselect
    await user.click(option);

    // Now combobox is invalid
    expect(comboBox.classList.contains('Mui-error')).toBe(true);
  });


  
  it('Should NOT send a post request if user clicked to "I\'m a teacher!" button but didn\'t provide a subject.', async () => {
    render(<Register />);

    const user = userEvent.setup();

    vi.spyOn(api, 'post').mockResolvedValueOnce({});

    // inputs
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
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
    expect(api.post).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });


  it('Should send a post request if all inputs (including subject) are provided.', async () => {
    render(<Register />);

    const user = userEvent.setup();

    vi.spyOn(api, 'post').mockResolvedValueOnce({});

    // inputs
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');
    const checkBox = screen.getByRole('checkbox');

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '12345678');
    await user.type(confirm, '12345678');

    // User clicks to checkbox but not provides a subject
    await user.click(checkBox);

    const option1 = screen.queryByText('art') as Element;
    const option2 = screen.queryByText('math') as Element;
    const option3 = screen.queryByText('biology') as Element;

    // Clicks some elements to select
    await user.click(option1);
    await user.click(option2);
    await user.click(option3);

    // Click submit button but post request didn't sent
    await user.click(submitBtn);
    expect(api.post).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});



/* ERROR MESSAGES ON GET REQUESTS */
describe('Error message handling on GET request with AlertMessages component.', () => {
  const apiUrl = 'http://127.0.0.1:8000';
  const server = setupServer(
    http.get(apiUrl + ENDPOINTS.GET_SUBJECTS, () => {
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
        { status: 201 }
      );
    })
  );


  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());


  it('Should show an error message when encountered with network error during fetching subjects.', async () => {

    // Create network error
    server.use(
      http.get(apiUrl + ENDPOINTS.GET_SUBJECTS, () => {
        return HttpResponse.error();

      }),
    );

    render(
      <MemoryRouter>
        <AlertMessages />
        <Register />
      </MemoryRouter>
    );

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
      http.get(apiUrl + ENDPOINTS.GET_SUBJECTS, () => {
        return new HttpResponse(null, { status: 429, statusText:'Too many requests.' });
      }),
    );

    render(
      <MemoryRouter>
        <AlertMessages />
        <Register />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Find checkbox and click on it
    const checkBox = screen.getByRole('checkbox');
    await user.click(checkBox);

    expect(screen.getByText('Too many requests.')).toBeTruthy();
  });
});


describe('Error / Success message handling on POST request with AlertMessages component.', () => {
  const apiUrl = 'http://127.0.0.1:8000';
  const server = setupServer(
    http.post(apiUrl + ENDPOINTS.REGISTER, async ({ request }) => {

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

          // Check the password lengt
        } else if (password?.length < 8 || confirm?.length < 8) {
          throw new HttpResponse(JSON.stringify({ message: 'Password must be at least 8 characters.' }), { status: 412 });

          // Ensure if password matches confirmation
        } else if (password !== confirm) {
          throw new HttpResponse(JSON.stringify({ message: 'Password and confirmation didn\'t match.' }), { status: 417 });

          // Send success message
        } else {
          throw new HttpResponse(JSON.stringify({ message: 'Account registered successfully. You are ready to log in!' }), { status: 201 });
        }
      }
    })
  );


  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Should show error message when form username field fails with expectation.', async () => {
    render(
      <MemoryRouter>
        <AlertMessages />
        <Register />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Inputs
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');

    // User fills inputs
    await user.type(username, 'john doe');
    await user.type(password, '12345678');
    await user.type(confirm, '12345678');

    await user.click(submitBtn);

    expect(screen.getByText('Space is not allowed on username.')).toBeTruthy();
  });

  it('Should show error if password or confirm password lengths are shorter than 8 characters.', async () => {
    render(
      <MemoryRouter>
        <AlertMessages />
        <Register />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Inputs
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '1234567');
    await user.type(confirm, '1234567');

    await user.click(submitBtn);

    expect(screen.getByText('Password must be at least 8 characters.')).toBeTruthy();
  });


  it('Should show error if password and confirm password are mismatch.', async () => {
    render(
      <MemoryRouter>
        <AlertMessages />
        <Register />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Inputs
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '12345678');
    await user.type(confirm, '01234567');

    await user.click(submitBtn);

    expect(screen.getByText('Password and confirmation didn\'t match.')).toBeTruthy();
  });


  it('Should show success message if inputs are filled as expected.', async () => {
    render(
      <MemoryRouter>
        <AlertMessages />
        <Register />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Inputs
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    const username = screen.getByPlaceholderText('john-doe');
    const password = screen.getByPlaceholderText('Min. 8 characters');
    const confirm = screen.getByPlaceholderText('Password Confirmation');

    // User fills inputs
    await user.type(username, 'john-doe');
    await user.type(password, '12345678');
    await user.type(confirm, '12345678');

    await user.click(submitBtn);

    // Now should show success message
    const successMessage = screen.getByText('Account registered successfully. You are ready to log in!');
    expect(successMessage).toBeTruthy();
  });
});
