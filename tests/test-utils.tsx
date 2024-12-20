import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export type Props = {
  children: React.ReactNode;
};

// Add your providers here
export function Providers({ children }: Props) {
  return <>{children}</>;
}

export function renderWithProviders(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: Providers,
    }),
  };
}

// re-export everything
export * from '@testing-library/react';
