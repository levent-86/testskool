import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageMessages } from '../components/PageMessages';
import userEvent from '@testing-library/user-event';

describe('PageMessages Component', () => {
  it('shows info message when provided', () => {
    render(<PageMessages message="Test info" severity="info" />);

    expect(screen.getByText('Test info')).toBeTruthy();
    expect(screen.getByRole('alert').classList.contains('MuiAlert-colorInfo')).toBe(true);
  });

  it('updates message when prop changes', async () => {
    const { rerender } = render(<PageMessages message="Initial" severity="info" />);

    expect(screen.getByText('Initial')).toBeTruthy();
    expect(screen.getByRole('alert').classList.contains('MuiAlert-colorInfo')).toBe(true);

    rerender(<PageMessages message="Updated" severity="warning" />);

    await waitFor(() => {
      expect(screen.getByText('Updated')).toBeTruthy();
      expect(screen.getByRole('alert').classList.contains('MuiAlert-colorWarning')).toBe(true);
    });
  });


  it('closes when close button is clicked', async () => {
    render(<PageMessages message="Test" severity="success" />);

    expect(screen.getByText('Test')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText('Test')).toBeNull();
    });
  });
});
