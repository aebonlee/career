import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getIamportToken(): Promise<string> {
  const res = await fetch('https://api.iamport.kr/users/getToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imp_key: Deno.env.get('IMP_KEY'),
      imp_secret: Deno.env.get('IMP_SECRET'),
    }),
  });
  const data = await res.json();
  return data.response.access_token;
}

async function getPaymentInfo(impUid: string, token: string) {
  const res = await fetch(`https://api.iamport.kr/payments/${impUid}`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  return data.response;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imp_uid, merchant_uid } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get expected payment from DB
    const { data: payment, error: payErr } = await supabase
      .from('payments')
      .select('*, bookings(*)')
      .eq('merchant_uid', merchant_uid)
      .single();

    if (payErr || !payment) {
      return new Response(JSON.stringify({ error: 'Payment not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify with I'mport
    const token = await getIamportToken();
    const iamportPayment = await getPaymentInfo(imp_uid, token);

    if (iamportPayment.amount === payment.amount && iamportPayment.status === 'paid') {
      // Payment verified - update records
      await supabase.from('payments').update({
        imp_uid, status: 'paid', pg_response: iamportPayment, paid_at: new Date().toISOString(),
      }).eq('id', payment.id);

      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', payment.booking_id);

      // Notify mentee
      await supabase.from('notifications').insert({
        user_id: payment.bookings.mentee_id,
        type: 'booking_confirmed',
        title: '예약이 확정되었습니다',
        body: '결제가 완료되어 상담 예약이 확정되었습니다.',
        link: '/dashboard',
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      await supabase.from('payments').update({ imp_uid, status: 'failed', pg_response: iamportPayment }).eq('id', payment.id);

      return new Response(JSON.stringify({ success: false, error: 'Amount mismatch or payment not paid' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
