import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Lucide icons removed, using Remix Icon classes now

const DatabasePage = () => {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Gerenciamento do Banco de Dados</h1> {/* Added font-display */}
          <p className="text-muted-foreground">
            Informações sobre o armazenamento de dados
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="ri-database-2-line h-5 w-5"></i>
              Informações do Banco de Dados
            </CardTitle>
            <CardDescription>
              Como seus dados são armazenados e gerenciados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Esta aplicação utiliza o Supabase para armazenar e gerenciar seus dados de rede (racks, equipamentos, mapeamentos de porta).
                  Todos os dados são persistidos no banco de dados na nuvem.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Você pode gerenciar seus dados diretamente através da interface da aplicação nas páginas Racks, Equipamentos e Mapeamentos de Portas.
                  A funcionalidade de exportação/importação manual do banco de dados não está mais disponível, pois os dados são gerenciados centralmente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DatabasePage;
