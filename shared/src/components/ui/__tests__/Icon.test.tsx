import { render } from '@testing-library/react';
import Icon from '../Icon';

describe('Icon (shared)', () => {
  it('renderiza o ícone Edit', () => {
    const { container } = render(<Icon.Edit />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renderiza o ícone Trash2', () => {
    const { container } = render(<Icon.Trash2 />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
