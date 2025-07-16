import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, FileText, Type, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

const TextToPdf = () => {
  const [text, setText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleConvertToPdf = async () => {
    if (!text.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du texte à convertir",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      // Add title
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text("Document converti", margin, margin);
      
      // Add content
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text(lines, margin, margin + 20);
      
      // Download the PDF
      pdf.save("document-converti.pdf");
      
      toast({
        title: "Succès !",
        description: "Votre document PDF a été téléchargé"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la conversion",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
              <Type className="h-8 w-8 text-primary" />
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl">
              <FileText className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Convertir du{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              texte en PDF
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformez votre texte en un document PDF professionnel en quelques secondes
          </p>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Saisissez votre texte
            </CardTitle>
            <CardDescription>
              Tapez ou collez le texte que vous souhaitez convertir en PDF
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text-input">Contenu du document</Label>
              <Textarea
                id="text-input"
                placeholder="Saisissez votre texte ici..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {text.length} caractères
              </p>
              
              <Button 
                onClick={handleConvertToPdf}
                disabled={!text.trim() || isConverting}
                variant="gradient"
                size="lg"
              >
                {isConverting ? (
                  "Conversion en cours..."
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Télécharger le PDF
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TextToPdf;