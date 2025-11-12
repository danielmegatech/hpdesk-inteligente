import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

const HorizontalMindmap = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visualização de Atendimento</CardTitle>
        <CardDescription>
          Aqui será exibido o mindmap horizontal com a timeline do atendimento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/40">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Mindmap horizontal em desenvolvimento.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default HorizontalMindmap;