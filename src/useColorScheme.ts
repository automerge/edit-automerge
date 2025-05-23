import { useEffect, useState } from "react";

export type ColorScheme = "dark" | "light";

export function useColorScheme() {
  const [scheme, setScheme] = useState("light");

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQueryList.matches) {
      setScheme("dark");
    }
    function listener(event: MediaQueryListEvent) {
      if (event.matches) {
        setScheme("dark");
      } else {
        setScheme("light");
      }
    }
    mediaQueryList.addEventListener("change", listener);
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return scheme;
}
