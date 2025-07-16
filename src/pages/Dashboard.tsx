import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Download, 
  Upload, 
  Settings, 
  History,
  FileImage,
  FileSpreadsheet,
  Presentation,
  Merge,
  Split,
  Edit3,
  Trash2,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const features = [
    {
      title: "Conversion PDF",
      description: "Convertissez vos PDF en différents formats",
      icon: Download,
      action: () => navigate('/pdf-to-formats'),
      color: "bg-blue-500"
    },
    {
      title: "Créer PDF",
      description: "Créez des PDF à partir de texte ou Markdown",
      icon: FileText,
      action: () => navigate('/text-to-pdf'),
      color: "bg-green-500"
    },
    {
      title: "Fusionner PDF",
      description: "Combinez plusieurs PDF en un seul",
      icon: Merge,
      action: () => navigate('/merge-pdf'),
      color: "bg-purple-500"
    },
    {
      title: "Diviser PDF",
      description: "Séparez un PDF en plusieurs pages",
      icon: Split,
      action: () => navigate('/split-pdf'),
      color: "bg-orange-500"
    },
    {
      title: "Éditer PDF",
      description: "Modifiez le contenu de vos PDF",
      icon: Edit3,
      action: () => navigate('/edit-pdf'),
      color: "bg-red-500"
    },
    {
      title: "Mes Documents",
      description: "Gérez vos fichiers uploadés",
      icon: Upload,
      action: () => navigate('/documents'),
      color: "bg-teal-500"
    }
  ];

  const recentConversions = [
    { name: "Document.pdf", type: "PDF vers Word", date: "Il y a 2 heures" },
    { name: "Rapport.pdf", type: "PDF vers Excel", date: "Hier" },
    { name: "Présentation.pdf", type: "PDF vers PowerPoint", date: "Il y a 3 jours" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PDF-kit</h1>
              <p className="text-sm text-muted-foreground">
                Bienvenue, {user?.user_metadata?.display_name || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <User className="h-4 w-4 mr-2" />
              Profil
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Tableau de bord</h2>
            <p className="text-muted-foreground">
              Gérez vos documents PDF avec notre suite d'outils professionnels
            </p>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Outils disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={feature.action}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Conversions récentes
                </CardTitle>
                <CardDescription>
                  Vos dernières conversions de documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConversions.map((conversion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{conversion.name}</p>
                          <p className="text-xs text-muted-foreground">{conversion.type}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{conversion.date}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/history')}>
                  Voir tout l'historique
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Actions rapides
                </CardTitle>
                <CardDescription>
                  Accès rapide aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/pdf-to-text')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Extraire le texte d'un PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/markdown-to-pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Markdown vers PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/compress-pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Compresser un PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;