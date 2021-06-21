export enum ResolutionType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export interface Rule {
  name: string;
  resource: string;
  expression: string;
  message: string;
  code: string;
  matchExpression: string;
  outcomeType: string;
  outcomeDescription: string;
  resolutionType: ResolutionType;
}
