// app/layout.tsx
'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SectionContainer from "./components/SectionContainer";
import { ResponseProvider } from "./context/ResponseContext";
import { SessionProvider, useSession } from 'next-auth/react';
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import SignIn from "./components/SignIn"; // Assurez-vous que vous avez un composant SignIn

const inter = Inter({ subsets: ["latin"] });




function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  console.log(session, status);
  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return <SignIn />;
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Exemple de Page avec Tailwind CSS</title>
      </head>
      <body className={`${inter.className} flex flex-col h-screen max-h-screen w-screen bg-gradient text-black antialiased bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden dark:text-white`}>
        <SessionProvider>
          <ResponseProvider>
            <SectionContainer>
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
              <Footer />
            </SectionContainer>
          </ResponseProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
