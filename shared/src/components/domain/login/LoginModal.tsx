import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import ModalCloseButton from '../../ui/ModalCloseButton';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../store/authSlice';
import { RootState, AppDispatch } from '../../../store/index';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ open, onClose, onSwitchToRegister, onLoginSuccess, onLogin }: LoginModalProps & { onLogin?: (email: string, password: string) => Promise<any> }) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && open) {
      setEmail('');
      setPassword('');
      onClose();
      if (onLoginSuccess) onLoginSuccess();
    }
  }, [isAuthenticated, open, onClose, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!password) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;
    if (onLogin) {
      setLocalLoading(true);
      try {
        await onLogin(email, password);
      } finally {
        setLocalLoading(false);
      }
    } else {
      dispatch(login({ email, password }));
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 !m-0 modal-overlay flex items-center justify-center z-50">
      <div className="modal-content relative">
        <ModalCloseButton onClick={onClose} />
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
              disabled={loading || localLoading}
            >
              {(loading || localLoading) ? 'Entrando...' : 'Entrar'}
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
