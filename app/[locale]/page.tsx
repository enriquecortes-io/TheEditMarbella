import HomeExperience from "@/components/Home/HomeExperience";
import PropertyCarousel from "@/components/Home/PropertyCarousel";
import Navbar from "@/components/Experience/Navbar";

interface Props { params: Promise<{ locale: string }>; }

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar locale={locale} />
      {/* Hero fijo */}
      <HomeExperience locale={locale} />
      {/* Carrusel — sección separada con scroll nativo */}
      <div style={{
        position:"relative",
        zIndex:50,
        marginTop:"100vh",
        background:"#080604",
        padding:"6rem clamp(1rem,5vw,4rem)",
        minHeight:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
      }}>
        <PropertyCarousel locale={locale} />
      </div>
    </>
  );
}
