import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Hash, ArrowRight, Eye, EyeOff, Bold, Italic, List, Heading, Link, Image, Code, Quote, Settings, File, Maximize, Palette } from "lucide-react";
import Header from "@/components/Header";
import MarkdownPreview from "@/components/MarkdownPreview";
import jsPDF from "jspdf";
import { marked } from "marked";
import { useToast } from "@/hooks/use-toast";
import { useHotkeys } from "react-hotkeys-hook";

const MarkdownToPdf = () => {
  const [markdown, setMarkdown] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [fontSize, setFontSize] = useState("12");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const templates = [
    { 
      id: "rapport", 
      name: "Rapport professionnel", 
      content: `# Rapport d'Activité\n\n## Introduction\n\nVotre introduction ici...\n\n## Objectifs\n\n- Objectif 1\n- Objectif 2\n- Objectif 3\n\n## Analyse\n\n### Résultats obtenus\n\nVos résultats...\n\n### Recommandations\n\nVos recommandations...\n\n## Conclusion\n\nVotre conclusion...` 
    },
    { 
      id: "documentation", 
      name: "Documentation technique", 
      content: `# Documentation du Projet\n\n## Vue d'ensemble\n\nDescription générale du projet...\n\n## Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Utilisation\n\n### Configuration\n\nÉtapes de configuration...\n\n### Exemples\n\n\`\`\`javascript\nconst exemple = "code";\n\`\`\`\n\n## API\n\n### Endpoints\n\n- **GET** /api/users - Récupérer les utilisateurs\n- **POST** /api/users - Créer un utilisateur\n\n## Contribution\n\nGuide de contribution...` 
    },
    { 
      id: "article", 
      name: "Article de blog", 
      content: `# Titre de l'Article\n\n*Publié le [date] par [auteur]*\n\n## Introduction\n\nAccroche de votre article...\n\n## Développement\n\n### Point principal 1\n\nContenu détaillé...\n\n> Citation ou point important\n\n### Point principal 2\n\nAutre section...\n\n## Conclusion\n\nRésumé et ouverture...\n\n---\n\n*Merci de votre lecture !*` 
    }
  ];

  // Raccourcis clavier
  useHotkeys('ctrl+b', (e) => { e.preventDefault(); insertMarkdown('**', '**'); });
  useHotkeys('ctrl+i', (e) => { e.preventDefault(); insertMarkdown('*', '*'); });
  useHotkeys('ctrl+k', (e) => { e.preventDefault(); insertMarkdown('[', '](url)'); });
  useHotkeys('ctrl+shift+c', (e) => { e.preventDefault(); insertMarkdown('`', '`'); });
  useHotkeys('ctrl+enter', (e) => { e.preventDefault(); handleConvertToPdf(); });

  useEffect(() => {
    const updatePreview = async () => {
      if (markdown) {
        const html = await marked(markdown);
        setPreviewHtml(html);
      } else {
        setPreviewHtml('<p class="text-muted-foreground">Votre contenu apparaîtra ici...</p>');
      }
    };
    updatePreview();
  }, [markdown]);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + prefix + selectedText + suffix + markdown.substring(end);
    
    setMarkdown(newText);
    
    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMarkdown(template.content);
      toast({
        title: "Template appliqué",
        description: `Le template "${template.name}" a été chargé`
      });
    }
  };

  const getWordCount = () => {
    return markdown.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getLineCount = () => {
    return markdown.split('\n').length;
  };

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
      
      // Add content with custom font size
      pdf.setFontSize(parseInt(fontSize));
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
    <div className={`min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''
    }`}>
      {!isFullscreen && <Header />}
      
      <main className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isFullscreen 
          ? 'max-w-full h-screen overflow-auto pt-4' 
          : 'max-w-7xl py-8 lg:py-12'
      }`}>
        {!isFullscreen && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                <Hash className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
              <div className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Convertir du{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Markdown en PDF
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Transformez votre contenu Markdown en un document PDF professionnel
            </p>
          </div>
        )}

        {/* Templates et options */}
        {!isFullscreen && (
          <Card className="mb-6 bg-secondary/30 animate-fade-in">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-select">Templates prédéfinis</Label>
                  <Select value={selectedTemplate} onValueChange={(value) => { setSelectedTemplate(value); applyTemplate(value); }}>
                    <SelectTrigger id="template-select">
                      <SelectValue placeholder="Choisir un template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Taille de police (PDF)</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger id="font-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10pt</SelectItem>
                      <SelectItem value="12">12pt</SelectItem>
                      <SelectItem value="14">14pt</SelectItem>
                      <SelectItem value="16">16pt</SelectItem>
                      <SelectItem value="18">18pt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end sm:col-span-2 xl:col-span-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="w-full transition-all duration-200 hover:scale-105"
                  >
                    <Maximize className="h-4 w-4 mr-2" />
                    {isFullscreen ? 'Quitter' : 'Mode focus'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={`shadow-xl border-2 transition-all duration-300 ${
          isFullscreen ? 'h-[calc(100vh-2rem)] flex flex-col' : ''
        }`}>
          <CardHeader className={isFullscreen ? 'flex-shrink-0' : ''}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Hash className="h-5 w-5 flex-shrink-0" />
                  {isFullscreen ? 'Mode Focus' : 'Éditeur Markdown'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-1">
                  {isFullscreen 
                    ? 'Concentrez-vous sur votre écriture' 
                    : 'Utilisez les raccourcis : Ctrl+B (gras), Ctrl+I (italique), Ctrl+K (lien), Ctrl+Entrée (convertir)'
                  }
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {isFullscreen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(false)}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Maximize className="h-4 w-4 mr-2" />
                    Quitter
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!markdown.trim()}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Masquer</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Prévisualiser</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className={`space-y-6 ${isFullscreen ? 'flex-1 flex flex-col overflow-hidden' : ''}`}>
            {/* Barre d'outils */}
            <div className={`flex flex-wrap gap-1 sm:gap-2 p-3 sm:p-4 bg-gradient-to-r from-muted/20 to-muted/40 rounded-xl border border-border/50 backdrop-blur-sm animate-fade-in ${
              isFullscreen ? 'flex-shrink-0' : ''
            }`}>
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-background/50 rounded-lg border border-border/30">
                <Palette className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Formatage</span>
              </div>
              <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />
              
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('**', '**')}
                  title="Gras (Ctrl+B)"
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 p-2"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('*', '*')}
                  title="Italique (Ctrl+I)"
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 p-2"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('# ', '')}
                  title="Titre"
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 p-2"
                >
                  <Heading className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-8 mx-1 hidden lg:block" />
              
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-background/50 rounded-lg border border-border/30">
                <List className="h-3 w-3 text-accent flex-shrink-0" />
                <span className="text-xs font-medium text-muted-foreground hidden lg:inline">Structure</span>
              </div>
              <Separator orientation="vertical" className="h-8 mx-1 hidden lg:block" />
              
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('- ', '')}
                  title="Liste à puces"
                  className="hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-105 p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('[', '](url)')}
                  title="Lien (Ctrl+K)"
                  className="hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-105 p-2"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('![alt](', ')')}
                  title="Image"
                  className="hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-105 p-2"
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('`', '`')}
                  title="Code (Ctrl+Shift+C)"
                  className="hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-105 p-2"
                >
                  <Code className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('> ', '')}
                  title="Citation"
                  className="hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-105 p-2"
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className={`grid gap-4 lg:gap-6 transition-all duration-300 ${
              showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'
            } ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
              <div className={`space-y-2 animate-fade-in ${isFullscreen ? 'flex flex-col min-h-0' : ''}`}>
                <Label htmlFor="markdown-input" className="flex items-center gap-2 font-medium text-sm sm:text-base">
                  <Hash className="h-4 w-4 text-primary flex-shrink-0" />
                  Contenu Markdown
                </Label>
                <div className={`relative ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
                  <Textarea
                    ref={textareaRef}
                    id="markdown-input"
                    placeholder="# Votre titre ici&#10;&#10;Commencez à écrire ou choisissez un template...&#10;&#10;**Astuce :** Utilisez les raccourcis clavier pour un formatage rapide !"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className={`
                      resize-none font-mono text-sm 
                      border-2 border-border/50 
                      focus:border-primary/50 
                      transition-all duration-300
                      backdrop-blur-sm
                      w-full
                      ${isFullscreen 
                        ? 'h-full min-h-0' 
                        : 'min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]'
                      }
                    `}
                  />
                  {markdown.length === 0 && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="text-center text-muted-foreground/50 animate-pulse px-4">
                        <Hash className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm">Commencez à taper ou choisissez un template</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {showPreview && (
                <div className={`space-y-2 animate-slide-up ${isFullscreen ? 'flex flex-col min-h-0' : ''}`}>
                  <Label className="text-sm sm:text-base">Prévisualisation en temps réel</Label>
                  <MarkdownPreview 
                    markdown={markdown}
                    isFullscreen={isFullscreen}
                    className={`border-2 border-primary/20 shadow-lg ${isFullscreen ? 'flex-1 min-h-0 overflow-auto' : ''}`}
                  />
                </div>
              )}
            </div>
            
            {/* Statistiques et actions */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-secondary/20 to-secondary/40 rounded-xl border border-border/50 backdrop-blur-sm ${
              isFullscreen ? 'flex-shrink-0' : ''
            }`}>
              <div className="flex flex-wrap gap-3 sm:gap-6 text-sm w-full sm:w-auto">
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-background/50 rounded-lg border border-border/30">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="font-medium">{markdown.length}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">caractères</span>
                </div>
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-background/50 rounded-lg border border-border/30">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="font-medium">{getWordCount()}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">mots</span>
                </div>
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-background/50 rounded-lg border border-border/30">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="font-medium">{getLineCount()}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">lignes</span>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline"
                  onClick={() => setMarkdown('')}
                  disabled={!markdown.trim()}
                  className="transition-all duration-200 hover:scale-105 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 flex-1 sm:flex-none"
                >
                  Effacer
                </Button>
                <Button 
                  onClick={handleConvertToPdf}
                  disabled={!markdown.trim() || isConverting}
                  variant="gradient"
                  size={isFullscreen ? "default" : "lg"}
                  className="transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex-1 sm:flex-none"
                >
                  {isConverting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin flex-shrink-0"></div>
                      <span className="hidden sm:inline">Conversion en cours...</span>
                      <span className="sm:hidden">Conversion...</span>
                    </div>
                  ) : (
                    <>
                      <Download className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline">Télécharger le PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aide et raccourcis - masqués en mode plein écran */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-8 animate-fade-in">
            {/* Aide syntaxe */}
            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/40 border-2 border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  Syntaxe Markdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4 text-sm">
                  <div>
                    <p className="font-semibold mb-3 text-foreground text-sm sm:text-base">Formatage :</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-primary text-xs sm:text-sm flex-shrink-0"># Titre</code>
                        <span className="text-muted-foreground text-xs sm:text-sm">Titre principal</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-primary text-xs sm:text-sm flex-shrink-0">**gras**</code>
                        <span className="text-muted-foreground text-xs sm:text-sm">Texte en gras</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-primary text-xs sm:text-sm flex-shrink-0">*italique*</code>
                        <span className="text-muted-foreground text-xs sm:text-sm">Texte en italique</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-primary text-xs sm:text-sm flex-shrink-0">`code`</code>
                        <span className="text-muted-foreground text-xs sm:text-sm">Code inline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Raccourcis clavier */}
            <Card className="bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                  Raccourcis clavier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4 text-sm">
                  <div>
                    <p className="font-semibold mb-3 text-foreground text-sm sm:text-base">Édition rapide :</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <kbd className="bg-muted px-2 py-1 rounded font-mono text-accent text-xs sm:text-sm flex-shrink-0">Ctrl+B</kbd>
                        <span className="text-muted-foreground text-xs sm:text-sm">Texte en gras</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <kbd className="bg-muted px-2 py-1 rounded font-mono text-accent text-xs sm:text-sm flex-shrink-0">Ctrl+I</kbd>
                        <span className="text-muted-foreground text-xs sm:text-sm">Texte en italique</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <kbd className="bg-muted px-2 py-1 rounded font-mono text-accent text-xs sm:text-sm flex-shrink-0">Ctrl+K</kbd>
                        <span className="text-muted-foreground text-xs sm:text-sm">Insérer un lien</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/30 gap-2">
                        <kbd className="bg-muted px-2 py-1 rounded font-mono text-accent text-xs sm:text-sm flex-shrink-0">Ctrl+↵</kbd>
                        <span className="text-muted-foreground text-xs sm:text-sm">Convertir en PDF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MarkdownToPdf;