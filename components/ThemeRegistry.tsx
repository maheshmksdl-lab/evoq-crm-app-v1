"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const HEADING = "var(--font-figtree), sans-serif";
const BODY    = "var(--font-dm-sans), system-ui, -apple-system, sans-serif";

// ── Brand tokens ────────────────────────────────────
// Fixed brand colours (same in light and dark) plus theme tokens that switch
// with the OS colour scheme. Theme tokens are the CSS variables defined in
// app/globals.css, so MUI and Tailwind always agree.
const C = {
  depth:   "#0C2472",  // Sidebar bg, button pressed, dark badges
  primary: "#1D4ED8",  // Primary CTAs, focus border
  action:  "#3B82F6",  // Secondary accents
  hover:   "#1E40AF",  // Primary button hover (darker = stays readable with white text)
  soft:    "#93C5FD",  // Focus rings
  // theme-aware
  card:    "var(--card)",
  surface: "var(--surface)",
  tint:    "var(--tint)",
  line:    "var(--line)",
  ink:     "var(--ink)",
  link:    "var(--link)",
  fg:      "var(--fg)",
  fg2:     "var(--fg-2)",
  fg3:     "var(--fg-3)",
};

const theme = createTheme({
  // Light + dark palettes; with both defined MUI follows prefers-color-scheme
  // (colorSchemeSelector "media"), matching the Tailwind dark variant.
  cssVariables: { colorSchemeSelector: "media" },
  colorSchemes: {
    light: {
      palette: {
        primary:   { main: C.primary },
        secondary: { main: C.depth   },
        success:   { main: "#10B981" },
        warning:   { main: "#F59E0B" },
        error:     { main: "#EF4444" },
        background:{ default: "#EFF6FF", paper: "#FFFFFF" },
        text:      { primary: "#1E293B", secondary: "#475569" },
        divider:   "#E3ECFC",
      },
    },
    dark: {
      palette: {
        primary:   { main: "#3B82F6" },
        secondary: { main: "#8AB4FF" },
        success:   { main: "#34D399" },
        warning:   { main: "#FBBF24" },
        error:     { main: "#F87171" },
        background:{ default: "#08122A", paper: "#0F1A33" },
        text:      { primary: "#E2E8F0", secondary: "#B4C0D3" },
        divider:   "#22355C",
      },
    },
  },
  typography: {
    fontFamily: BODY,
    h1: { fontFamily: HEADING },
    h2: { fontFamily: HEADING },
    h3: { fontFamily: HEADING },
    h4: { fontFamily: HEADING },
    h5: { fontFamily: HEADING },
    h6: { fontFamily: HEADING },
  },
  shape: { borderRadius: 10 },

  components: {
    // ── Surfaces: drawers, menus, popovers use the card token ──
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", backgroundColor: C.card, color: C.fg },
      },
    },

    // ── Buttons ────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "9px",
          fontFamily: BODY,
          transition: "background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, color 0.15s ease",
          "&.Mui-focusVisible": { boxShadow: "0 0 0 3px rgb(147 197 253 / 0.6)" },
        },
        // Primary action: default=Primary, hover=darker blue (keeps white text AA), pressed=Depth
        containedPrimary: {
          backgroundColor: C.primary,
          color: "#FFFFFF",
          boxShadow: "0 1px 8px 0 rgb(29 78 216 / 0.2)",
          "&:hover": {
            backgroundColor: C.hover,
            boxShadow: "0 2px 14px 0 rgb(29 78 216 / 0.3)",
          },
          "&:active": {
            backgroundColor: C.depth,
            boxShadow: "0 1px 4px 0 rgb(12 36 114 / 0.27)",
          },
          "&.Mui-disabled": {
            backgroundColor: C.tint,
            color: C.fg3,
            boxShadow: "none",
          },
        },
        // Outlined: line border, link text
        outlinedPrimary: {
          borderColor: C.line,
          color: C.link,
          "&:hover": {
            borderColor: C.link,
            color: C.link,
            backgroundColor: C.surface,
          },
          "&:active": { borderColor: C.link, color: C.link },
          "&.Mui-disabled": {
            borderColor: C.line,
            color: C.fg3,
            backgroundColor: C.surface,
          },
        },
        // Text buttons
        textPrimary: {
          color: C.link,
          "&:hover": { backgroundColor: C.surface, color: C.ink },
          "&:active": { color: C.ink },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: { color: C.fg2, "&.Mui-focusVisible": { boxShadow: "0 0 0 3px rgb(147 197 253 / 0.6)" } },
      },
    },

    // ── Form Inputs ────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.82rem",
          color: C.fg,
          backgroundColor: C.surface,
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: C.line,
            borderWidth: 1.5,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--line-strong)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: C.primary,
            borderWidth: 2,
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 2px ${C.soft}`,
          },
          "&.Mui-disabled": {
            opacity: 0.6,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: C.line },
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#EF4444",
          },
        },
        input: {
          padding: "10px 14px",
          "&::placeholder": { color: C.fg3, opacity: 1 },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: BODY, color: C.fg },
        input: { "&::placeholder": { color: C.fg3, opacity: 1 } },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.79rem",
          color: C.fg2,
          "&.Mui-focused": { color: C.link },
          "&.Mui-error":   { color: "#EF4444" },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: { root: { color: C.fg3 } },
    },

    // ── Select ─────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        select: {
          fontFamily: BODY,
          fontSize: "0.82rem",
          padding: "10px 14px",
          backgroundColor: C.surface,
        },
        icon: { color: C.fg3 },
      },
    },

    // ── Chip / Badge ───────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: "0.67rem",
          backgroundColor: C.tint,
          color: C.ink,
        },
        colorPrimary: {
          backgroundColor: C.primary,
          color: "#ffffff",
        },
      },
    },

    // ── Table ──────────────────────────────────────────
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          color: C.fg,
          borderColor: C.line,
          padding: "10px 16px",
          backgroundColor: C.card,
        },
        head: {
          fontFamily: HEADING,
          fontWeight: 700,
          color: C.fg2,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          backgroundColor: "var(--surface-subtle)",
        },
        body: { backgroundColor: C.card },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: { "&:hover td": { backgroundColor: "var(--surface-subtle)" } },
      },
    },

    // ── Menu / MenuItem ────────────────────────────────
    MuiMenu: {
      styleOverrides: {
        paper: { border: `1px solid ${C.line}`, boxShadow: "var(--shadow-card)" },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: { border: `1px solid ${C.line}` },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.82rem",
          color: C.fg,
          "&:hover": { backgroundColor: C.surface },
          "&.Mui-selected": {
            backgroundColor: "rgb(59 130 246 / 0.12)",
            color: C.link,
            "&:hover": { backgroundColor: "rgb(59 130 246 / 0.18)" },
          },
        },
      },
    },

    MuiListItemText: {
      styleOverrides: { primary: { fontFamily: BODY } },
    },

    // ── Checkbox / Radio / Switch ──────────────────────
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "var(--line-strong)",
          "&.Mui-checked":               { color: C.primary },
          "&.MuiCheckbox-indeterminate": { color: C.primary },
          "&:hover": { backgroundColor: "rgb(147 197 253 / 0.12)" },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: { color: "var(--line-strong)", "&.Mui-checked": { color: C.primary } },
      },
    },

    // ── Tooltip ────────────────────────────────────────
    // Navy in light mode; in dark mode it lifts slightly so it still separates from cards.
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: C.depth,
          color: "#FFFFFF",
          fontSize: "0.72rem",
          fontFamily: BODY,
          borderRadius: "8px",
          padding: "5px 10px",
          "@media (prefers-color-scheme: dark)": { backgroundColor: "#24407A" },
        },
        arrow: {
          color: C.depth,
          "@media (prefers-color-scheme: dark)": { color: "#24407A" },
        },
      },
    },

    // ── Dialog / Drawer ────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: C.card,
          borderRadius: "16px",
          border: `1.5px solid ${C.line}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: C.card, borderColor: C.line },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { "&:not(.MuiBackdrop-invisible)": { backgroundColor: "rgb(8 18 42 / 0.45)" } },
      },
    },

    // ── Divider ────────────────────────────────────────
    MuiDivider: {
      styleOverrides: { root: { borderColor: C.line } },
    },

    // ── Badge ──────────────────────────────────────────
    MuiBadge: {
      styleOverrides: { colorPrimary: { backgroundColor: C.primary } },
    },

    // ── Avatar fallback text stays white on coloured fills ──
    MuiAvatar: {
      styleOverrides: { root: { color: "#FFFFFF" } },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
