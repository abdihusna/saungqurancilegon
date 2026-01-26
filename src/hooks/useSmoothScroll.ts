import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useSmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return { scrollToElement, scrollToTop };
}
