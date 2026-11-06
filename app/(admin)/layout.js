import Sidebar from "./Sidebar";

export const metadata = {
  title: 'Administration',
  robots: { index: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper text-ink md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
