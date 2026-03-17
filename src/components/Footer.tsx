import { Link } from 'react-router-dom';
import GoldLine from '@/components/GoldLine';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cadarn-navy text-cadarn-offwhite">
      <GoldLine />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Cadarn Martech" className="h-8 w-8 object-contain" />
              <span className="font-bold tracking-wide">CADARN MARTECH</span>
            </div>
            <p className="text-cadarn-offwhite/70 text-sm leading-relaxed">
              Marketing e tecnologia com estratégia.<br />
              Beleza com estratégia é lucro.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-sm tracking-wider mb-4 text-cadarn-caramelo">
              NAVEGAÇÃO
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-cadarn-offwhite/70 hover:text-cadarn-offwhite transition-colors">
                Home
              </Link>
              <Link to="/servicos" className="text-sm text-cadarn-offwhite/70 hover:text-cadarn-offwhite transition-colors">
                Serviços
              </Link>
              <Link to="/sobre" className="text-sm text-cadarn-offwhite/70 hover:text-cadarn-offwhite transition-colors">
                Sobre
              </Link>
              <Link to="/contato" className="text-sm text-cadarn-offwhite/70 hover:text-cadarn-offwhite transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm tracking-wider mb-4 text-cadarn-caramelo">
              CONTATO
            </h4>
            <div className="flex flex-col gap-2 text-sm text-cadarn-offwhite/70">
              <a
                href="mailto:contato@cadarnmartech.com.br"
                className="hover:text-cadarn-offwhite transition-colors"
              >
                contato@cadarnmartech.com.br
              </a>
              <span>São Paulo, Brasil</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cadarn-caramelo/20 text-center text-xs text-cadarn-offwhite/50">
          &copy; {currentYear} Cadarn Martech. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
