import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { BrainCircuit, Calendar, ListTodo, PlusCircle, BookOpen } from "lucide-react"

interface AICommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AICommandBar({ open, onOpenChange }: AICommandBarProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Criar nova tarefa</span>
          </CommandItem>
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Agendar evento para amanhã às 10h</span>
          </CommandItem>
          <CommandItem>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Mostrar minhas tarefas pendentes</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ações">
           <CommandItem>
            <BrainCircuit className="mr-2 h-4 w-4" />
            <span>Adicionar à Base de Conhecimento</span>
          </CommandItem>
          <CommandItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Criar Tarefa</span>
          </CommandItem>
          <CommandItem>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Adicionar Conhecimento</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}