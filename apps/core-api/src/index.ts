import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
