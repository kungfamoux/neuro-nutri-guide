import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DashboardSection from "@/components/DashboardSection";
import NutritionPlan from "@/components/NutritionPlan";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <DashboardSection />
      <NutritionPlan />
    </div>
  );
};

export default Index;
