import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => (
  <BrowserRouter>
    <Toaster
      position="top-right"
      theme="dark"
      toastOptions={{
        classNames: {
          toast: "bg-background text-foreground border-border shadow-lg",
          description: "text-muted-foreground",
        },
      }}
    />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
