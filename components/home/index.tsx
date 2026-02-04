import Ecosystem from "@/components/home/Ecosystem";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import PathSteps from "@/components/home/PathSteps";
import SafetyNotice from "@/components/home/SafetyNotice";
import SkillCategories from "@/components/home/SkillCategories";

export default function HomeComponent() {
  return (
    <>
      <Hero />
      <Features />
      <PathSteps />
      <SkillCategories />
      <Ecosystem />
      <SafetyNotice />
    </>
  );
}
