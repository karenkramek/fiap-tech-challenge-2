import { Award, Shield, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import RegisterModal from 'shared/components/domain/login/RegisterModal';
import { showError, showSuccess } from 'shared/components/ui/FeedbackProvider';
import { TOAST_MESSAGES } from 'shared/constants/toast';
import AccountService from 'shared/services/AccountService';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

// Hook personalizado para animação de contadores
const useCountUp = (end: number, duration: number = 2000, isVisible: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Função de easing para animação suave
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isVisible]);

  return count;
};

// Hook para detectar quando o elemento está visível
const useIntersectionObserver = (ref: React.RefObject<Element>, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isVisible;
};

const About: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsVisible = useIntersectionObserver(statsRef, { threshold: 0.3 });

  // Configuração dos contadores animados
  const clientsCount = useCountUp(500, 2000, isStatsVisible);
  const transactionsCount = useCountUp(50, 2500, isStatsVisible);
  const availabilityCount = useCountUp(99.9, 2000, isStatsVisible);
  const ratingCount = useCountUp(4.8, 1800, isStatsVisible);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const newAccount = await AccountService.createAccount(name, email, password);

      // Toast para cadastro
      showSuccess(`Conta criada para ${name}!`);

      // Fechar modal após sucesso
      setRegisterModalOpen(false);

    } catch (error) {
      console.error('Error creating account:', error);

      // Toast de erro
      showError(TOAST_MESSAGES.REGISTER_ERROR);

      throw error; // Re-lançar o erro para o modal tratar
    }
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} showAuthButtons={true} />

      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sobre nós
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Revolucionando o futuro das finanças digitais com tecnologia de ponta e foco no cliente
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Nossa História */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Nossa História
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="text-xl mb-6">
                Fundado em 2025, o ByteBank nasceu da visão de democratizar o acesso a serviços
                financeiros de qualidade. Nossa jornada começou quando identificamos a necessidade
                de uma solução bancária verdadeiramente digital, transparente e centrada no usuário.
              </p>
              <p className="mb-6">
                Desde então, temos trabalhado incansavelmente para construir uma plataforma que
                combina tecnologia de ponta com simplicidade de uso. Nossa equipe multidisciplinar
                de especialistas em tecnologia, finanças e experiência do usuário desenvolve
                soluções que realmente fazem a diferença na vida das pessoas.
              </p>
              <p>
                Hoje, o ByteBank representa mais do que um banco digital - somos um ecossistema
                financeiro completo que capacita nossos clientes a tomar decisões financeiras
                inteligentes e alcançar seus objetivos pessoais e profissionais com confiança
                e segurança.
              </p>
            </div>
          </div>

          {/* Nossos Valores */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Segurança</h3>
                <p className="text-gray-600">
                  Protegemos seus dados e transações com os mais altos padrões de segurança digital.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Foco no Cliente</h3>
                <p className="text-gray-600">
                  Desenvolvemos soluções pensando sempre na melhor experiência para nossos usuários.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Excelência</h3>
                <p className="text-gray-600">
                  Buscamos constantemente a perfeição em cada detalhe dos nossos serviços.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Inovação</h3>
                <p className="text-gray-600">
                  Estamos sempre na vanguarda da tecnologia financeira para oferecer o melhor.
                </p>
              </div>
            </div>
          </div>

          {/* Missão, Visão e Valores */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Transformar a experiência bancária através de tecnologia inovadora, oferecendo
                soluções financeiras simples, transparentes e acessíveis que empoderam nossos
                clientes a alcançar seus objetivos financeiros com confiança e facilidade.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser reconhecido como o banco digital mais confiável e inovador do Brasil,
                liderando a revolução fintech e estabelecendo novos padrões de excelência
                em serviços financeiros digitais para pessoas e empresas.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Nossos Princípios</h3>
              <p className="text-gray-600 leading-relaxed">
                Transparência total, inovação constante, segurança absoluta e foco
                incondicional no cliente. Acreditamos que a tecnologia deve servir às
                pessoas, tornando a vida financeira mais simples e eficiente para todos.
              </p>
            </div>
          </div>

          {/* Estatísticas e Conquistas */}
          <div className="bg-primary-50 rounded-2xl p-8 mb-16" ref={statsRef}>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Nossos Números
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-primary-700 mb-2 transition-all duration-300">
                  {clientsCount.toLocaleString()}K+
                </div>
                <div className="text-gray-600">Clientes Ativos</div>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-primary-700 mb-2 transition-all duration-300">
                  {transactionsCount}M+
                </div>
                <div className="text-gray-600">Transações Realizadas</div>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-primary-700 mb-2 transition-all duration-300">
                  {availabilityCount.toFixed(1)}%
                </div>
                <div className="text-gray-600">Disponibilidade</div>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-primary-700 mb-2 transition-all duration-300">
                  {ratingCount.toFixed(1)}★
                </div>
                <div className="text-gray-600">Avaliação dos Usuários</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Faça parte da revolução financeira
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já escolheram o ByteBank para transformar
              sua relação com o dinheiro. Simples, seguro e sempre inovando.
            </p>
            <button
              className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              onClick={() => setRegisterModalOpen(true)}
            >
              Abra sua conta gratuita
            </button>
          </div>
        </div>
      </div>


      <Footer />
      </div>

      {/* Overlay da sidebar mobile - backdrop */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] xl:hidden"
        />
      )}

      {/* Sidebar mobile como overlay */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white-50 shadow-xl z-[9999] transform transition-transform duration-300 xl:hidden
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          currentPath="/sobre"
        />
      </div>

      {/* Modal de Cadastro */}
      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          // Aqui você pode adicionar lógica para abrir o modal de login se necessário
        }}
      />
    </>
  );
};export default About;
