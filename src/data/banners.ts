export interface Banner {
    title: string;
    description: string;
    image: string;
    buttonText: string;
  }
  
  export const banners: Banner[] = [
    {
      title: "Nouvelle Collection Tech 2025",
      description: "Découvrez nos dernières innovations technologiques",
      image: "https://example.com/banner1.jpg",
      buttonText: "Découvrir"
    },
    {
      title: "Offres Exclusives",
      description: "Jusqu'à -30% sur une sélection d'articles",
      image: "https://example.com/banner2.jpg",
      buttonText: "En Profiter"
    }
  ];