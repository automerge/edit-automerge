import { useCallback, useEffect, useState } from "react";

export const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash);

  const onHashChange = useCallback(() => {
    setHash(window.location.hash);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  });

  const setHashValue = useCallback((newHash: string) => {
    window.location.hash = newHash;
    setHash(newHash);
  }, []);

  return [hash, setHashValue] as const;
};
