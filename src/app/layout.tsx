import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalHeader from '@/components/ConditionalHeader';
// import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lilly Digital Wallet',
  description: 'Send vouchers and copay cards to mobile numbers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-black`}>
        {/* <AuthProvider> */}

        {/* ✅ Conditional Header - hidden on login page */}
        <ConditionalHeader />

        {/* ✅ Main scrollable content */}
        <main className="mb-[100px] px-6 overflow-y-auto">
          {children}
        </main>

        {/* ✅ Footer */}
        <footer className="fixed bottom-0 left-0 w-full bg-red-600 py-8 text-center text-lg text-white shadow rounded-t-2xl">
          <a href="#" className="mx-6 hover:underline">
            Contact us
          </a>
          <a href="#" className="mx-6 hover:underline">
            Terms of Use
          </a>
          <a href="#" className="mx-6 hover:underline">
            Privacy Statement
          </a>
        </footer>

        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
