import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
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
  // ✅ Header component inside same file
  const Header: React.FC = () => {
    return (
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-black p-3 shadow rounded-b-2xl">
        <div className="flex items-center space-x-4">
          {/* Text logo with italics */}
          <h1 className="text-red-600 text-3xl font-[cursive] italic select-none cursor-default">
            Lilly
          </h1>
        </div>

        <div className="relative group cursor-pointer">
          <img
            src="/profile-avatar.png"
            alt="User Profile"
            
          />
          <div className="absolute right-0 mt-2 w-max bg-white text-black text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto p-2 z-10">
            <p className="font-semibold">John Doe</p>
            <p className="text-xs">john.doe@example.com</p>
          </div>
        </div>
      </header>
    );
  };

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-black`}>
        {/* <AuthProvider> */}

        {/* ✅ Header */}
        <Header />

        {/* ✅ Main scrollable content */}
        <main className="mt-[70px] mb-[100px] px-6 overflow-y-auto">
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
