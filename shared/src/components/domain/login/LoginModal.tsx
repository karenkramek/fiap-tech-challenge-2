import React, { useState } from 'react';
import Button from '../../ui/Button';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => Promise<any>;
  onSwitchToRegister?: () => void;
}

export default function LoginModal({ open, onClose, onLogin, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    if (!password) {
      setError('Por favor, insira sua senha.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setLoading(true);
    try {
      let loggedAccount = null;
      if (onLogin) {
        loggedAccount = await onLogin(email, password);
      }

      // Limpar formulário após login bem-sucedido
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError('Email ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 !m-0 modal-overlay flex items-center justify-center z-50">
      <div className="modal-content relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
          onClick={handleClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h2 className="modal-title">Entrar</h2>
        <p className="modal-text mb-6">Acesse sua conta ByteBank</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none text-primary-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-1">
              Senha*
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 rounded-lg text-primary-700 border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="active"
              className="bg-primary-600 hover:bg-primary-700 text-white-50 font-medium"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
              onClick={() => {
                if (onSwitchToRegister) {
                  onSwitchToRegister();
                }
                handleClose();
              }}
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
