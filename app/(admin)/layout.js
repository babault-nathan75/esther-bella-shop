import { Playfair_Display } from "next/font/google";
import Sidebar from "./Sidebar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
  variable: "--font-playfair"
});

export const metadata = {
  title: 'Admin - Esther Bella Fashion',
};

export default function AdminLayout({ children }) {
  return (
    <div className={`${playfair.variable} bg-gray-100 min-h-screen`}>
      <div className="flex min-h-screen">
        <Sidebar playfairClass={playfair.className} />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="md:hidden bg-black text-white py-4 px-12 font-bold text-center tracking-wide border-b-2 border-yellow-600 shadow-xl flex items-center justify-center min-h-[70px]">
            <span className="text-sm md:text-base italic leading-tight">
              Bienvenue 👑<span className="text-yellow-500 font-serif">Queen Mooooo</span>👑, voici ton espace d&apos;administration
            </span>
          </div>

          <main className="p-4 md:p-10 flex-1">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
