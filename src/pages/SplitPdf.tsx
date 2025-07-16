import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, FileText, Download, Scissors } from 'lucide-react';
import Header from '@/components/Header';

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [splitMethod, setSplitMethod] = useState<string>('pages');
  const [pageRanges, setPageRanges] = useState('');
  const [pagesPerFile, setPagesPerFile] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitFiles, setSplitFiles] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive"
      });
    }
  };

  const handleSplit = async () => {
    if (!file) {
      toast({
        title: "Aucun fichier",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive"
      });
      return;
    }

    if (splitMethod === 'ranges' && !pageRanges.trim()) {
      toast({
        title: "Plages manquantes",
        description: "Veuillez spécifier les plages de pages",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulation du processus de division
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Simulation des fichiers résultants
          const mockFiles = splitMethod === 'pages' 
            ? Array.from({ length: Math.ceil(10 / parseInt(pagesPerFile)) }, (_, i) => 
                `${file.name.replace('.pdf', '')}_part_${i + 1}.pdf`)
            : pageRanges.split(',').map((range, i) => 
                `${file.name.replace('.pdf', '')}_pages_${range.trim()}.pdf`);
                
          setSplitFiles(mockFiles);
          toast({
            title: "Division terminée",
            description: `Le PDF a été divisé en ${mockFiles.length} fichiers`
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = (filename: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de ${filename}`
    });
  };

  const handleDownloadAll = () => {
    toast({
      title: "Téléchargement en cours",
      description: "Téléchargement de tous les fichiers dans une archive ZIP"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Diviser un PDF</h1>
              <p className="text-muted-foreground mt-1">
                Séparez un fichier PDF en plusieurs documents
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner le fichier PDF</CardTitle>
                <CardDescription>
                  Choisissez le fichier PDF que vous souhaitez diviser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Glissez-déposez votre fichier PDF ici</p>
                    <p className="text-muted-foreground">ou cliquez pour le sélectionner</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="mt-4">
                    Choisir un fichier
                  </Button>
                </div>
                
                {file && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Split Options */}
            {file && (
              <Card>
                <CardHeader>
                  <CardTitle>Options de division</CardTitle>
                  <CardDescription>
                    Choisissez comment vous souhaitez diviser votre PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={splitMethod} onValueChange={setSplitMethod}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pages" id="pages" />
                        <Label htmlFor="pages" className="font-medium">
                          Diviser par nombre de pages
                        </Label>
                      </div>
                      
                      {splitMethod === 'pages' && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor="pagesPerFile">Nombre de pages par fichier</Label>
                          <Input
                            id="pagesPerFile"
                            type="number"
                            min="1"
                            value={pagesPerFile}
                            onChange={(e) => setPagesPerFile(e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ranges" id="ranges" />
                        <Label htmlFor="ranges" className="font-medium">
                          Diviser par plages de pages
                        </Label>
                      </div>
                      
                      {splitMethod === 'ranges' && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor="pageRanges">
                            Plages de pages (ex: 1-3, 4-7, 8-10)
                          </Label>
                          <Input
                            id="pageRanges"
                            placeholder="1-3, 4-7, 8-10"
                            value={pageRanges}
                            onChange={(e) => setPageRanges(e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Séparez les plages par des virgules. Ex: 1-3, 5-8, 10
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="each" id="each" />
                        <Label htmlFor="each" className="font-medium">
                          Une page par fichier
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={handleSplit}
                      disabled={isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      <Scissors className="h-4 w-4 mr-2" />
                      {isProcessing ? "Division en cours..." : "Diviser le PDF"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress */}
            {isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle>Division en cours</CardTitle>
                  <CardDescription>
                    Veuillez patienter pendant la division du fichier...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="w-full" />
                  <p className="text-center mt-2 text-sm text-muted-foreground">
                    {progress}% terminé
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {splitFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Division terminée</CardTitle>
                  <CardDescription>
                    Votre PDF a été divisé en {splitFiles.length} fichiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {splitFiles.map((filename, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">{filename}</p>
                            <p className="text-sm text-green-700">Fichier PDF</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(filename)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button onClick={handleDownloadAll} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger tous les fichiers (ZIP)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPdf;