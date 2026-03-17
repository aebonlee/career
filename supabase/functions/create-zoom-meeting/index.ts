import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getZoomToken(): Promise<string> {
  const clientId = Deno.env.get('ZOOM_CLIENT_ID')!;
  const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET')!;
  const accountId = Deno.env.get('ZOOM_ACCOUNT_ID')!;

  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=account_credentials&account_id=${accountId}`,
  });

  const data = await res.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { bookingId, topic, startTime, duration, zoomEmail } = await req.json();

    const zoomToken = await getZoomToken();
    const email = zoomEmail || Deno.env.get('ZOOM_DEFAULT_EMAIL') || 'me';

    const meetingRes = await fetch(`https://api.zoom.us/v2/users/${email}/meetings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${zoomToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: topic || '상담공간 - 커리어 상담',
        type: 2,
        start_time: startTime,
        duration: duration || 50,
        timezone: 'Asia/Seoul',
        settings: {
          join_before_host: true,
          waiting_room: false,
          auto_recording: 'none',
        },
      }),
    });

    const meeting = await meetingRes.json();

    if (!meetingRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to create Zoom meeting', details: meeting }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update booking with Zoom info
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase.from('bookings').update({
      zoom_meeting_url: meeting.join_url,
      zoom_meeting_id: String(meeting.id),
    }).eq('id', bookingId);

    return new Response(JSON.stringify({
      success: true,
      join_url: meeting.join_url,
      meeting_id: meeting.id,
      password: meeting.password,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
