import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle, Stethoscope } from "lucide-react";

interface AssessmentCardProps {
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  progress?: number;
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
}

const AssessmentCard = ({ 
  title, 
  description, 
  duration, 
  completed, 
  progress = 0, 
  priority,
  icon 
}: AssessmentCardProps) => {
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-warning text-warning-foreground", 
    low: "bg-success text-success-foreground"
  };

  return (
    <Card className="hover:shadow-medical transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-medical rounded-lg text-white">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className={priorityColors[priority]}>
            {priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            {completed ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
            <span>{completed ? "Completed" : "Pending"}</span>
          </div>
        </div>

        {!completed && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button 
          className={`w-full ${completed ? 'bg-success hover:bg-success/90' : 'bg-gradient-primary hover:shadow-glow'} transition-all`}
          disabled={completed}
        >
          {completed ? "View Results" : "Start Assessment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssessmentCard;