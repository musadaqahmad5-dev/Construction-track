import React from 'react';
import { useAIStylistWorkspace } from './hooks/useAIStylistWorkspace';
import { WorkspaceLayout } from './WorkspaceLayout';
import { StylistAction } from '../../ai/stylist';

export interface AIStylistWorkspaceProps {
  userId?: string;
  initialSessionId?: string;
  onNavigate?: (view: string, params?: any) => void;
}

export const AIStylistWorkspace: React.FC<AIStylistWorkspaceProps> = ({
  userId = 'guest-sartorialist-user-100',
  initialSessionId,
  onNavigate
}) => {
  const {
    sessionId,
    messages,
    latestResponse,
    recommendations,
    thinking,
    activeIntent,
    styleProfile,
    isProcessing,
    streaming,
    sendMessage,
    resetSession,
    executeAction
  } = useAIStylistWorkspace(userId, initialSessionId);

  const handleExecuteAction = (action: StylistAction) => {
    executeAction(action);

    if (typeof window !== 'undefined') {
      const toastEvent = new CustomEvent('lookvision_show_toast', {
        detail: {
          message: `Executed: ${action.label || action.type}`,
          type: 'info'
        }
      });
      window.dispatchEvent(toastEvent);
    }

    if (action.type === 'NAVIGATE' && action.payload?.view && onNavigate) {
      onNavigate(action.payload.view, action.payload);
    }
  };

  return (
    <div className="w-full h-full bg-[#05050a]">
      <WorkspaceLayout
        sessionId={sessionId}
        messages={messages}
        thinking={thinking}
        isProcessing={isProcessing}
        activeIntent={activeIntent}
        styleProfile={styleProfile}
        recommendations={recommendations}
        streaming={streaming}
        onSendMessage={sendMessage}
        onExecuteAction={handleExecuteAction}
        onResetSession={resetSession}
      />
    </div>
  );
};

export default AIStylistWorkspace;
