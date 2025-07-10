import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Resources: React.FC = () => {
  const resources = [
    {
      title: 'Understanding Stroke Risk',
      description: 'Learn about the factors that contribute to stroke risk and how to manage them.',
      link: '#',
    },
    {
      title: 'Heart-Healthy Diet Guide',
      description: 'Discover foods that support cardiovascular health and reduce stroke risk.',
      link: '#',
    },
    {
      title: 'Exercise for Stroke Prevention',
      description: 'Find safe and effective exercises to improve circulation and overall health.',
      link: '#',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Educational Resources</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground mb-4">{resource.description}</p>
              <a 
                href={resource.link} 
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resources;
