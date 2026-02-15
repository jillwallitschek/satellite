import { createTheme, CssBaseline, StyledEngineProvider } from "@mui/material";
import React from "react";
import type { PaletteMode } from "@mui/material";
import { ThemeProvider, extendTheme } from "@mui/material/styles/";
import useMediaQuery from "@mui/material/useMediaQuery";
import { darkPalette, lightPalette } from "./palette";

//hoist outside to prevent rerendering
const cssBaselineNode = <CssBaseline enableColorScheme />;

export function CustomTheme({
  children,
  theme,
  mode,
}: {
  mode: PaletteMode;
  theme: ReturnType<typeof createTheme>;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme} defaultMode={mode}>
      {children}
    </ThemeProvider>
  );
}

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });
  const modePreference = prefersDarkMode ? "dark" : "light";
  const [mode, setMode] = React.useState<PaletteMode>(modePreference);
  React.useEffect(() => {
    if (modePreference !== mode) {
      setMode(modePreference);
    }
  }, [mode, setMode, modePreference]);
  const cssVarsTheme = extendTheme({
    typography: {
      fontSize: 13,
    },
    colorSchemes: {
      light: {
        palette: {
          ...lightPalette,
        },
      },
      dark: {
        palette: {
          ...darkPalette,
        },
      },
    },
  });
  return (
    <StyledEngineProvider injectFirst>
      <CustomTheme theme={cssVarsTheme} mode={mode}>
        {children}
        {cssBaselineNode}
      </CustomTheme>
    </StyledEngineProvider>
  );
}
