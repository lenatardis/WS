import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk">
        <body className="min-h-dvh antialiased">
        {children}
        <Toaster richColors position="top-right" />
        </body>
        </html>
    );
}
