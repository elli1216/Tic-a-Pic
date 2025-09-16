import React from 'react';

interface Session {
  session_id: string;
  nickname?: string;
}

interface SessionInfoProps {
  session: Session | null;
}

export default function SessionInfo({ session }: SessionInfoProps) {
  if (!session) return null;

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-base-content/60">Session:</span>
          <span className="font-mono font-bold">{session.session_id}</span>
        </div>
        {session.nickname && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/60">Nickname:</span>
            <span className="font-bold">{session.nickname}</span>
          </div>
        )}
      </div>
    </div>
  );
}
