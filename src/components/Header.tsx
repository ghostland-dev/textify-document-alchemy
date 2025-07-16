import { Button } from "@/components/ui/button";
import { FileText, ArrowLeftRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-background border-b px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
            <ArrowLeftRight className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PDF-kit
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/text-to-pdf" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/text-to-pdf" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Text → PDF
          </Link>
          <Link 
            to="/markdown-to-pdf" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/markdown-to-pdf" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Markdown → PDF
          </Link>
          <Link 
            to="/pdf-to-text" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/pdf-to-text" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            PDF → Text
          </Link>
        </nav>

        <Button variant="gradient" asChild>
          <Link to="/text-to-pdf">
            <FileText className="h-4 w-4" />
            Commencer
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;