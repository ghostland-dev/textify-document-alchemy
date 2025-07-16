import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ConversionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  fromFormat: string;
  toFormat: string;
  href: string;
}

const ConversionCard = ({ title, description, icon, fromFormat, toFormat, href }: ConversionCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        {/* Conversion flow */}
        <div className="flex items-center justify-center gap-4">
          <div className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium">
            {fromFormat}
          </div>
          <ArrowRight className="h-5 w-5 text-primary" />
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            {toFormat}
          </div>
        </div>
        
        <Button variant="gradient" className="w-full" asChild>
          <Link to={href}>
            <Upload className="h-4 w-4" />
            Convertir maintenant
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConversionCard;