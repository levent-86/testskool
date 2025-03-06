import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterInput from '../components/form/RegisterInput';


describe('Visibility tests of RegisterInput component:', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });


  it('Should render main inputs.', () => {

    // Set up mocks functions
    const setConfirmMock = vi.fn();
    const setIsTeacherMock = vi.fn();
    const setFilledSelectMock = vi.fn();
    const setSubjectMock = vi.fn();

    render(
      <RegisterInput
        confirm=''
        setConfirm={setConfirmMock}
        confirmMessage=''
        is_teacher={false}
        setIsTeacher={setIsTeacherMock}
        isTeacherMessage={null}
        isSubjectsLoading={true}
        filledSelect={true}
        setFilledSelect={setFilledSelectMock}
        subject={[]}
        setSubject={setSubjectMock}
        subjects={[]}
        subjectMessage={null}
      />
    );

    // Confirm password input
    expect(screen.getByPlaceholderText('Password Confirmation')).toBeTruthy();

    // Display confirm button
    expect(screen.getByLabelText('display the confirm')).toBeTruthy();

    // Checkbox
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });


  it('Should update confirm password field on input change.', () => {

    // Set up mocks functions
    const setConfirmMock = vi.fn();
    const setIsTeacherMock = vi.fn();
    const setFilledSelectMock = vi.fn();
    const setSubjectMock = vi.fn();

    render(
      <RegisterInput
        confirm=''
        setConfirm={setConfirmMock}
        confirmMessage=''
        is_teacher={false}
        setIsTeacher={setIsTeacherMock}
        isTeacherMessage={null}
        isSubjectsLoading={true}
        filledSelect={true}
        setFilledSelect={setFilledSelectMock}
        subject={[]}
        setSubject={setSubjectMock}
        subjects={[]}
        subjectMessage={null}
      />
    );

    const confirmInp = screen.getByPlaceholderText('Password Confirmation');

    // Fill username input
    fireEvent.change(confirmInp, { target: { value: 'password-confirmation' } });

    // Now look up if username mocking function called right
    expect(setConfirmMock).toHaveBeenCalledWith('password-confirmation');
  });


  it('should toggle confirm password field visibility when clicking the icon button.', async () => {
    // Set up mocks functions
    const setConfirmMock = vi.fn();
    const setIsTeacherMock = vi.fn();
    const setFilledSelectMock = vi.fn();
    const setSubjectMock = vi.fn();

    render(
      <RegisterInput
        confirm=''
        setConfirm={setConfirmMock}
        confirmMessage=''
        is_teacher={false}
        setIsTeacher={setIsTeacherMock}
        isTeacherMessage={null}
        isSubjectsLoading={true}
        filledSelect={true}
        setFilledSelect={setFilledSelectMock}
        subject={[]}
        setSubject={setSubjectMock}
        subjects={[]}
        subjectMessage={null}
      />
    );

    const user = userEvent.setup();

    const confirmInp = screen.getByPlaceholderText('Password Confirmation');

    const displayPassword = screen.getByLabelText('display the confirm');


    // Confirm input type should be shown as password at first
    expect(confirmInp).toHaveProperty('type', 'password');

    // Not as a text
    expect(confirmInp).not.toHaveProperty('type', 'text');

    // Click on icon button
    await user.click(displayPassword);

    // Now confirm input type should be shown as text
    expect(confirmInp).toHaveProperty('type', 'text');

    // Not as a password
    expect(confirmInp).not.toHaveProperty('type', 'password');
  });


  it('Should display a skeleton loader if options fail to load data when switch button is clicked.', async () => {
    // Set up mocks functions
    const setConfirmMock = vi.fn();
    const setIsTeacherMock = vi.fn();
    const setFilledSelectMock = vi.fn();
    const setSubjectMock = vi.fn();

    render(
      <RegisterInput
        confirm=''
        setConfirm={setConfirmMock}
        confirmMessage=''
        is_teacher={true}
        setIsTeacher={setIsTeacherMock}
        isTeacherMessage={null}
        isSubjectsLoading={true}
        filledSelect={true}
        setFilledSelect={setFilledSelectMock}
        subject={[]}
        setSubject={setSubjectMock}
        subjects={[]}
        subjectMessage={null}
      />
    );

    // Skeleton should shown
    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });


  it('Should appear select/option input when user is a teacher.', async () => {
    // Set up mock functions
    const setConfirmMock = vi.fn();
    const setIsTeacherMock = vi.fn();
    const setFilledSelectMock = vi.fn();
    const setSubjectMock = vi.fn();

    render(
      <RegisterInput
        confirm=''
        setConfirm={setConfirmMock}
        confirmMessage=''
        is_teacher={true}
        setIsTeacher={setIsTeacherMock}
        isTeacherMessage={null}
        isSubjectsLoading={false}
        filledSelect={true}
        setFilledSelect={setFilledSelectMock}
        subject={[]}
        setSubject={setSubjectMock}
        subjects={[]}
        subjectMessage={null}
      />
    );

    // Select option input
    expect(screen.getByText('Select Your Subject')).toBeTruthy();

    // warning should be shown in addition
    expect(screen.getByText('You can choose more than one subject.'));
  });
});
