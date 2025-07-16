import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, FileText, Download, X, Move } from 'lucide-react';
import Header from '@/components/Header';

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast({
        title: "Fichiers non supportés",
        description: "Seuls les fichiers PDF sont acceptés",
        variant: "destructive"
      });
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < files.length) {
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Fichiers insuffisants",
        description: "Veuillez sélectionner au moins 2 fichiers PDF",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulation du processus de fusion
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setMergedFile("merged_document.pdf");
          toast({
            title: "Fusion terminée",
            description: "Vos PDF ont été fusionnés avec succès"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = () => {
    toast({
      title: "Téléchargement en cours",
      description: "Le fichier fusionné va être téléchargé"
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
              <h1 className="text-3xl font-bold">Fusionner des PDF</h1>
              <p className="text-muted-foreground mt-1">
                Combinez plusieurs fichiers PDF en un seul document
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner les fichiers PDF</CardTitle>
                <CardDescription>
                  Choisissez les fichiers PDF que vous souhaitez fusionner. L'ordre peut être modifié.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Glissez-déposez vos fichiers PDF ici</p>
                    <p className="text-muted-foreground">ou cliquez pour les sélectionner</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="mt-4">
                    Choisir des fichiers
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Files List */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Fichiers sélectionnés ({files.length})</CardTitle>
                  <CardDescription>
                    Réorganisez l'ordre des fichiers selon vos besoins
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveFile(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveFile(index, 'down')}
                            disabled={index === files.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={handleMerge}
                      disabled={files.length < 2 || isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? "Fusion en cours..." : "Fusionner les PDF"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress */}
            {isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle>Fusion en cours</CardTitle>
                  <CardDescription>
                    Veuillez patienter pendant la fusion des fichiers...
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

            {/* Result */}
            {mergedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Fusion terminée</CardTitle>
                  <CardDescription>
                    Votre fichier PDF fusionné est prêt à être téléchargé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">{mergedFile}</p>
                        <p className="text-sm text-green-700">Fichier PDF fusionné</p>
                      </div>
                    </div>
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
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

export default MergePdf;