export type ValidateAnswerRequest = {
  row: number;
  column: number;
  playerId: string;
} & (
  | { source: 'DAILY'; puzzleId: string }
  | { source: 'MATCH'; matchId: string }
);

export type ValidateAnswerResponse = {
  data: { correct: boolean; jerseyColor?: string; trimColor?: string };
};
