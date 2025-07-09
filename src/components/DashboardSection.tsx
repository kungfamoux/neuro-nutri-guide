import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AssessmentCard from "./AssessmentCard";
import { 
  Brain, 
  Heart, 
  Activity, 
  Utensils, 
  TrendingUp, 
  Calendar,
  Target,
  Stethoscope 
} from "lucide-react";

const DashboardSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Personalized Recovery Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your health assessments to receive tailored nutrition recommendations 
            that support your stroke recovery journey.
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">3/5</p>
                  <p className="text-sm text-muted-foreground">Assessments</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
              <Progress value={60} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">87%</p>
                  <p className="text-sm text-muted-foreground">Plan Adherence</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <Progress value={87} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-nutrition-orange/5 to-nutrition-orange/10 border-nutrition-orange/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-nutrition-orange">12</p>
                  <p className="text-sm text-muted-foreground">Days Tracking</p>
                </div>
                <Calendar className="h-8 w-8 text-nutrition-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-medical-green/5 to-medical-green/10 border-medical-green/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-medical-green">A+</p>
                  <p className="text-sm text-muted-foreground">Nutrition Score</p>
                </div>
                <Utensils className="h-8 w-8 text-medical-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AssessmentCard
            title="Medical History Review"
            description="Complete evaluation of your stroke history and current medications"
            duration="10-15 minutes"
            completed={true}
            priority="high"
            icon={<Stethoscope className="h-5 w-5" />}
          />

          <AssessmentCard
            title="Dietary Preferences"
            description="Food allergies, preferences, and cultural dietary requirements"
            duration="5-8 minutes"
            completed={true}
            priority="medium"
            icon={<Utensils className="h-5 w-5" />}
          />

          <AssessmentCard
            title="Physical Activity Level"
            description="Current mobility and exercise capacity assessment"
            duration="8-12 minutes"
            completed={true}
            progress={100}
            priority="medium"
            icon={<Activity className="h-5 w-5" />}
          />

          <AssessmentCard
            title="Cognitive Function"
            description="Memory and cognitive abilities evaluation for meal planning"
            duration="15-20 minutes"
            completed={false}
            progress={45}
            priority="high"
            icon={<Brain className="h-5 w-5" />}
          />

          <AssessmentCard
            title="Cardiovascular Risk"
            description="Blood pressure, cholesterol, and heart health assessment"
            duration="10-15 minutes"
            completed={false}
            progress={0}
            priority="high"
            icon={<Heart className="h-5 w-5" />}
          />

          <AssessmentCard
            title="Swallowing Assessment"
            description="Dysphagia screening for safe eating recommendations"
            duration="5-10 minutes"
            completed={false}
            progress={0}
            priority="medium"
            icon={<Utensils className="h-5 w-5" />}
          />
        </div>

        {/* Next Steps */}
        <Card className="mt-12 bg-gradient-soft border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Next Steps in Your Recovery Journey</span>
            </CardTitle>
            <CardDescription>
              Based on your completed assessments, here are your personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  High Priority
                </Badge>
                <p className="text-sm">Complete your cognitive function assessment to receive memory-friendly meal planning strategies.</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-warning/10 text-warning">
                  Recommended
                </Badge>
                <p className="text-sm">Schedule cardiovascular risk assessment to optimize heart-healthy nutrition recommendations.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DashboardSection;