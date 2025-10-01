import React, { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import ModalCloseButton from '../../ui/ModalCloseButton';
import { useDispatch, useSelector } from 'react-redux';
import { registerAccount, resetRegister } from '../../../store/registerSlice';
import { RootState, AppDispatch } from '../../../store/index';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

export default function RegisterModal({ open, onClose, onSwitchToLogin, onRegisterSuccess }: RegisterModalProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.register);

  useEffect(() => {
    if (success && open) {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      dispatch(resetRegister());
      onClose();
      if (onRegisterSuccess) onRegisterSuccess();
    }
  }, [success, open, onClose, dispatch, onRegisterSuccess]);

  useEffect(() => {
    if (!open) {
      dispatch(resetRegister());
    }
  }, [open, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;
    if (!password) return;
    if (password.length < 6) return;
    if (password !== confirmPassword) return;
    dispatch(registerAccount({ name: name.trim(), email, password }));
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    dispatch(resetRegister());
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 !m-0 modal-overlay flex items-center justify-center z-50">
      <div className="modal-content relative max-h-[90vh] overflow-y-auto">
        <ModalCloseButton onClick={onClose} />
        <h2 className="modal-title">Criar nova conta</h2>
        <p className="modal-text mb-4">Crie sua conta ByteBank gratuitamente</p>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <strong>Atenção:</strong> Ao criar uma nova conta, você começará com saldo zero e histórico de transações limpo.
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Conta criada com sucesso!
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-1">
              Nome Completo*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none text-primary-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-primary-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none text-primary-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-primary-700 mb-1">
              Senha*
            </label>
            <input
              type="password"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha (mínimo 6 caracteres)"
              className="w-full px-4 py-3 rounded-lg text-primary-700 border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-primary-700 mb-1">
              Confirmar Senha*
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite novamente sua senha"
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
              className="bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
              onClick={() => {
                handleClose();
                if (onSwitchToLogin) {
                  onSwitchToLogin();
                }
              }}
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
