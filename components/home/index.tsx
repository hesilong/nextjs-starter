import Ecosystem from "@/components/home/Ecosystem";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import OpenClawLongform from "@/components/home/OpenClawLongform";
import PathSteps from "@/components/home/PathSteps";
import SafetyNotice from "@/components/home/SafetyNotice";
import SkillScenarios from "@/components/home/SkillScenarios";

export default function HomeComponent({ locale }: { locale: string }) {
  return (
    <>
      <Hero />
      <Features />
      <PathSteps />
      <SkillScenarios />
      <OpenClawLongform locale={locale} />
      <Ecosystem />
      <SafetyNotice />
    </>
  );
}
