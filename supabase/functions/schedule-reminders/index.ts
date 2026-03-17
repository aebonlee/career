import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const now = new Date();
    let reminderCount = 0;

    // Check for bookings 24 hours from now (±5 min window)
    const h24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const h24Min = new Date(h24.getTime() - 5 * 60 * 1000).toISOString();
    const h24Max = new Date(h24.getTime() + 5 * 60 * 1000).toISOString();

    // Check for bookings 1 hour from now (±5 min window)
    const h1 = new Date(now.getTime() + 60 * 60 * 1000);
    const h1Min = new Date(h1.getTime() - 5 * 60 * 1000).toISOString();
    const h1Max = new Date(h1.getTime() + 5 * 60 * 1000).toISOString();

    for (const [minTime, maxTime, label] of [[h24Min, h24Max, '24시간'], [h1Min, h1Max, '1시간']] as const) {
      const { data: bookings } = await supabase
        .from('career_bookings')
        .select('*, career_time_slots(start_time), career_mentors(profile_id), career_profiles!career_bookings_mentee_id_fkey(full_name, phone)')
        .eq('status', 'confirmed')
        .gte('career_time_slots.start_time', minTime)
        .lte('career_time_slots.start_time', maxTime);

      if (!bookings) continue;

      for (const booking of bookings) {
        // Notify mentee
        await supabase.from('career_notifications').insert({
          user_id: booking.mentee_id,
          type: 'reminder',
          title: `상담 ${label} 전 알림`,
          body: `예약하신 상담이 ${label} 후에 시작됩니다.`,
          link: '/dashboard',
        });

        // Notify mentor
        await supabase.from('career_notifications').insert({
          user_id: booking.career_mentors?.profile_id,
          type: 'reminder',
          title: `상담 ${label} 전 알림`,
          body: `예정된 상담이 ${label} 후에 시작됩니다.`,
          link: '/mentor-dashboard',
        });

        reminderCount += 2;
      }
    }

    return new Response(JSON.stringify({ success: true, remindersSent: reminderCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
