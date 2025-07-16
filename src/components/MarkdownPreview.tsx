import { useState, useEffect } from "react";
import { marked } from "marked";

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
  isFullscreen?: boolean;
}

const MarkdownPreview = ({ markdown, className = "", isFullscreen = false }: MarkdownPreviewProps) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const convertMarkdown = async () => {
      if (markdown.trim()) {
        try {
          const result = await marked(markdown);
          setHtml(result);
        } catch (error) {
          setHtml('<p class="text-destructive">Erreur lors du rendu du Markdown</p>');
        }
      } else {
        setHtml('<p class="text-muted-foreground italic">Votre contenu apparaîtra ici...</p>');
      }
    };

    convertMarkdown();
  }, [markdown]);

  return (
    <div 
      className={`
        markdown-preview
        p-6 
        border 
        rounded-lg 
        bg-card
        overflow-auto 
        font-serif
        leading-relaxed
        ${isFullscreen ? 'min-h-[60vh]' : 'min-h-[400px]'}
        ${className}
      `}
      style={{
        // Custom CSS pour un meilleur rendu typographique
        lineHeight: '1.7',
        fontSize: '16px'
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        className="animate-fade-in markdown-content"
      />
      
      <style>{`
        .markdown-content h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          margin-top: 0;
          color: hsl(var(--foreground));
          border-bottom: 2px solid hsl(var(--border));
          padding-bottom: 0.75rem;
          font-family: 'Merriweather', serif;
          line-height: 1.2;
        }
        
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          margin-top: 2rem;
          color: hsl(var(--foreground));
          font-family: 'Merriweather', serif;
          line-height: 1.3;
        }
        
        .markdown-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
          color: hsl(var(--foreground));
          font-family: 'Merriweather', serif;
          line-height: 1.4;
        }
        
        .markdown-content h4, .markdown-content h5, .markdown-content h6 {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
          color: hsl(var(--foreground));
          font-family: 'Merriweather', serif;
        }
        
        .markdown-content p {
          margin-bottom: 1rem;
          color: hsl(var(--card-foreground));
          font-family: 'Merriweather', serif;
          line-height: 1.7;
        }
        
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1rem;
          margin-left: 1.5rem;
        }
        
        .markdown-content li {
          margin-bottom: 0.5rem;
          color: hsl(var(--card-foreground));
          font-family: 'Merriweather', serif;
          line-height: 1.6;
        }
        
        .markdown-content ul li {
          list-style-type: disc;
        }
        
        .markdown-content ol li {
          list-style-type: decimal;
        }
        
        .markdown-content strong {
          font-weight: bold;
          color: hsl(var(--foreground));
        }
        
        .markdown-content em {
          font-style: italic;
        }
        
        .markdown-content code {
          background-color: hsl(var(--muted));
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: hsl(var(--primary));
          font-family: 'JetBrains Mono', monospace;
        }
        
        .markdown-content pre {
          background-color: hsl(var(--muted));
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          overflow-x: auto;
        }
        
        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
          font-size: 0.875rem;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .markdown-content blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1rem;
          margin-left: 0.5rem;
          margin-bottom: 1rem;
          font-style: italic;
          color: hsl(var(--muted-foreground));
          font-family: 'Merriweather', serif;
        }
        
        .markdown-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .markdown-content a:hover {
          color: hsl(var(--primary) / 0.8);
        }
        
        .markdown-content hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 2rem 0;
        }
        
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid hsl(var(--border));
          margin-bottom: 1rem;
        }
        
        .markdown-content th, .markdown-content td {
          border: 1px solid hsl(var(--border));
          padding: 0.5rem;
          text-align: left;
        }
        
        .markdown-content th {
          background-color: hsl(var(--muted));
          font-weight: 600;
        }
        
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MarkdownPreview;