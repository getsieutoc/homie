import { render, screen, within } from '@testing-library/react';
import { deleteProject } from '@/actions/projects';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { type Project } from '@/types';

import { CellAction } from '../cell-action';

vi.mock('@/services/projects', () => ({
  deleteProject: vi.fn(),
}));

const mockProject: Project = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  domain: 'test.com',
  description: 'Test project',
  tenantId: 'tenant-1',
};

describe('CellAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dropdown menu with all actions', async () => {
    const user = userEvent.setup();
    render(<CellAction data={mockProject} />);

    // Verify initial render
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();

    // Open dropdown
    await user.click(screen.getByRole('button', { name: /open menu/i }));

    // Verify dropdown content
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should handle delete action with confirmation', async () => {
    const user = userEvent.setup();
    render(<CellAction data={mockProject} />);

    // Open dropdown and click delete
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    await user.click(screen.getByText('Delete'));

    // Verify alert modal
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    // Cancel deletion
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(deleteProject).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen and confirm deletion
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    await user.click(screen.getByText('Delete'));

    const dialogAfterReopen = screen.getByRole('dialog');
    expect(dialogAfterReopen).toBeInTheDocument();

    const continueButton = within(dialogAfterReopen).getByRole('button', {
      name: /continue/i,
    });
    expect(continueButton).toBeInTheDocument();

    vi.mocked(deleteProject).mockResolvedValueOnce(mockProject);
    await user.click(continueButton);

    expect(deleteProject).toHaveBeenCalledWith('1');
    expect(deleteProject).toHaveBeenCalledTimes(1);
  });

  it('should handle delete error gracefully', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Failed to delete');
    vi.mocked(deleteProject).mockRejectedValueOnce(mockError);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<CellAction data={mockProject} />);

    // Trigger delete action
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    await user.click(screen.getByText('Delete'));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Verify error handling
    expect(deleteProject).toHaveBeenCalledWith('1');
    expect(consoleSpy).toHaveBeenCalledWith('Failed to delete project:', mockError);

    // Verify UI state after error
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open menu/i })).toBeEnabled();

    consoleSpy.mockRestore();
  });

  it('should maintain loading state during delete operation', async () => {
    const user = userEvent.setup();
    let resolveDelete: (value: Project) => void;
    const deletePromise = new Promise<Project>((resolve) => {
      resolveDelete = resolve;
    });
    vi.mocked(deleteProject).mockImplementationOnce(() => deletePromise);

    render(<CellAction data={mockProject} />);

    // Start delete operation
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    await user.click(screen.getByText('Delete'));
    const confirmButton = screen.getByRole('button', { name: /continue/i });
    await user.click(confirmButton);

    // Verify loading state
    expect(confirmButton).toBeDisabled();

    // Resolve delete operation
    resolveDelete!({
      id: 'test-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      domain: 'test.com',
      description: 'test description',
      tenantId: 'test-tenant-id',
    });

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });
});
