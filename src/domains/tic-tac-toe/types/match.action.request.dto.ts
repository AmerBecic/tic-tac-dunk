export type MatchActionRequest = { expectedVersion: number } & (
  | { action: 'MOVE'; row: number; column: number; playerId: string }
  | {
      action:
        | 'FORFEIT'
        | 'SKIP'
        | 'TIMEOUT'
        | 'AI_TURN'
        | 'OFFER_DRAW'
        | 'ACCEPT_DRAW'
        | 'DECLINE_DRAW';
    }
);
