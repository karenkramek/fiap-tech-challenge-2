import React, { useState } from 'react';
import Button from '../../ui/Button';
import ModalWrapper from '../../ui/ModalWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../store/authSlice';
import { RootState, AppDispatch } from '../../../store/index';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ open, onClose, onSwitchToRegister, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setLocalError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);

    try {
      await dispatch(login({ email, password })).unwrap();
      onLoginSuccess?.(); // Chama sucesso imediatamente
      handleClose();
    } catch (err: any) {
      setLocalError(err?.message || 'Erro ao fazer login');
    } finally {
      setLocalLoading(false);
    }
  };

  if (!open) return null;

  return (
    <ModalWrapper open={open} onClose={handleClose} title="Entrar" size="sm">
      <p className="modal-text mb-6 text-primary-700">Acesse sua conta ByteBank</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {localError || error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-md font-bold text-primary-700 mb-1">
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
          <label htmlFor="password" className="block text-md font-bold text-primary-700 mb-1">
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
            className="w-full py-3 rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="active"
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white-50 font-medium rounded-lg shadow-md"
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
    </ModalWrapper>
  );
}