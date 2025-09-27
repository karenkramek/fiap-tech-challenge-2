import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Força o scroll para o topo sempre que a rota mudar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instantâneo, sem animação suave
    });
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
