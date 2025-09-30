import { Building2, CreditCard, Shield, Star } from "lucide-react";
import React, { useEffect, useRef } from "react";
import "../styles/Home.css";
import Footer from "./Footer";

const Home: React.FC = () => {
   const interactiveBubbleRef = useRef<HTMLDivElement>(null);
   const animationFrameRef = useRef<number>();

   useEffect(() => {
      const interBubble = interactiveBubbleRef.current;
      if (!interBubble) return;

      let curX = 0;
      let curY = 0;
      let tgX = 0;
      let tgY = 0;

      function move() {
         curX += (tgX - curX) / 20;
         curY += (tgY - curY) / 20;
         if (interBubble) {
            interBubble.style.transform = `translate(${Math.round(
               curX
            )}px, ${Math.round(curY)}px)`;
         }
         animationFrameRef.current = requestAnimationFrame(move);
      }

      const handleMouseMove = (event: MouseEvent) => {
         tgX = event.clientX;
         tgY = event.clientY;
      };

      window.addEventListener("mousemove", handleMouseMove);
      move();

      // Cleanup function
      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
         if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
         }
      };
   }, []);

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Hero Section */}
         <div className="relative py-20 overflow-hidden">
            {/* Animated Background */}
            <div className="gradient-bg">
               <svg xmlns="http://www.w3.org/2000/svg">
                  <defs>
                     <filter id="goo">
                        <feGaussianBlur
                           in="SourceGraphic"
                           stdDeviation="10"
                           result="blur"
                        />
                        <feColorMatrix
                           in="blur"
                           mode="matrix"
                           values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                           result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                     </filter>
                  </defs>
               </svg>
               <div className="gradients-container">
                  <div className="g1"></div>
                  <div className="g2"></div>
                  <div className="g3"></div>
                  <div className="g4"></div>
                  <div className="g5"></div>
                  <div className="interactive" ref={interactiveBubbleRef}></div>
               </div>
               <div className="gradients-container">
                  <div className="g1"></div>
                  <div className="g2"></div>
                  <div className="g3"></div>
                  <div className="g4"></div>
                  <div className="g5"></div>
                  <div className="interactive"></div>
               </div>
            </div>

            {/* Content overlay */}
            <div className="container mx-auto px-4 relative z-10">
               <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[500px] max-w-7xl mx-auto">
                  <div className="lg:col-span-8 text-center lg:text-left">
                     {/* Main heading */}
                     <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                        Experimente mais
                        <br /> liberdade no controle
                        <br /> da sua vida financeira
                     </h1>

                     <p className="text-xl text-white/90 mb-8">
                        Crie sua conta Bytebank e aproveite todos os benefícios.
                     </p>
                  </div>

                  <div className="lg:col-span-4 hidden lg:flex justify-center items-center">
                     <img
                        src="/images/hero-image.png"
                        alt="Controle da vida financeira"
                        className="w-full max-w-md h-96 object-contain"
                     />
                  </div>
               </div>
            </div>
         </div>
         <div className="py-28 bg-white">
            <div className="container mx-auto px-4">
               <h2 className="text-4xl font-bold text-center text-black mb-12">
                  Conheça as vantagens do nosso banco
               </h2>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                  <div className="bg-black text-black rounded-lg p-8 transition-colors shadow">
                     <div className="mb-6">
                        <CreditCard className="h-12 w-12 text-black" />
                     </div>
                     <h3 className="text-xl font-bold mb-4 text-primary-700">
                        Dashboard
                     </h3>
                     <p className="text-black-400 mb-6 text-sm leading-relaxed">
                        Visualize seu saldo atual, adicione novas transações e
                        acompanhe suas finanças.
                     </p>
                  </div>
                  <div className="bg-black text-black rounded-lg p-8 transition-colors shadow">
                     <div className="mb-6">
                        <Building2 className="h-12 w-12 text-black" />
                     </div>
                     <h3 className="text-xl font-bold mb-4 text-primary-700">
                        Transações
                     </h3>
                     <p className="text-black-400 mb-6 text-sm leading-relaxed">
                        Gerencie todas suas transações, visualize o extrato
                        completo e edite registros.
                     </p>
                  </div>

                  <div className="bg-black text-black rounded-lg p-8 transition-colors shadow">
                     <div className="mb-6">
                        <Star className="h-12 w-12 text-black" />
                     </div>
                     <h3 className="text-xl font-bold mb-4 text-primary-700">
                        Programa de pontos
                     </h3>
                     <p className="text-black-400 text-sm leading-relaxed">
                        Você pode acumular pontos com suas compras no crédito
                        sem pagar mensalidade!
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
                        Seus dispositivos móveis (computador e laptop)
                        protegidos por uma mensalidade simbólica.
                     </p>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
};

export default Home;
