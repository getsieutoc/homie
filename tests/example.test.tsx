import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from './test-utils';

export type Props = {
  title: string;
};

export function ExampleComponent({ title }: Props) {
  return <h1>{title}</h1>;
}

describe('ExampleComponent', () => {
  it('renders the title', () => {
    renderWithProviders(<ExampleComponent title="Hello, Test!" />);
    expect(screen.getByText('Hello, Test!')).toBeInTheDocument();
  });
});
