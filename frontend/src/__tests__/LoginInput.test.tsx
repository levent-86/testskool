import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/form/LoginInput';




describe('Visibility tests of Login component:', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render username and password fields', () => {
    const setUsernameMock = vi.fn();
    const setPasswordMock = vi.fn();

    render(
      <Login
        username=""
        setUsername={setUsernameMock}
        usernameMessage={null}
        password=""
        setPassword={setPasswordMock}
        passwordMessage={null}
      />
    );

    // Username input
    expect(screen.getByPlaceholderText('john-doe')).toBeTruthy();

    // Password input
    expect(screen.getByPlaceholderText('Min. 8 characters')).toBeTruthy();

    // Show / hide password button
    expect(screen.getByLabelText('display the password')).toBeTruthy();
  });


  it('Should update username on input change.', () => {
    const setUsernameMock = vi.fn();
    const setPasswordMock = vi.fn();

    render(
      <Login
        username=""
        setUsername={setUsernameMock}
        usernameMessage={null}
        password=""
        setPassword={setPasswordMock}
        passwordMessage={null}
      />
    );

    const usernameInp = screen.getByPlaceholderText('john-doe');

    // Fill username input
    fireEvent.change(usernameInp, { target: { value: 'newUser' } });

    // Now look up if username mocking function called right
    expect(setUsernameMock).toHaveBeenCalledWith('newUser');
  });


  it('should update password on input change', () => {
    const setUsernameMock = vi.fn();
    const setPasswordMock = vi.fn();

    render(
      <Login
        username=""
        setUsername={setUsernameMock}
        usernameMessage={null}
        password=""
        setPassword={setPasswordMock}
        passwordMessage={null}
      />
    );

    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');

    // Fill password input
    fireEvent.change(passwordInp, { target: { value: 'newPassword123' } });

    // Now look up if password mocking function called right
    expect(setPasswordMock).toHaveBeenCalledWith('newPassword123');
  });


  it('should toggle password visibility when clicking the icon button', async () => {
    const setUsernameMock = vi.fn();
    const setPasswordMock = vi.fn();

    render(
      <Login
        username=""
        setUsername={setUsernameMock}
        usernameMessage={null}
        password=""
        setPassword={setPasswordMock}
        passwordMessage={null}
      />
    );

    const user = userEvent.setup();

    const passwordInp = screen.getByPlaceholderText('Min. 8 characters');

    const displayPassword = screen.getByLabelText('display the password');


    // Password input type should be shown as password at first
    expect(passwordInp).toHaveProperty('type', 'password');

    // Not as a text
    expect(passwordInp).not.toHaveProperty('type', 'text');

    // Click on icon button
    await user.click(displayPassword);

    // Now password input type should be shown as text
    expect(passwordInp).toHaveProperty('type', 'text');

    // Not as a password
    expect(passwordInp).not.toHaveProperty('type', 'password');
  });


  it('should display error messages when username or password is not filled.', () => {
    const setUsernameMock = vi.fn();
    const setPasswordMock = vi.fn();

    render(
      <Login
        username=""
        setUsername={setUsernameMock}
        usernameMessage="Username field may not be blank."
        password=""
        setPassword={setPasswordMock}
        passwordMessage="Password field may not be blank."
      />
    );

    // Error message for username
    expect(screen.getByText(/username field may not be blank./i)).toBeTruthy();

    // Error message for password
    expect(screen.getByText(/password field may not be blank./i)).toBeTruthy();
  });


  it('should not display error messages when username and password are filled', () => {
    const setUsernameMock = vi.fn();
    const setPasswordMock = vi.fn();

    render(
      <Login
        username="user123"
        setUsername={setUsernameMock}
        usernameMessage={null}
        password="password123"
        setPassword={setPasswordMock}
        passwordMessage={null}
      />
    );

    // There should be no error message for username or password
    expect(screen.queryByText(/username field may not be blank./i)).not.toBeTruthy();
    expect(screen.queryByText(/password field may not be blank./i)).not.toBeTruthy();
  });
});
