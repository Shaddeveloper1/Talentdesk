import {
  describe, it, expect, vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders form fields', () => {
    render(<App />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByText('Drop a file here')).toBeInTheDocument();
  });

  it('shows required field errors on empty submit', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Message is required.')).toBeInTheDocument();
    expect(screen.getByText('Select a file to upload.')).toBeInTheDocument();
  });

  it('shows min-length validation errors', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Short' } });
    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    expect(await screen.findByText('Name must be at least 2 characters.')).toBeInTheDocument();
    expect(screen.getByText('Message must be at least 10 characters.')).toBeInTheDocument();
  });

  it('submits successfully and renders the response panel', async () => {
    const mockResponse = {
      name: 'Ada Lovelace',
      message: 'This is a valid test message.',
      file: {
        originalName: 'test.txt',
        path: '/uploads/test.txt',
        type: 'text/plain',
      },
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }));

    const { container } = render(<App />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'This is a valid test message.' },
    });

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    expect(await screen.findByText('Submission saved')).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
