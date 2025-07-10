import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnalysisProvider } from "./contexts/AnalysisContext";

// Import components from the components barrel file
import {
  Layout,
  HomePage,
  About,
  Resources,
  PatientForm,
  AnalysisResults,
  Progress,
  NotFound
} from "./components";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AnalysisProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<About />} />
              <Route path="resources" element={<Resources />} />
              
              {/* Patient Routes */}
              <Route path="patient">
                <Route index element={<Navigate to="form" replace />} />
                <Route path="form" element={<PatientForm />} />
                <Route path="results" element={<AnalysisResults />} />
                <Route path="progress" element={<Progress />} />
              </Route>

              {/* 404 - Keep this as the last route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AnalysisProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
