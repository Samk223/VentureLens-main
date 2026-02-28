import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Simulate network delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For now, we are just simulating the email sending process
    console.log('Simulated sending contact email to:', email);

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
