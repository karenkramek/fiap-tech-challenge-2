// Constantes de rotas para toda a aplicação
export const PUBLIC_ROUTES = [
  '/',           // Home
  '/about',      // Sobre (futuro)
  '/contact',    // Contato (futuro)
  '/help',       // Ajuda (futuro)
  '/terms',      // Termos (futuro)
  '/privacy'     // Privacidade (futuro)
] as const;

export const PROTECTED_ROUTES = [
  '/dashboard',     // Dashboard principal
  '/transactions'   // Página de transações
] as const;

export const DEFAULT_REDIRECT_ROUTE = '/';
