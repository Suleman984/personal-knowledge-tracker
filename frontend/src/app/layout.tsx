// app/layout.tsx
import "./globals.css";
import { ReduxProvider } from "@/store";
import SessionLoader from "@/components/sessionLoader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <SessionLoader />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
