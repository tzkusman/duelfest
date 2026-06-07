import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: exists, error: rpcError } = await supabase.rpc('check_email_exists', {
    p_email: email.trim().toLowerCase(),
  });

  if (rpcError) {
    console.error('RPC error:', rpcError);
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  if (!exists) {
    return NextResponse.json({ needsRegistration: true });
  }

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: email.trim().toLowerCase(),
  });

  if (linkError || !linkData?.properties?.email_otp) {
    console.error('generateLink error:', linkError);
    return NextResponse.json(
      { error: linkError?.message || 'Failed to generate link' },
      { status: 500 },
    );
  }

  const otpToken = linkData.properties.email_otp;
  if (!otpToken) {
    return NextResponse.json({ error: 'Failed to extract verification code' }, { status: 500 });
  }

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: otpData, error: otpError } = await anonClient.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: otpToken,
    type: 'recovery',
  });

  if (otpError || !otpData?.session) {
    console.error('verifyOtp error:', otpError?.message, JSON.stringify(otpError));
    return NextResponse.json(
      { error: otpError?.message || 'Failed to create session' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    access_token: otpData.session.access_token,
    refresh_token: otpData.session.refresh_token,
  });
}
