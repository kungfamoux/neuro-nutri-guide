import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Apple, 
  Fish, 
  Wheat, 
  Droplets, 
  Clock, 
  ChefHat,
  Heart,
  Brain,
  Zap,
  CheckCircle
} from "lucide-react";

const NutritionPlan = () => {
  const dailyGoals = [
    { name: "Omega-3 Fatty Acids", current: 2.1, target: 3.0, unit: "g", icon: Fish, color: "text-primary" },
    { name: "Antioxidants", current: 85, target: 100, unit: "%", icon: Apple, color: "text-success" },
    { name: "Whole Grains", current: 3, target: 4, unit: "servings", icon: Wheat, color: "text-nutrition-orange" },
    { name: "Hydration", current: 6, target: 8, unit: "glasses", icon: Droplets, color: "text-medical-blue" }
  ];

  const mealPlan = [
    {
      time: "Breakfast",
      title: "Brain-Boost Berry Bowl",
      description: "Oatmeal with blueberries, walnuts, and flaxseed",
      benefits: ["Antioxidants", "Omega-3", "Fiber"],
      calories: 340,
      icon: <ChefHat className="h-5 w-5" />
    },
    {
      time: "Lunch", 
      title: "Mediterranean Salmon Salad",
      description: "Grilled salmon with mixed greens, olive oil, and avocado",
      benefits: ["Heart Health", "Healthy Fats", "Protein"],
      calories: 485,
      icon: <Heart className="h-5 w-5" />
    },
    {
      time: "Dinner",
      title: "Cognitive Support Stir-Fry",
      description: "Tofu with broccoli, bell peppers, and brown rice",
      benefits: ["Brain Health", "Vitamins", "Complex Carbs"],
      calories: 420,
      icon: <Brain className="h-5 w-5" />
    },
    {
      time: "Snack",
      title: "Energy Nut Mix",
      description: "Almonds, dark chocolate, and dried berries",
      benefits: ["Energy", "Antioxidants", "Healthy Fats"],
      calories: 180,
      icon: <Zap className="h-5 w-5" />
    }
  ];

  return (
    <section className="py-16 px-4 bg-medical-soft">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Personalized Nutrition Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Science-based meal recommendations designed specifically for stroke recovery and brain health optimization.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Goals */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Today's Goals</span>
                </CardTitle>
                <CardDescription>Track your daily nutrition targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {dailyGoals.map((goal, index) => {
                  const IconComponent = goal.icon;
                  const percentage = (goal.current / goal.target) * 100;
                  
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`h-5 w-5 ${goal.color}`} />
                          <span className="font-medium text-sm">{goal.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {goal.current}/{goal.target} {goal.unit}
                        </Badge>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">87%</p>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meal Plan */}
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {mealPlan.map((meal, index) => (
                <Card key={index} className="hover:shadow-medical transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-gradient-medical p-3 rounded-lg text-white">
                          {meal.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {meal.time}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{meal.calories} cal</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{meal.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{meal.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {meal.benefits.map((benefit, benefitIndex) => (
                              <Badge key={benefitIndex} variant="secondary" className="text-xs bg-primary/10 text-primary">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline">
                          View Recipe
                        </Button>
                        <Button size="sm" className="bg-gradient-primary">
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Plan Summary */}
            <Card className="mt-6 bg-gradient-soft">
              <CardHeader>
                <CardTitle>Plan Benefits</CardTitle>
                <CardDescription>How this plan supports your stroke recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Cognitive Support</h4>
                    <p className="text-sm text-muted-foreground">Omega-3s and antioxidants for brain health</p>
                  </div>
                  <div className="text-center p-4">
                    <Heart className="h-8 w-8 text-success mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Heart Protection</h4>
                    <p className="text-sm text-muted-foreground">Low sodium, heart-healthy nutrients</p>
                  </div>
                  <div className="text-center p-4">
                    <Zap className="h-8 w-8 text-nutrition-orange mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Energy Balance</h4>
                    <p className="text-sm text-muted-foreground">Steady energy for recovery activities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionPlan;