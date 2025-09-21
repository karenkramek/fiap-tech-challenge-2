import {
  Building2,
  CreditCard,
  Shield,
  Star
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            Experimente mais liberdade<br />
            no controle da sua vida financeira.
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            Crie sua conta Bytebank e aproveite todos os benefícios.
          </p>
        </div>
      </div>      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            Conheça as vantagens do nosso banco
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-black text-black rounded-lg p-8 transition-colors shadow">
              <div className="mb-6">
                <CreditCard className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-700">
                Dashboard
              </h3>
              <p className="text-black-400 mb-6 text-sm leading-relaxed">
                Visualize seu saldo atual, adicione novas transações e acompanhe suas finanças.
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-primary-700 text-white-50 px-4 py-2 rounded hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                Ir para Dashboard
              </Link>
            </div>
            <div className="bg-black text-black rounded-lg p-8 transition-colors shadow">
              <div className="mb-6">
                <Building2 className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-700">
                Transações
              </h3>
              <p className="text-black-400 mb-6 text-sm leading-relaxed">
                Gerencie todas suas transações, visualize o extrato completo e edite registros.
              </p>
              <Link
                to="/transactions"
                className="inline-block bg-primary-700 text-white-50 px-4 py-2 rounded hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                Ver Transações
              </Link>
            </div>

            <div className="bg-black text-black rounded-lg p-8 transition-colors shadow">
              <div className="mb-6">
                <Star className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-700">
                Programa de pontos
              </h3>
              <p className="text-black-400 text-sm leading-relaxed">
                Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!
              </p>
            </div>

            <div className="bg-black text-black rounded-lg p-8 transition-colors shadow">
              <div className="mb-6">
                <Shield className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-700">
                Seguro Dispositivos
              </h3>
              <p className="text-black-400 text-sm leading-relaxed">
                Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
