import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type AppStatusContextValue = {
  canInstall: boolean;
  installApp: () => Promise<boolean>;
  isInstalled: boolean;
  isOnline: boolean;
};

const AppStatusContext = createContext<AppStatusContextValue | null>(null);

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const standaloneNavigator = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    standaloneNavigator.standalone === true
  );
}

export function AppStatusProvider({ children }: PropsWithChildren) {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
    };
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => setIsInstalled(isStandaloneMode());

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    mediaQuery.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);

      mediaQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  const value = useMemo<AppStatusContextValue>(
    () => ({
      canInstall: !isInstalled && installEvent !== null,
      installApp: async () => {
        if (!installEvent) {
          return false;
        }

        await installEvent.prompt();
        const result = await installEvent.userChoice;

        if (result.outcome === "accepted") {
          setIsInstalled(true);
        }

        setInstallEvent(null);

        return result.outcome === "accepted";
      },
      isInstalled,
      isOnline
    }),
    [installEvent, isInstalled, isOnline],
  );

  return <AppStatusContext.Provider value={value}>{children}</AppStatusContext.Provider>;
}

export function useAppStatus() {
  const context = useContext(AppStatusContext);

  if (!context) {
    throw new Error("useAppStatus must be used within AppStatusProvider");
  }

  return context;
}
