import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TextToPdf from "./pages/TextToPdf";
import MarkdownToPdf from "./pages/MarkdownToPdf";
import PdfToText from "./pages/PdfToText";
import PdfToFormats from "./pages/PdfToFormats";
import MergePdf from "./pages/MergePdf";
import SplitPdf from "./pages/SplitPdf";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/text-to-pdf" element={<ProtectedRoute><TextToPdf /></ProtectedRoute>} />
            <Route path="/markdown-to-pdf" element={<ProtectedRoute><MarkdownToPdf /></ProtectedRoute>} />
            <Route path="/pdf-to-text" element={<ProtectedRoute><PdfToText /></ProtectedRoute>} />
            <Route path="/pdf-to-formats" element={<ProtectedRoute><PdfToFormats /></ProtectedRoute>} />
            <Route path="/merge-pdf" element={<ProtectedRoute><MergePdf /></ProtectedRoute>} />
            <Route path="/split-pdf" element={<ProtectedRoute><SplitPdf /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
