export interface Bot {
  id: number;
  name: string;
  description?: string | null;
  photoUrl?: string | null;
  tokenMasked: string;
  createdAt: string;
  updatedAt: string;
}

export interface BotWithToken {
  bot: Bot;
  plainBotToken?: string;
}

export interface CreateBotInput {
  name: string;
  description?: string | null;
  photoUrl?: string | null;
  botToken: string;
}

export interface UpdateBotInput {
  name?: string;
  description?: string | null;
  photoUrl?: string | null;
  botToken?: string;
}
