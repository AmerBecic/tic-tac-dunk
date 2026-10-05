export type MatchActionRequest = { expectedVersion: number } & (
  | { action: 'MOVE'; row: number; column: number; playerId: string }
  | {
      action:
        | 'FORFEIT'
        | 'SKIP'
        | 'OFFER_DRAW'
        | 'ACCEPT_DRAW'
        | 'DECLINE_DRAW';
    }
);
