import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Adicionar importação
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from './ui/button';

interface ProgressDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  currentStep: string;
  currentStepIndex: number; // Índice da etapa atual (0-based)
  totalSteps: number; // Número total de etapas principais
  error?: string | null;
  isComplete?: boolean;
}

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  currentStep,
  currentStepIndex,
  totalSteps,
  error,
  isComplete,
}) => {
  // Calcula o progresso. +1 no index porque é 0-based.
  // Se completo, 100%. Se erro, mantém o progresso da última etapa bem-sucedida.
  const progressValue = isComplete
    ? 100
    : totalSteps > 0
    ? Math.max(0, (currentStepIndex / totalSteps) * 100) // Mostra progresso das etapas concluídas
    : 0;

  // Determina se o botão de fechar deve ser mostrado e se o fechamento externo é permitido
  const allowClose = !!error || !!isComplete;

  return (
    <Dialog open={isOpen} onOpenChange={allowClose ? onOpenChange : undefined}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          if (!allowClose) e.preventDefault(); // Impede fechar clicando fora enquanto carrega
        }}
        // A propriedade hideCloseButton foi removida. O controle será feito abaixo.
      >
        {/* Renderiza o botão de fechar ('x') apenas se allowClose for true */}
        {allowClose && (
          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <i className="ri-close-line h-4 w-4"></i>
              <span className="sr-only">Fechar</span>
            </button>
          </DialogClose>
        )}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            {/* Ícone de progresso, sucesso ou erro */}
            {error ? (
              <i className="ri-error-warning-line h-5 w-5 text-destructive animate-pulse"></i>
            ) : isComplete ? (
              <i className="ri-check-double-line h-5 w-5 text-success"></i>
            ) : (
              <i className="ri-loader-4-line h-5 w-5 animate-spin"></i>
            )}
            <span className={`text-sm font-medium ${error ? 'text-destructive' : isComplete ? 'text-success' : 'text-foreground'}`}>
              {currentStep || (error ? "Erro" : isComplete ? "Concluído" : "Processando...")}
            </span>
          </div>
          {/* Mostra a barra de progresso apenas durante o processamento */}
          {!error && !isComplete && totalSteps > 0 && (
            <Progress value={progressValue} className="w-full h-2" />
          )}
          {/* Exibe a mensagem de erro detalhada */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/30">
              <p className="font-semibold mb-1">Falha na operação</p>
              <p>{error}</p>
            </div>
          )}
           {/* Mensagem de sucesso */}
           {isComplete && !error && (
             <div className="text-sm text-success bg-success/10 p-3 rounded-md border border-success/30">
                <p className="font-semibold">Operação concluída com sucesso!</p>
             </div>
           )}
        </div>
        {/* Mostra o botão de fechar apenas se concluído ou com erro */}
        {allowClose && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};