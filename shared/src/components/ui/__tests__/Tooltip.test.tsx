import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  it('deve renderizar o children corretamente', () => {
    render(
      <Tooltip content="Mensagem do tooltip">
        <button>Botão de teste</button>
      </Tooltip>
    );

    expect(screen.getByRole('button', { name: /botão de teste/i })).toBeInTheDocument();
  });

  it('deve exibir o tooltip ao passar o mouse', () => {
    render(
      <Tooltip content="Mensagem do tooltip">
        <button>Botão de teste</button>
      </Tooltip>
    );

    const container = screen.getByRole('button').parentElement;

    // Tooltip não deve estar visível inicialmente
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Passa o mouse sobre o container
    if (container) {
      fireEvent.mouseEnter(container);
    }

    // Tooltip deve estar visível
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Mensagem do tooltip')).toBeInTheDocument();
  });

  it('deve esconder o tooltip ao tirar o mouse', () => {
    render(
      <Tooltip content="Mensagem do tooltip">
        <button>Botão de teste</button>
      </Tooltip>
    );

    const container = screen.getByRole('button').parentElement;

    if (container) {
      // Passa o mouse
      fireEvent.mouseEnter(container);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      // Tira o mouse
      fireEvent.mouseLeave(container);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    }
  });

  it('não deve exibir o tooltip quando disabled é true', () => {
    render(
      <Tooltip content="Mensagem do tooltip" disabled={true}>
        <button>Botão de teste</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    const container = button.parentElement;

    // Verifica se o container não tem a classe relative (o tooltip não foi renderizado)
    expect(container?.classList.contains('relative')).toBe(false);

    // Tenta passar o mouse (não deve fazer nada)
    fireEvent.mouseEnter(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('deve renderizar apenas o children quando disabled', () => {
    const { container } = render(
      <Tooltip content="Mensagem do tooltip" disabled={true}>
        <button>Botão de teste</button>
      </Tooltip>
    );

    // Deve renderizar apenas um botão, sem wrapper extra
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(container.querySelector('.relative')).not.toBeInTheDocument();
  });
});
