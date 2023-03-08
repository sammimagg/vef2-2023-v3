import express, { Request, Response, NextFunction } from 'express';
import { query } from '../lib/db.js';
import { mapDbEventsToEvents } from '../lib/events.js';


export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const eventsResult = await query('SELECT * FROM events;');
  console.log("Her")
  const events = mapDbEventsToEvents(eventsResult)
  res.json(events);

}


router.get('/', index);

