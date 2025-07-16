import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, FileText, Hash, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import jsPDF from "jspdf";
import { marked } from "marked";
import { useToast } from "@/hooks/use-toast";

const MarkdownToPdf = () => {
  const [markdown, setMarkdown] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleConvertToPdf = async () => {
    if (!markdown.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du contenu Markdown à convertir",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      // Convert markdown to HTML first
      const html = await marked(markdown);
      
      // Create a temporary div to convert HTML to text for PDF
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(plainText, maxWidth);
      
      // Add title
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text("Document Markdown converti", margin, margin);
      
      // Add content
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text(lines, margin, margin + 20);
      
      // Download the PDF
      pdf.save("markdown-converti.pdf");
      
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
              <Hash className="h-8 w-8 text-primary" />
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl">
              <FileText className="h-8 w-8 text-accent" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Convertir du{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Markdown en PDF
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformez votre contenu Markdown en un document PDF professionnel
          </p>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Saisissez votre Markdown
            </CardTitle>
            <CardDescription>
              Utilisez la syntaxe Markdown pour formater votre contenu
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="markdown-input">Contenu Markdown</Label>
              <Textarea
                id="markdown-input"
                placeholder="# Mon titre&#10;&#10;**Texte en gras** et *texte en italique*&#10;&#10;- Liste à puces&#10;- Autre élément&#10;&#10;## Sous-titre&#10;&#10;Du texte normal avec un [lien](https://example.com)..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="min-h-[300px] resize-none font-mono text-sm"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {markdown.length} caractères
              </p>
              
              <Button 
                onClick={handleConvertToPdf}
                disabled={!markdown.trim() || isConverting}
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

        {/* Markdown syntax help */}
        <Card className="mt-8 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg">Aide syntaxe Markdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2">Formatage de base :</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code className="bg-muted px-1 rounded"># Titre</code> - Titre principal</li>
                  <li><code className="bg-muted px-1 rounded">## Sous-titre</code> - Sous-titre</li>
                  <li><code className="bg-muted px-1 rounded">**gras**</code> - Texte en gras</li>
                  <li><code className="bg-muted px-1 rounded">*italique*</code> - Texte en italique</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Listes et liens :</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code className="bg-muted px-1 rounded">- élément</code> - Liste à puces</li>
                  <li><code className="bg-muted px-1 rounded">1. élément</code> - Liste numérotée</li>
                  <li><code className="bg-muted px-1 rounded">[texte](URL)</code> - Lien</li>
                  <li><code className="bg-muted px-1 rounded">`code`</code> - Code inline</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MarkdownToPdf;