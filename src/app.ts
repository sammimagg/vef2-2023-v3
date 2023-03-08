import express from 'express';
import { router } from './routes/api.js';
import dotenv from 'dotenv';

dotenv.config({ path: ".env" });

const app = express();

app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
