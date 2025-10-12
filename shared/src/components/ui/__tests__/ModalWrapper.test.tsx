import { render } from '@testing-library/react';
import ModalWrapper from '../ModalWrapper';

describe('ModalWrapper (shared)', () => {
  it('renderiza children quando open=true', () => {
    const { getByText } = render(
      <ModalWrapper open={true} onClose={() => {}}>
        <div>Conteúdo do modal</div>
      </ModalWrapper>
    );
    expect(getByText(/conteúdo do modal/i)).toBeInTheDocument();
  });

  it('não renderiza children quando open=false', () => {
    const { queryByText } = render(
      <ModalWrapper open={false} onClose={() => {}}>
        <div>Conteúdo do modal</div>
      </ModalWrapper>
    );
    expect(queryByText(/conteúdo do modal/i)).not.toBeInTheDocument();
  });
});
