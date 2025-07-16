import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Copy, ArrowRight, File } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const PdfToText = () => {
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setExtractedText("");
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF valide",
        variant: "destructive"
      });
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    
    try {
      // Note: For a full implementation, you would use a library like pdf-parse
      // For now, we'll show a demo with placeholder text
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      const demoText = `Ceci est un exemple de texte extrait du fichier PDF "${selectedFile.name}".
      
Dans une implémentation complète, le contenu réel du PDF serait extrait ici.

Pour une extraction complète du texte des PDF, vous pourriez utiliser :
- Des bibliothèques côté serveur comme pdf-parse
- Des services d'API comme Adobe PDF Services
- Des solutions cloud comme Google Cloud Document AI

Le fichier sélectionné fait ${(selectedFile.size / 1024).toFixed(1)} KB.`;
      
      setExtractedText(demoText);
      
      toast({
        title: "Succès !",
        description: "Le texte a été extrait du PDF"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'extraction",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      toast({
        title: "Copié !",
        description: "Le texte a été copié dans le presse-papiers"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
              <File className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Extraire le texte d'un{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PDF
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convertissez le contenu de vos fichiers PDF en texte éditable
          </p>
        </div>

        <div className="grid gap-6">
          {/* Upload section */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Sélectionnez votre fichier PDF
              </CardTitle>
              <CardDescription>
                Choisissez le fichier PDF dont vous souhaitez extraire le texte
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pdf-input">Fichier PDF</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="pdf-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="pdf-input"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {selectedFile ? selectedFile.name : "Cliquez pour sélectionner un fichier"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile 
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                          : "Formats acceptés : PDF uniquement"
                        }
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              
              <Button 
                onClick={handleExtractText}
                disabled={!selectedFile || isExtracting}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {isExtracting ? (
                  "Extraction en cours..."
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Extraire le texte
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results section */}
          {extractedText && (
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Texte extrait
                </CardTitle>
                <CardDescription>
                  Le contenu de votre PDF a été converti en texte
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="extracted-text">Contenu extrait</Label>
                  <Textarea
                    id="extracted-text"
                    value={extractedText}
                    readOnly
                    className="min-h-[300px] resize-none bg-muted/30"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {extractedText.length} caractères extraits
                  </p>
                  
                  <Button onClick={copyToClipboard} variant="outline">
                    <Copy className="h-4 w-4" />
                    Copier le texte
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Note about implementation */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Note d'implémentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cette démonstration montre l'interface d'extraction de texte PDF. 
              Pour une implémentation complète en production, il faudrait intégrer 
              des bibliothèques comme pdf-parse côté serveur ou utiliser des services 
              d'API spécialisés pour une extraction de texte robuste.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PdfToText;