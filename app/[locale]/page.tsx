import HomeExperience from "@/components/Home/HomeExperience";
import Navbar from "@/components/Experience/Navbar";

interface Props { params: Promise<{ locale: string }>; }

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar locale={locale} />
      <HomeExperience locale={locale} />
    </>
  );
}
