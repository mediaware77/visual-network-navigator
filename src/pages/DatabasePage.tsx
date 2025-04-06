import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { seedDatabase, clearGeneratedData, type ProgressCallback, type ProgressUpdateData } from "@/lib/seedDb"; // Importar tipos de progresso
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { ProgressDialog } from "@/components/ProgressDialog"; // Importar o modal de progresso
const DatabasePage = () => {
  const [isLoading, setIsLoading] = useState(false); // Para desabilitar botões
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressState, setProgressState] = useState<ProgressUpdateData>({
    currentStep: "",
    currentStepIndex: 0,
    totalSteps: 0,
    error: null,
    isComplete: false,
  });
  const handleSeedData = async () => {
    setIsLoading(true);
    try {
      await seedDatabase();
      // Toast messages are handled within seedDatabase
    } catch (error) {
      console.error("Error seeding database from page:", error);
      toast.error("Erro ao popular o banco de dados."); // General fallback toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    setIsLoading(true); // Desabilita botões
    setProgressState({ // Reseta o estado do progresso
      currentStep: "Iniciando...",
      currentStepIndex: 0,
      totalSteps: 3, // Definido em clearGeneratedData
      error: null,
      isComplete: false,
    });
    setIsProgressModalOpen(true); // Abre o modal

    const onProgressUpdate: ProgressCallback = (data) => {
      setProgressState(data);
      // Se concluído ou erro, permite fechar o modal e reabilita botões
      if (data.isComplete || data.error) {
        setIsLoading(false);
      }
    };

    try {
      await clearGeneratedData(onProgressUpdate);
      // O sucesso final é sinalizado pelo onProgressUpdate com isComplete=true
    } catch (error) {
      // Captura erros que podem ocorrer *antes* do clearGeneratedData começar a reportar progresso
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao iniciar a limpeza.";
      console.error("Error initiating clear data process:", error);
      setProgressState(prev => ({ ...prev, currentStep: "Erro ao iniciar", error: errorMessage }));
      setIsLoading(false); // Garante que os botões sejam reabilitados
      // O modal já estará aberto e mostrará o erro
    }
    // Não precisamos de finally aqui, pois isLoading é controlado pelo onProgressUpdate ou catch
  };

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

        {/* Card for Seeding Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="ri-seedling-line h-5 w-5"></i> {/* Remix Icon for seeding */}
              Dados de Exemplo
            </CardTitle>
            <CardDescription>
              Popule ou limpe o banco de dados com dados gerados aleatoriamente para teste.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use os botões abaixo para adicionar um conjunto de racks, equipamentos (switches e patch panels) e mapeamentos de porta fictícios ao banco de dados. Isso é útil para testar a interface sem precisar inserir dados manualmente.
            </p>
             <p className="text-sm text-destructive font-medium mb-4">
               Atenção: A limpeza removerá TODOS os dados existentes. Use com cuidado.
             </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <ConfirmationDialog
              triggerButton={
                <Button variant="destructive" disabled={isLoading}>
                  <i className="ri-delete-bin-line mr-2 h-4 w-4"></i>
                  {isLoading ? "Limpando..." : "Limpar Todos os Dados"}
                </Button>
              }
              title="Confirmar Limpeza Total"
              description={
                <>
                  <p className="mb-2">
                    <strong>ATENÇÃO:</strong> Esta ação excluirá TODOS os racks, equipamentos e mapeamentos do banco de dados.
                  </p>
                  <p className="font-bold text-destructive">Esta ação NÃO PODE ser desfeita.</p>
                </>
              }
              confirmationText="Limpar todos os dados"
              confirmButtonLabel="Confirmar Limpeza"
              onConfirm={handleClearData}
              confirmButtonVariant="destructive"
            />
            <ConfirmationDialog
              triggerButton={
                <Button disabled={isLoading}>
                  <i className="ri-add-box-line mr-2 h-4 w-4"></i>
                  {isLoading ? "Populando..." : "Popular com Dados de Exemplo"}
                </Button>
              }
              title="Confirmar População com Dados de Exemplo"
              description={
                <p>
                  Esta ação adicionará dados fictícios ao banco de dados. Dados existentes podem ser afetados ou sobrescritos dependendo da implementação da função de seed.
                </p>
              }
              confirmationText="Popular com dados de exemplo" // Texto de confirmação ligeiramente diferente para evitar confusão
              confirmButtonLabel="Confirmar População"
              onConfirm={handleSeedData}
            />
          </CardFooter>
        </Card>

      </div>

      {/* Modal de Progresso */}
      <ProgressDialog
        isOpen={isProgressModalOpen}
        onOpenChange={setIsProgressModalOpen}
        title="Limpando Banco de Dados"
        description="Aguarde enquanto todos os dados são removidos."
        currentStep={progressState.currentStep}
        currentStepIndex={progressState.currentStepIndex}
        totalSteps={progressState.totalSteps}
        error={progressState.error}
        isComplete={progressState.isComplete}
      />
    </Layout>
  );
};

export default DatabasePage;
