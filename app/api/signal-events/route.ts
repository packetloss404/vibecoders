import { getEvents } from '../../lib/signalEvents';
import { getLiveStatus } from '../../lib/liveStatus';

export async function GET() {
  // Trigger a live-status refresh so any transitions since the last poll land
  // in the event log before we read it. getLiveStatus() is cached for 3 min so
  // this is free when called frequently.
  await getLiveStatus();

  const events = getEvents();
  return Response.json(
    { events },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
