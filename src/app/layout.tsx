import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/nextauth";
import "@/theme/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PollingSocial - Share Opinions and Create Polls",
  description:
    "A social platform for polling, sharing opinions, and getting answers from people",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
