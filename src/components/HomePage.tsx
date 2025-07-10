import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Personalized Nutrition for Stroke Prevention
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Get personalized dietary recommendations based on your health profile and stroke risk factors.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/patient/form">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="text-primary text-3xl mb-4">1</div>
          <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
          <p className="text-muted-foreground">
            Share your health information and dietary preferences to get started.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="text-primary text-3xl mb-4">2</div>
          <h3 className="text-xl font-semibold mb-2">Get Your Analysis</h3>
          <p className="text-muted-foreground">
            Our AI analyzes your data to assess stroke risk and nutritional needs.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="text-primary text-3xl mb-4">3</div>
          <h3 className="text-xl font-semibold mb-2">Receive Recommendations</h3>
          <p className="text-muted-foreground">
            Get personalized nutrition and lifestyle recommendations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
