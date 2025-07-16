import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TextToPdf from "./pages/TextToPdf";
import MarkdownToPdf from "./pages/MarkdownToPdf";
import PdfToText from "./pages/PdfToText";
import PdfToFormats from "./pages/PdfToFormats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/text-to-pdf" element={<TextToPdf />} />
          <Route path="/markdown-to-pdf" element={<MarkdownToPdf />} />
          <Route path="/pdf-to-text" element={<PdfToText />} />
          <Route path="/pdf-to-formats" element={<PdfToFormats />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
