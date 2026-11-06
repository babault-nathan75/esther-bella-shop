import HomeView from "@/components/HomeView";

// AJOUT DE LA VÉRIFICATION GOOGLE ICI
export const metadata = {
  alternates: { canonical: "/" },
  verification: {
    google: "google68e8f6a4daa6f8f5",
  },
};

export default function HomePage() {
  return <HomeView />;
}
