export type GreetingType = 'text' | 'link' | 'file';

export interface BotConfig {
  token: string;
  greeting?: {
    type: GreetingType;
    payload: string;
    text?: string;
  };
}
