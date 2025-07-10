import React from 'react';

const About: React.FC = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8">About NeuroNutri Guide</h1>
    <div className="prose max-w-4xl">
      <p className="mb-4">
        NeuroNutri Guide is a cutting-edge platform that combines medical data-input with machine learning model trained to anlyze the data and provide personalized nutrition and lifestyle recommendations for stroke prevention and recovery.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
      <p className="mb-4">
        Our mission is to enable individuals get personalized nutrition and lifestyle recommendations to reduce their stroke risk.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
      <p className="mb-4">
        Using advanced machine learning algorithms, we analyze your health profile, medical history, and lifestyle factors to create a customized nutrition plan tailored to your specific needs and risk factors.
      </p>
    </div>
  </div>
);

export default About;
