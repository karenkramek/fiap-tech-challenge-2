import React from "react";

const Footer: React.FC = () => {
   return (
      <footer className="bg-primary-700 text-white-50 shadow-md">
         <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8">
               {/* Serviços */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Serviços</h3>
                  <ul className="space-y-2">
                     <li>
                        <a href="#" className="text-white hover:text-white transition-colors">
                           Conta corrente
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-white hover:text-white transition-colors">
                           Conta PJ
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-white hover:text-white transition-colors">
                           Cartão de crédito
                        </a>
                     </li>
                  </ul>
               </div>

               {/* Contato */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Contato</h3>
                  <ul className="space-y-2">
                     <li>
                        <a href="tel:08000042508" className="text-white hover:text-white transition-colors">
                           0800 004 250 08
                        </a>
                     </li>
                     <li>
                        <a href="mailto:meajuda@bytebank.com.br" className="text-white hover:text-white transition-colors">
                           meajuda@bytebank.com.br
                        </a>
                     </li>
                     <li>
                        <a href="mailto:ouvidoria@bytebank.com.br" className="text-white hover:text-white transition-colors">
                           ouvidoria@bytebank.com.br
                        </a>
                     </li>
                  </ul>
               </div>

               {/* Desenvolvido por Bytebank */}
               <div>
                  <div className="flex flex-col items-start md:items-end">
                     <div className="mb-4">
                        <p className="text-white text-sm mb-2">Desenvolvido por</p>
                        <div className="text-2xl font-bold text-white">Bytebank</div>
                     </div>

                  </div>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
