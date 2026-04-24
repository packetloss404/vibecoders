import { getLiveStatus } from '../../lib/liveStatus';

export async function GET() {
  const data = await getLiveStatus();
  if (data === null) {
    return Response.json({ error: 'Failed to check live status' }, { status: 500 });
  }
  return Response.json(data, {
    headers: { 'Cache-Control': 'public, max-age=180, s-maxage=180' },
  });
}
