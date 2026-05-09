import { useEffect, useState } from "react";

import {
  getOfflineLibrarySnapshot,
  subscribeToOfflineLibrary,
  type OfflineLibrarySnapshot
} from "../lib/browser-storage";

export function useOfflineLibrary() {
  const [snapshot, setSnapshot] = useState<OfflineLibrarySnapshot>(getOfflineLibrarySnapshot);

  useEffect(() => {
    return subscribeToOfflineLibrary(() => {
      setSnapshot(getOfflineLibrarySnapshot());
    });
  }, []);

  return snapshot;
}
