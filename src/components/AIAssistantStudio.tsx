import React from 'react';
import { ARIAIntelligenceInterface } from '../features/aria';
import { WardrobeItem } from '../platform';

interface AIAssistantStudioProps {
  wardrobe?: WardrobeItem[];
  onNavigateToTab?: (tab: string) => void;
}

export const AIAssistantStudio: React.FC<AIAssistantStudioProps> = ({ wardrobe, onNavigateToTab }) => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] bg-[#05050a]">
      <ARIAIntelligenceInterface
        userId="guest-sartorialist-user-100"
        wardrobe={wardrobe}
        onNavigate={(view) => {
          if (onNavigateToTab) {
            onNavigateToTab(view);
          }
        }}
      />
    </div>
  );
};

