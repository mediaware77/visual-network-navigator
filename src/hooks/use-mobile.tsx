import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    // Use event.matches for more reliable state update
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    mql.addEventListener("change", onChange);
    // Set initial state based on mql.matches
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}
