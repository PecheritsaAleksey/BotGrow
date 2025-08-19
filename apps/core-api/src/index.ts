import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userService } from '@botgrow/db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

interface ContactBody {
  userId: string;
  username: string;
  lang: string;
}

app.post('/contacts', (req: Request, res: Response) => {
  const { userId, username, lang } = req.body as ContactBody;
  console.log({ userId, username, lang });
  res.sendStatus(200);
});

app.post('/auth/telegram', async (req: Request, res: Response) => {
  const telegramUser = req.body;
  try {
    const user = await userService.createOrUpdateByTelegram({
      telegramId: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      photoUrl: telegramUser.photo_url,
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to persist user' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
