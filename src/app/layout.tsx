"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HydrationProvider, Client } from "react-hydration-provider";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const MuiTheme = createTheme({
  typography: {
    allVariants: {
      color: "#ffffff",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#e0e0e0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#3d3d3d",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#e0e0e0",
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Set the hydration provider on the client side by default */}
        <HydrationProvider>
          <Client>
            <ThemeProvider theme={MuiTheme}>{children}</ThemeProvider>
          </Client>
        </HydrationProvider>
      </body>
    </html>
  );
}
