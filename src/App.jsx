import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "./router";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components";
import "./index.css";
import "./styles/nav.scss";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="mx-auto">
          <Router />
          <ToastContainer />
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
