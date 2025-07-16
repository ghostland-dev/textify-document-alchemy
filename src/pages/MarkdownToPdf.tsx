import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Hash, ArrowRight, Eye, EyeOff, Bold, Italic, List, Heading, Link, Image, Code, Quote, Settings, File, Maximize } from "lucide-react";
import Header from "@/components/Header";
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
    <div className={`min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Header />
      
      <main className={`mx-auto px-6 py-12 ${isFullscreen ? 'max-w-full h-full' : 'max-w-4xl'}`}>
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

        {/* Templates et options */}
        <Card className="mb-6 bg-secondary/30">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
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
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="w-full"
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  {isFullscreen ? 'Quitter' : 'Plein écran'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Éditeur Markdown
                </CardTitle>
                <CardDescription>
                  Utilisez les raccourcis : Ctrl+B (gras), Ctrl+I (italique), Ctrl+K (lien), Ctrl+Entrée (convertir)
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!markdown.trim()}
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Prévisualiser
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Barre d'outils */}
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('**', '**')}
                title="Gras (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('*', '*')}
                title="Italique (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('# ', '')}
                title="Titre"
              >
                <Heading className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('- ', '')}
                title="Liste à puces"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('[', '](url)')}
                title="Lien (Ctrl+K)"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('![alt](', ')')}
                title="Image"
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('`', '`')}
                title="Code (Ctrl+Shift+C)"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('> ', '')}
                title="Citation"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
              <div className="space-y-2">
                <Label htmlFor="markdown-input">Contenu Markdown</Label>
                <Textarea
                  ref={textareaRef}
                  id="markdown-input"
                  placeholder="# Votre titre ici&#10;&#10;Commencez à écrire ou choisissez un template..."
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className={`resize-none font-mono text-sm ${isFullscreen ? 'min-h-[60vh]' : 'min-h-[400px]'}`}
                />
              </div>
              
              {showPreview && (
                <div className="space-y-2">
                  <Label>Prévisualisation en temps réel</Label>
                  <div 
                    className={`p-4 border rounded-lg bg-background overflow-auto prose prose-sm dark:prose-invert max-w-none ${isFullscreen ? 'min-h-[60vh]' : 'min-h-[400px]'}`}
                    dangerouslySetInnerHTML={{ 
                      __html: previewHtml 
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Statistiques et actions */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span>{markdown.length} caractères</span>
                <span>{getWordCount()} mots</span>
                <span>{getLineCount()} lignes</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setMarkdown('')}
                  disabled={!markdown.trim()}
                >
                  Effacer
                </Button>
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
            </div>
          </CardContent>
        </Card>

        {/* Aide et raccourcis */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Aide syntaxe */}
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg">Syntaxe Markdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-2">Formatage :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><code className="bg-muted px-1 rounded"># Titre</code> - Titre principal</li>
                    <li><code className="bg-muted px-1 rounded">**gras**</code> - Texte en gras</li>
                    <li><code className="bg-muted px-1 rounded">*italique*</code> - Texte en italique</li>
                    <li><code className="bg-muted px-1 rounded">`code`</code> - Code inline</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raccourcis clavier */}
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg">Raccourcis clavier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-2">Édition :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><kbd className="bg-muted px-1 rounded">Ctrl+B</kbd> - Texte en gras</li>
                    <li><kbd className="bg-muted px-1 rounded">Ctrl+I</kbd> - Texte en italique</li>
                    <li><kbd className="bg-muted px-1 rounded">Ctrl+K</kbd> - Insérer un lien</li>
                    <li><kbd className="bg-muted px-1 rounded">Ctrl+Entrée</kbd> - Convertir en PDF</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MarkdownToPdf;