import { QueryResult } from "pg";

/**
  CREATE TABLE public.events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  slug VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  location TEXT,
  url TEXT,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/
export type Event = {
    id: number;
    name: string;
    slug: string;
    location?: string;
    url?: string;
    description?: string;
    created: Date;
    updated: Date;
}

export function mapDbEventToEvent(input: unknown): Event | null {
    const potentialEvent = input as Partial<Event> | null;

    if (!potentialEvent || 
        !potentialEvent.id ||
        !potentialEvent.name ||
        !potentialEvent.slug ||
        !potentialEvent.created ||
        !potentialEvent.updated
        ) 
    {
        return null;
    }

    const event: Event = {
        id: potentialEvent.id,
        name: potentialEvent.name,
        slug: potentialEvent.slug,
        created: new Date(potentialEvent.created),
        updated: new Date(potentialEvent.updated),
    };

    return event;
}
export function mapDbEventsToEvents(input: QueryResult<any> | null): Array<Event> {
    if (!input) {
        return [];
    }
    const mappedEvents = input?.rows.map(mapDbEventToEvent);


   return mappedEvents.filter((i): i is Event => Boolean(i));
}