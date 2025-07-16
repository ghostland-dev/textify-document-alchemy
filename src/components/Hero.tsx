import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Convertissez vos{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                documents
              </span>{" "}
              en un clic
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Transformez facilement vos textes en PDF, vos fichiers Markdown en documents professionnels, 
              ou convertissez vos PDF en texte éditable. Rapide, simple et gratuit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/text-to-pdf">
                  <Upload className="h-5 w-5" />
                  Commencer maintenant
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/markdown-to-pdf">
                  <FileText className="h-5 w-5" />
                  Markdown → PDF
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Upload facile</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <ArrowRight className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium">Conversion rapide</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Téléchargement instant</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Conversion de documents" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 p-4 bg-white rounded-2xl shadow-lg border">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            
            <div className="absolute -bottom-6 -left-6 p-4 bg-white rounded-2xl shadow-lg border">
              <Download className="h-8 w-8 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;