import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* HERO */}
      <section className="relative text-center py-20 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-6">
          Bem-vindo ao Bytebank
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          O banco digital mais inovador do mercado. Aqui você explora
          como seria ter uma conta em um banco de verdade — mas com zero taxas e
          100% diversão.
        </p>
      </section>

      {/* SOBRE */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Quem Somos</h2>
        <p className="text-center text-gray-700 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
          No Bytebank, acreditamos que até uma simulação pode ser uma experiência
          real. Criamos um ambiente para explorar, aprender e se divertir com o
          universo financeiro digital sem preocupações ou burocracias.
        </p>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Missão
            </h3>
            <p className="text-gray-600">
              Simplificar o mundo financeiro de forma divertida e acessível,
              mostrando como a tecnologia pode transformar até os conceitos mais
              complexos.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-green-600 mb-4">
              Visão
            </h3>
            <p className="text-gray-600">
              Ser referência como o banco fictício mais inovador e criativo,
              inspirando novas formas de pensar sobre educação financeira.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-purple-600 mb-4">
              Valores
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Transparência em tudo que fazemos</li>
              <li>Inovação constante</li>
              <li>Confiança (😉)</li>
              <li>Criatividade e leveza</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-center text-white">
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Venha explorar o Bytebank e descubra como seria viver a experiência
          digital de um banco sem taxas, sem burocracia e com muito aprendizado.
        </p>

      </section>
    </main>
  );
}
