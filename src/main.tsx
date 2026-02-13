import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { MemoryInspector } from '@/pages/MemoryInspector'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/memory",
    element: <MemoryInspector />,
    errorElement: <RouteErrorBoundary />,
  },
  // Placeholders for future phases
  {
    path: "/checkpoints",
    element: <div className="p-8 text-center text-muted-foreground font-mono">Module Loaded: CHECKPOINT_MANAGER (Pending UI Implementation)</div>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/logs",
    element: <div className="p-8 text-center text-muted-foreground font-mono">Module Loaded: AUDIT_TRAIL (Pending UI Implementation)</div>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/health",
    element: <div className="p-8 text-center text-muted-foreground font-mono">Module Loaded: HEALTH_OBSERVABILITY (Pending UI Implementation)</div>,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)