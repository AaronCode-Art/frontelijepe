import { AppProvider, useApp } from "@/context/AppContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";
import { Chatbot } from "@/components/Chatbot";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import HomePage from "@/pages/HomePage";
import ExplorarPage from "@/pages/ExplorarPage";
import TestPage from "@/pages/TestPage";
import SimuladorPage from "@/pages/SimuladorPage";
import DetallePage from "@/pages/DetallePage";
import ComparadorPage from "@/pages/ComparadorPage";
import IAPage from "@/pages/IAPage";
import ComunidadPage from "@/pages/ComunidadPage";
import MapaPage from "@/pages/MapaPage";
import FinancieroPage from "@/pages/FinancieroPage";
import FavoritosPage from "@/pages/FavoritosPage";
import PerfilPage from "@/pages/PerfilPage";
import NotificacionesPage from "@/pages/NotificacionesPage";
import ChatHistoryPage from "@/pages/ChatHistoryPage";
import EspecialistasPage from "@/pages/EspecialistasPage";

function AppInner() {
  const { state, page } = useApp();

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "explorar": return <ExplorarPage />;
      case "test": return <TestPage />;
      case "simulador": return <SimuladorPage />;
      case "detalle": return <DetallePage />;
      case "comparador": return <ComparadorPage />;
      case "ia": return <IAPage />;
      case "comunidad": return <ComunidadPage />;
      case "mapa": return <MapaPage />;
      case "financiero": return <FinancieroPage />;
      case "favoritos": return <FavoritosPage />;
      case "perfil": return <PerfilPage />;
      case "notificaciones": return <NotificacionesPage />;
      case "chat-history": return <ChatHistoryPage />;
      case "especialistas": return <EspecialistasPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Login modal — floats over the app when the user is not authenticated */}
      {!state.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <AuthPage />
        </div>
      )}

      <Header />
      <main id="contenido-principal" className="flex-1">{renderPage()}</main>
      <Footer />
      <CompareBar />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </AccessibilityProvider>
  );
}
