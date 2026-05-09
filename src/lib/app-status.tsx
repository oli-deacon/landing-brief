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
  installHint: string;
  installInstructions: string[];
  installLabel: string;
  installMethod: "native-prompt" | "ios-manual" | "ios-open-in-safari" | "none";
  installApp: () => Promise<boolean>;
  isInstalled: boolean;
  isOnline: boolean;
};

const AppStatusContext = createContext<AppStatusContextValue | null>(null);

function getInstallEnvironment() {
  if (typeof window === "undefined") {
    return {
      installHint: "Install LandingBrief to keep it handy while travelling.",
      installInstructions: [] as string[],
      installLabel: "Install",
      installMethod: "none" as const
    };
  }

  const userAgent = window.navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isSafari =
    /Safari/.test(userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|GSA/.test(userAgent);

  if (isIOS && isSafari) {
    return {
      installHint: "On iPhone, install from Safari using Share and Add to Home Screen.",
      installInstructions: [
        "Open LandingBrief in Safari.",
        "Tap the Share button in the browser toolbar.",
        "Scroll down and choose Add to Home Screen.",
        "Keep Open as Web App enabled if iPhone shows that option, then tap Add."
      ],
      installLabel: "Add to Home Screen",
      installMethod: "ios-manual" as const
    };
  }

  if (isIOS) {
    return {
      installHint: "iPhone installation works from Safari. Open this site there, then use Add to Home Screen.",
      installInstructions: [
        "Open LandingBrief in Safari on your iPhone.",
        "Tap the Share button.",
        "Choose Add to Home Screen.",
        "Tap Add to finish the install."
      ],
      installLabel: "Open in Safari",
      installMethod: "ios-open-in-safari" as const
    };
  }

  return {
    installHint: "Install LandingBrief for a cleaner travel setup.",
    installInstructions: [] as string[],
    installLabel: "Install LandingBrief",
    installMethod: "none" as const
  };
}

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
  const installEnvironment = getInstallEnvironment();

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
      canInstall:
        !isInstalled &&
        (installEvent !== null || installEnvironment.installMethod === "ios-manual"),
      installHint: installEnvironment.installHint,
      installInstructions: installEnvironment.installInstructions,
      installLabel:
        installEvent !== null ? "Install LandingBrief" : installEnvironment.installLabel,
      installMethod:
        installEvent !== null ? "native-prompt" : installEnvironment.installMethod,
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
    [installEnvironment.installHint, installEnvironment.installInstructions, installEnvironment.installLabel, installEnvironment.installMethod, installEvent, isInstalled, isOnline],
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
