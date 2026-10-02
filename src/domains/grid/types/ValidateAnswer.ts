export type ValidateAnswerRequest = {
  puzzleId: string;
  row: number;
  column: number;
  playerId: string;
};

export type ValidateAnswerResponse = {
  data: { correct: boolean; jerseyColor?: string; trimColor?: string };
};
