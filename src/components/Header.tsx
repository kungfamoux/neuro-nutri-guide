import { Heart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-medical p-2 rounded-xl shadow-medical">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NeuroNutri Guide</h1>
              <p className="text-sm text-muted-foreground">Stroke Recovery Nutrition</p>
            </div>
          </div>

          {/* Navigation and profile removed as per user request */}
          <div className="flex-1"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;