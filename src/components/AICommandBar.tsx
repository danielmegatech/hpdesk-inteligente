import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { BrainCircuit, Calendar, ListTodo, PlusCircle, BookOpen, Download } from "lucide-react"
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AICommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTriggerAddTask?: (initialTitle?: string, initialDescription?: string) => void;
  onTriggerAddKnowledge?: (initialTitle?: string, initialContent?: string, initialCategory?: string) => void;
  onTriggerExportFlow?: () => void;
}

export function AICommandBar({ open, onOpenChange, onTriggerAddTask, onTriggerAddKnowledge, onTriggerExportFlow }: AICommandBarProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!open) {
      setInputValue(""); // Clear input when dialog closes
    }
  }, [open]);

  const handleCommand = (command: string) => {
    setInputValue(command); // Set input value to the selected command
    // Simulate processing the command
    setTimeout(() => {
      if (command.toLowerCase().includes("criar nova tarefa")) {
        const titleMatch = command.match(/título "(.*?)"/i);
        const descMatch = command.match(/descrição "(.*?)"/i);
        onTriggerAddTask?.(titleMatch?.[1], descMatch?.[1]);
        toast.info("A abrir formulário de nova tarefa...");
      } else if (command.toLowerCase().includes("adicionar conhecimento")) {
        const titleMatch = command.match(/título "(.*?)"/i);
        const contentMatch = command.match(/conteúdo "(.*?)"/i);
        const categoryMatch = command.match(/categoria "(.*?)"/i);
        onTriggerAddKnowledge?.(titleMatch?.[1], contentMatch?.[1], categoryMatch?.[1]);
        toast.info("A abrir formulário de novo artigo...");
      } else if (command.toLowerCase().includes("exportar fluxo")) {
        onTriggerExportFlow?.();
      } else {
        toast.info(`Comando "${command}" recebido. (Funcionalidade em desenvolvimento)`);
      }
      onOpenChange(false); // Close command bar after action
    }, 200);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Digite um comando ou pesquise..." 
        value={inputValue}
        onValueChange={setInputValue}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem onSelect={() => handleCommand("Criar nova tarefa com título 'Verificar email' e descrição 'Problema de acesso ao Outlook'")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Criar nova tarefa</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Agendar evento para amanhã às 10h")}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Agendar evento para amanhã às 10h</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Mostrar minhas tarefas pendentes")}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Mostrar minhas tarefas pendentes</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ações">
           <CommandItem onSelect={() => handleCommand("Adicionar conhecimento com título 'Guia VPN' e conteúdo 'Passos para configurar VPN' na categoria 'Rede'")}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            <span>Adicionar à Base de Conhecimento</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Criar Tarefa")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Criar Tarefa</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Adicionar Conhecimento")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Adicionar Conhecimento</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand("Exportar fluxo de trabalho")}>
            <Download className="mr-2 h-4 w-4" />
            <span>Exportar Fluxo de Trabalho</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}