import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AnalysisFormPage } from "./pages/AnalysisFormPage";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background flex flex-col bg-mesh noise">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.17 0.018 265)",
            border: "1px solid oklch(0.25 0.022 265)",
            color: "oklch(0.96 0.012 265)",
          },
        }}
      />
    </div>
  ),
});

// Routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analysis",
  component: AnalysisFormPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results/$id",
  component: ResultsPage,
  beforeLoad: ({ params }) => {
    // Validate the id is a valid number
    if (!params.id || Number.isNaN(Number(params.id))) {
      throw redirect({ to: "/history" });
    }
  },
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

// Router
const routeTree = rootRoute.addChildren([
  homeRoute,
  analysisRoute,
  resultsRoute,
  historyRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
