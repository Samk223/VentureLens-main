import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    // Simulate network delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For now, we are just simulating the email sending process
    console.log('Simulated sending demo email to:', email);

    return NextResponse.json({ success: true, message: 'Demo invitation sent successfully' });
  } catch (error) {
    console.error('Demo API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
