import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Heart, Utensils, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-nutrition.jpg";

const HeroSection = () => {
  return (
    <section className="bg-gradient-soft py-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Personalized{" "}
                <span className="bg-gradient-medical bg-clip-text text-transparent">
                  Nutrition Guidance
                </span>{" "}
                for Stroke Recovery
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Evidence-based dietary recommendations tailored to your specific recovery needs. 
                Optimize your nutrition to support brain health, reduce cardiovascular risk, and 
                accelerate your healing journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary text-white shadow-medical hover:shadow-glow transition-all">
                Start Your Assessment
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Recovery Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Expert Guidance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-nutrition-orange">500+</div>
                <div className="text-sm text-muted-foreground">Meal Plans</div>
              </div>
            </div>
          </div>

          {/* Image & Feature Cards */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-medical">
              <img 
                src={heroImage} 
                alt="Nutritious foods for stroke recovery" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Feature Cards */}
            <div className="absolute -top-4 -left-4 z-10">
              <Card className="p-4 bg-card shadow-card animate-pulse-medical">
                <div className="flex items-center space-x-3">
                  <Brain className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Brain Health</div>
                    <div className="text-xs text-muted-foreground">Cognitive Support</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute -bottom-4 -right-4 z-10">
              <Card className="p-4 bg-card shadow-card animate-pulse-medical" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-success" />
                  <div>
                    <div className="font-semibold text-sm">Track Progress</div>
                    <div className="text-xs text-muted-foreground">Recovery Metrics</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;