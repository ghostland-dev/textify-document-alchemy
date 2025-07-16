import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, FileSpreadsheet, Presentation, Image, ArrowRight, File, Download } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

type ConversionFormat = "word" | "excel" | "powerpoint" | "jpeg";

const PdfToFormats = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>("word");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const formatOptions = [
    {
      type: "word" as ConversionFormat,
      name: "Word",
      description: "Convertir en document Word (.docx)",
      icon: <FileText className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      type: "excel" as ConversionFormat,
      name: "Excel",
      description: "Convertir en feuille de calcul (.xlsx)",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      type: "powerpoint" as ConversionFormat,
      name: "PowerPoint",
      description: "Convertir en présentation (.pptx)",
      icon: <Presentation className="h-6 w-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      type: "jpeg" as ConversionFormat,
      name: "JPEG",
      description: "Convertir en images (.jpg)",
      icon: <Image className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => file.type === "application/pdf");
    
    if (pdfFiles.length !== files.length) {
      toast({
        title: "Attention",
        description: "Seuls les fichiers PDF sont acceptés",
        variant: "destructive"
      });
    }
    
    if (pdfFiles.length > 20) {
      toast({
        title: "Limite dépassée",
        description: "Vous ne pouvez sélectionner que 20 fichiers maximum",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFiles(pdfFiles);
    setConvertedFiles([]);
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un fichier PDF",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      // Simulation de la conversion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const converted = selectedFiles.map(file => {
        const baseName = file.name.replace('.pdf', '');
        const extension = selectedFormat === 'word' ? '.docx' : 
                         selectedFormat === 'excel' ? '.xlsx' : 
                         selectedFormat === 'powerpoint' ? '.pptx' : '.jpg';
        return `${baseName}${extension}`;
      });
      
      setConvertedFiles(converted);
      
      toast({
        title: "Conversion réussie !",
        description: `${selectedFiles.length} fichier(s) converti(s) en ${formatOptions.find(f => f.type === selectedFormat)?.name}`
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

  const handleDownload = (filename: string) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${filename} en cours...`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl">
              <File className="h-8 w-8 text-accent" />
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Convertir vos{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PDF
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Convertissez vos fichiers PDF vers Word, Excel, PowerPoint, ou JPEG en ligne gratuitement, 
            avec des résultats de haute qualité et un partage facile.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Format selection */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle>Sélectionnez le format de conversion</CardTitle>
              <CardDescription>
                Choisissez le format dans lequel vous souhaitez convertir vos fichiers PDF
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formatOptions.map((format) => (
                  <button
                    key={format.type}
                    onClick={() => setSelectedFormat(format.type)}
                    className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                      selectedFormat === format.type
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`inline-flex p-2 rounded-lg mb-3 ${format.bgColor}`}>
                      <span className={format.color}>{format.icon}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{format.name}</h3>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File upload */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Téléchargez vos fichiers PDF
              </CardTitle>
              <CardDescription>
                Sélectionnez jusqu'à 20 fichiers PDF à convertir
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  id="pdf-files"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="pdf-files" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Cliquez pour sélectionner vos fichiers PDF</p>
                    <p className="text-sm text-muted-foreground">
                      Ou glissez-déposez vos fichiers ici (jusqu'à 20 fichiers)
                    </p>
                  </div>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">{selectedFiles.length} fichier(s) sélectionné(s) :</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm bg-muted/50 rounded p-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-muted-foreground ml-auto">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleConvert}
                disabled={selectedFiles.length === 0 || isConverting}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {isConverting ? (
                  "Conversion en cours..."
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Convertir en {formatOptions.find(f => f.type === selectedFormat)?.name}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {convertedFiles.length > 0 && (
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Fichiers convertis
                </CardTitle>
                <CardDescription>
                  Vos fichiers sont prêts à être téléchargés
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {convertedFiles.map((filename, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        {formatOptions.find(f => f.type === selectedFormat)?.icon}
                        <span className="font-medium">{filename}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(filename)}
                      >
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button variant="gradient" className="w-full">
                  <Download className="h-4 w-4" />
                  Télécharger tous les fichiers
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Implementation note */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Note d'implémentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cette interface de démonstration montre la conversion PDF vers différents formats. 
              Pour une implémentation complète, il faudrait intégrer des services comme Adobe PDF Services API, 
              PDFtron, ou d'autres solutions de conversion de documents professionnelles.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PdfToFormats;