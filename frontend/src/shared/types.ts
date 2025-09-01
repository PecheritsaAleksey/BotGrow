export interface Bot {
  id: string;
  name: string;
  description?: string | null;
  photoUrl?: string | null;
  tokenMasked: string;
  // NEW fields for webhook connection status
  status: 'connected' | 'disconnected' | 'error';
  webhookUrl?: string | null;
  lastError?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
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

export type ConnectResult = {
  status: 'connected';
  webhookUrl: string;
};

export type DisconnectResult = {
  status: 'disconnected';
};
