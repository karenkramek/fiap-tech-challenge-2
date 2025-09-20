// pages/sobre.tsx

export default function Sobre() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl bg-white rounded-lg shadow-lg p-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">Sobre o Projeto</h1>

        <p className="text-lg mb-6">
          Este é o projeto Tech Challenge para a pós-graduação em <strong>Front-end Engineering da FIAP</strong>.
          O objetivo é desenvolver o frontend para uma aplicação de gerenciamento financeiro, aplicando conceitos modernos de desenvolvimento web e programação orientada a objetos.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">🎥 Demo e Design</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-600">
            <li>
              📹 <a href="https://www.loom.com/share/35534aa22a264f7da957a72e228920e7?sid=1991a61a-66c3-4387-a536-83a96cf53144" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 transition">
                Assista à demonstração do projeto
              </a>
            </li>
            <li>
              🎨 <a href="https://www.figma.com/design/Y2JoXXiG50h2nj9FiG71i7/ByteBank-4FRNT---Fase1?node-id=0-1&p=f&t=vmoSPz2lFa4bemW4-0" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 transition">
                Visualize o protótipo e design no Figma
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">✨ Funcionalidades Principais</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>🏠 <strong>Dashboard Intuitivo:</strong> Visualização clara do saldo e extrato de transações</li>
            <li>📊 <strong>Gestão de Transações:</strong> Listagem completa com opções de visualizar, editar e deletar</li>
            <li>➕ <strong>Adicionar Transações:</strong> Formulário simples para registrar novas movimentações</li>
            <li>✏️ <strong>Edição de Registros:</strong> Modificação rápida de transações existentes</li>
            <li>🎨 <strong>Design System:</strong> Interface consistente e responsiva com Tailwind CSS</li>
            <li>🔧 <strong>TypeScript:</strong> Tipagem estática para maior robustez do código</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">⚡ Tecnologias Utilizadas</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Next.js</strong>: Framework React para SSR e SSG</li>
            <li><strong>React</strong>: Biblioteca para UI</li>
            <li><strong>TypeScript</strong>: Tipagem estática</li>
            <li><strong>Tailwind CSS</strong>: Estilização com utilitários</li>
            <li><strong>json-server</strong>: API mock para simular backend</li>
          </ul>
        </section>


      </div>
    </main>
  )
}
