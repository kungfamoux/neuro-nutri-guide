import React from 'react';

const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
    </div>
  </div>
);

export default NotFound;
