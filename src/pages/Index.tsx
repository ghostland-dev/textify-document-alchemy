import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ConversionCard from "@/components/ConversionCard";
import { FileText, Hash, Type, File } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Conversion options */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Choisissez votre{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                conversion
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trois outils puissants pour transformer vos documents en quelques clics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ConversionCard
              title="Text → PDF"
              description="Convertissez du texte brut en document PDF professionnel"
              icon={<Type className="h-8 w-8 text-primary" />}
              fromFormat="TEXT"
              toFormat="PDF"
              href="/text-to-pdf"
            />
            
            <ConversionCard
              title="Markdown → PDF"
              description="Transformez votre contenu Markdown formaté en PDF"
              icon={<Hash className="h-8 w-8 text-accent" />}
              fromFormat="MARKDOWN"
              toFormat="PDF"
              href="/markdown-to-pdf"
            />
            
            <ConversionCard
              title="PDF → Text"
              description="Extrayez le texte de vos fichiers PDF pour l'éditer"
              icon={<File className="h-8 w-8 text-primary" />}
              fromFormat="PDF"
              toFormat="TEXT"
              href="/pdf-to-text"
            />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Pourquoi choisir{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ConvertPDF ?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto p-4 bg-primary/10 rounded-2xl mb-4 w-fit">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rapide et Simple</h3>
              <p className="text-muted-foreground">
                Conversion instantanée sans inscription ni téléchargement de logiciel
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto p-4 bg-accent/10 rounded-2xl mb-4 w-fit">
                <Hash className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Formats Multiples</h3>
              <p className="text-muted-foreground">
                Support complet pour Text, Markdown et PDF dans les deux sens
              </p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto p-4 bg-primary/10 rounded-2xl mb-4 w-fit">
                <File className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualité Pro</h3>
              <p className="text-muted-foreground">
                Génération de PDF de qualité professionnelle avec mise en forme préservée
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
