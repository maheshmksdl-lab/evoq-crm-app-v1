"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const HEADING = "var(--font-figtree), sans-serif";
const BODY    = "var(--font-dm-sans), system-ui, -apple-system, sans-serif";

// ── Brand tokens ────────────────────────────────────
const C = {
  depth:   "#0C2472",  // Sidebar bg, button pressed, dark badges
  primary: "#1D4ED8",  // Active nav, primary CTAs, focus border, links
  action:  "#3B82F6",  // Secondary buttons, info badges, helper text
  hover:   "#60A5FA",  // Button hover bg, nav hover, row hover (4%), link hover
  soft:    "#93C5FD",  // Focus rings, selected rows, tooltips
  tint:    "#E3ECFC",  // Form borders, section dividers, table header bg, card borders
  surface: "#EFF6FF",  // Form bg, table row bg, modal bg, default page bg
};

const theme = createTheme({
  palette: {
    primary:   { main: C.primary },
    secondary: { main: C.depth   },
    success:   { main: "#10B981" },
    warning:   { main: "#F59E0B" },
    error:     { main: "#EF4444" },
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
    // ── Buttons ────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "9px",
          fontFamily: BODY,
          transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        },
        // Primary action buttons: default=Primary, hover=Hover, pressed=Depth
        containedPrimary: {
          backgroundColor: C.primary,
          boxShadow: `0 1px 8px 0 ${C.primary}33`,
          "&:hover": {
            backgroundColor: C.hover,
            boxShadow: `0 2px 14px 0 ${C.hover}55`,
          },
          "&:active": {
            backgroundColor: C.depth,
            boxShadow: `0 1px 4px 0 ${C.depth}44`,
          },
          "&.Mui-disabled": {
            backgroundColor: C.tint,
            color: "#9CA3AF",
            boxShadow: "none",
          },
        },
        // Secondary / outlined buttons: border=Tint, text=Action, hover=Hover border+Surface
        outlinedPrimary: {
          borderColor: C.tint,
          color: C.action,
          "&:hover": {
            borderColor: C.hover,
            color: C.primary,
            backgroundColor: C.surface,
          },
          "&:active": {
            borderColor: C.primary,
            color: C.primary,
          },
          "&.Mui-disabled": {
            borderColor: C.tint,
            color: "#9CA3AF",
            backgroundColor: C.tint,
          },
        },
        // Text buttons
        textPrimary: {
          color: C.primary,
          "&:hover": { backgroundColor: C.surface, color: C.depth },
          "&:active": { color: C.depth },
        },
      },
    },

    // ── Form Inputs ────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.82rem",
          backgroundColor: C.surface,   // Surface bg (not white)
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: C.tint,         // Tint border unfocused
            borderWidth: 1.5,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: C.hover,        // Hover border on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: C.primary,      // Primary thick border on focus
            borderWidth: 2,
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 2px ${C.soft}`,  // Soft ring on focus
          },
          "&.Mui-disabled": {
            backgroundColor: C.soft,
            opacity: 0.6,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: C.tint },
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#EF4444",
          },
        },
        input: { padding: "10px 14px" },
      },
    },

    MuiInputBase: {
      styleOverrides: { root: { fontFamily: BODY } },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.79rem",
          color: "#6B7280",
          "&.Mui-focused": { color: C.primary },
          "&.Mui-error":   { color: "#EF4444" },
        },
      },
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
      },
    },

    // ── Chip / Badge ───────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: "0.67rem",
          backgroundColor: C.tint,      // Tint bg
          color: C.depth,               // Depth text
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
          borderColor: C.tint,          // Tint dividers
          padding: "10px 16px",
          backgroundColor: C.surface,   // Surface row bg
        },
        head: {
          // Table headers → Tint bg + Depth text (brand rule)
          fontFamily: HEADING,
          fontWeight: 700,
          color: C.depth,               // Depth text
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          backgroundColor: C.tint,      // Tint background
        },
        body: {
          backgroundColor: C.surface,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover td": {
            backgroundColor: `${C.hover}0A`,  // Hover @ 4% opacity
          },
        },
      },
    },

    // ── Menu / MenuItem ────────────────────────────────
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.82rem",
          "&:hover": { backgroundColor: C.surface },
          "&.Mui-selected": {
            backgroundColor: `${C.primary}12`,
            color: C.primary,
            "&:hover": { backgroundColor: `${C.primary}1A` },
          },
        },
      },
    },

    MuiListItemText: {
      styleOverrides: { primary: { fontFamily: BODY } },
    },

    // ── Checkbox ───────────────────────────────────────
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#CBD5E1",
          "&.Mui-checked":                  { color: C.primary },
          "&.MuiCheckbox-indeterminate":    { color: C.primary },
          "&:hover": { backgroundColor: `${C.soft}20` },
        },
      },
    },

    // ── Tooltip ────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: C.depth,
          fontSize: "0.7rem",
          fontFamily: BODY,
          borderRadius: "8px",
          padding: "5px 10px",
        },
        arrow: { color: C.depth },
      },
    },

    // ── Dialog / Modal ─────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: C.surface,
          borderRadius: "16px",
          border: `1.5px solid ${C.tint}`,
        },
      },
    },

    // ── Divider ────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: C.tint },
      },
    },

    // ── Badge ──────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        colorPrimary: { backgroundColor: C.primary },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
