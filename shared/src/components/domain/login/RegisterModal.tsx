import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../ui/Button';
import ModalCloseButton from '../../ui/ModalCloseButton';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister?: (name: string, email: string, password: string) => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ open, onClose, onRegister, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validações
    if (!name.trim()) {
      setError('Por favor, insira seu nome completo.');
      return;
    }

    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    if (!password) {
      setError('Por favor, insira sua senha.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      if (onRegister) {
        await onRegister(name.trim(), email, password);
      }

      // Exibir toast de sucesso
      toast.success('Conta criada com sucesso!', {
        duration: 4000,
        style: {
          background: '#10b981',
          color: 'white',
        },
        iconTheme: {
          primary: 'white',
          secondary: '#10b981',
        },
      });

      // Limpar formulário após sucesso
      setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSuccess(null);
        onClose();
      }, 1000); // Reduzido para 1 segundo já que o toast já dá feedback
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
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
              {success}
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
