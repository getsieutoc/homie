import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddProjectModal } from '../add-project-modal';
import { upsertProject } from '@/services/projects';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/services/projects', () => ({
  upsertProject: vi.fn().mockResolvedValue({
    id: '1',
    domain: 'example.com',
  }),
}));

describe('AddProjectModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open the dialog when the "Add New Project" button is clicked', () => {
    render(<AddProjectModal />);

    const addButton = screen.getByRole('button', { name: /add new project/i });
    fireEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /add new project/i })).toBeInTheDocument();
  });

  it('should display validation error for domain name less than 2 characters', async () => {
    render(<AddProjectModal />);

    const addButton = screen.getByRole('button', { name: /add new project/i });
    fireEvent.click(addButton);

    const domainInput = screen.getByPlaceholderText(
      'Enter domain name without http or https'
    );
    fireEvent.change(domainInput, { target: { value: 'a' } });

    const submitButton = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Domain name must be at least 2 characters.')
      ).toBeInTheDocument();
    });
  });

  it('should close the dialog when the form is successfully submitted', async () => {
    render(<AddProjectModal />);

    const addButton = screen.getByRole('button', { name: /add new project/i });
    fireEvent.click(addButton);

    const domainInput = screen.getByPlaceholderText(
      'Enter domain name without http or https'
    );
    fireEvent.change(domainInput, { target: { value: 'example.com' } });

    const submitButton = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(upsertProject).toHaveBeenCalledWith({
      domain: 'example.com',
    });
  });

  it('should persist form data when dialog is closed without submission', async () => {
    render(<AddProjectModal />);

    // Open the dialog
    const addButton = screen.getByRole('button', { name: /add new project/i });
    fireEvent.click(addButton);

    // Fill in the form field
    const domainInput = screen.getByPlaceholderText(
      'Enter domain name without http or https'
    );
    fireEvent.change(domainInput, { target: { value: 'example.com' } });

    // Close the dialog without submitting
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Reopen the dialog
    fireEvent.click(addButton);

    // Check if the form field contains the default value (should be empty as per defaultValues)
    expect(domainInput).toHaveValue('example.com');
  });

  it('should trim whitespace from domain input before submission', async () => {
    render(<AddProjectModal />);

    const addButton = screen.getByRole('button', { name: /add new project/i });
    fireEvent.click(addButton);

    const domainInput = screen.getByPlaceholderText(
      'Enter domain name without http or https'
    );

    fireEvent.change(domainInput, { target: { value: '  example.com  ' } });

    const submitButton = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(upsertProject).toHaveBeenCalledWith({
        domain: 'example.com',
      });
    });
  });
});
