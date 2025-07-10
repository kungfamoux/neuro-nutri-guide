import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ProgressBar from './ProgressBar';

const Progress: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const progressData = {
    riskLevel: 0.65, // 65% risk
    lastCheckup: '2025-06-15',
    nextCheckup: '2025-09-15',
    goals: [
      { id: 1, text: 'Reduce sodium intake', completed: false },
      { id: 2, text: '30 minutes of exercise 5x/week', completed: true },
      { id: 3, text: 'Eat 5 servings of vegetables daily', completed: false },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stroke Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressBar 
                value={progressData.riskLevel} 
                label={`Your current stroke risk: ${Math.round(progressData.riskLevel * 100)}%`} 
              />
              <div className="text-sm text-muted-foreground">
                <p>Last checkup: {new Date(progressData.lastCheckup).toLocaleDateString()}</p>
                <p>Next checkup: {new Date(progressData.nextCheckup).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Health Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {progressData.goals.map((goal) => (
                <li key={goal.id} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`goal-${goal.id}`}
                    checked={goal.completed}
                    readOnly
                    aria-label={goal.completed ? `Completed: ${goal.text}` : `Not completed: ${goal.text}`}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className={`ml-3 ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
