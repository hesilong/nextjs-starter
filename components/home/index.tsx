import Ecosystem from "@/components/home/Ecosystem";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import OpenClawLongform from "@/components/home/OpenClawLongform";
import PathSteps from "@/components/home/PathSteps";
import SafetyNotice from "@/components/home/SafetyNotice";
import SkillScenarios from "@/components/home/SkillScenarios";
import Reveal from "@/components/ui/reveal";

export default function HomeComponent({ locale }: { locale: string }) {
  return (
    <>
      <Reveal once={false}>
        <Hero />
      </Reveal>
      <Reveal delay={80} once={false}>
        <Features />
      </Reveal>
      <Reveal delay={120} once={false}>
        <PathSteps />
      </Reveal>
      <Reveal delay={160} once={false}>
        <SkillScenarios />
      </Reveal>
      <Reveal delay={200} once={false}>
        <OpenClawLongform locale={locale} />
      </Reveal>
      <Reveal delay={240} once={false}>
        <Ecosystem />
      </Reveal>
      <Reveal delay={280} once={false}>
        <SafetyNotice />
      </Reveal>
    </>
  );
}
