import express, { Request,Response,NextFunction } from 'express';
import { router } from './routes/api.js';
import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret,
  DATABASE_URL: connectionString,
} = process.env;
if (!connectionString || !sessionSecret) {
  console.error("Vantar gögn í env");
  process.exit(1);
}


const app = express();
app.use(express.json());
app.use(router);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

function notFoundHandler(req: Request, res: Response, next: NextFunction) { 
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => { 
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    err.status === 400 &&
    'body' in err
  ) {
    return res.status(400).json({ error: 'invalid json'});
  }

  console.error('error handling route', err);
  return res
    .status(500)
    .json({error: err.message ?? 'internal server error' });
});
app.use(notFoundHandler);
