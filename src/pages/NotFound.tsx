
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
// Removido import do HomeIcon do lucide-react, usando Remix Icons via CSS

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="mb-6">
          <i className="ri-error-warning-line text-8xl text-network-lightBlue"></i>
        </div>
        <h1 className="text-9xl font-bold text-network-lightBlue">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-2">Página Não Encontrada</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Não conseguimos encontrar a página que você está procurando. O link pode estar incorreto ou a página pode ter sido movida.
        </p>
        <Button asChild>
          <a href="/">
            <i className="ri-home-line mr-2 h-4 w-4"></i>
            Voltar para Início
          </a>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
