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
            {/* Card 1 - Dashboard */}
            <div className="bg-black text-white rounded-lg p-8 hover:bg-gray-800 transition-colors">
              <div className="mb-6">
                <CreditCard className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                Dashboard
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Visualize seu saldo atual, adicione novas transações e acompanhe suas finanças.
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Ir para Dashboard
              </Link>
            </div>

            {/* Card 2 - Transações */}
            <div className="bg-black text-white rounded-lg p-8 hover:bg-gray-800 transition-colors">
              <div className="mb-6">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                Transações
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Gerencie todas suas transações, visualize o extrato completo e edite registros.
              </p>
              <Link
                to="/transactions"
                className="inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Ver Transações
              </Link>
            </div>

            {/* Card 3 - Programa de pontos */}
            <div className="bg-black text-white rounded-lg p-8 hover:bg-gray-800 transition-colors">
              <div className="mb-6">
                <Star className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                Programa de pontos
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!
              </p>
            </div>

            {/* Card 4 - Seguro Dispositivos */}
            <div className="bg-black text-white rounded-lg p-8 hover:bg-gray-800 transition-colors">
              <div className="mb-6">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                Seguro Dispositivos
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
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
