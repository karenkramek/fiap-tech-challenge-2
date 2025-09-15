import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Bem-vindo ao ByteBank
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Seu sistema de gerenciamento financeiro pessoal
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              Visualize seu saldo atual, adicione novas transações e acompanhe suas finanças.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir para Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Transações
            </h2>
            <p className="text-gray-600 mb-6">
              Gerencie todas suas transações, visualize o extrato completo e edite registros.
            </p>
            <Link
              to="/transactions"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Transações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;