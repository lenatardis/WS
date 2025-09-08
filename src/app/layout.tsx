import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk">
        <body className="min-h-dvh antialiased">{children}</body>
        </html>
    );
}
