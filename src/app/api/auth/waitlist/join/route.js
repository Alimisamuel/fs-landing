import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, firstName = "", lastName = "" } = body;

    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Here you would typically save to your database
    // For now, we'll simulate a successful response
    console.log('Waitlist signup:', {
      email,
      firstName,
      lastName,
      timestamp: new Date().toISOString()
    });

    // TODO: Replace this with your actual database logic
    // Example database operations:
    // - Check if email already exists
    // - Save to waitlist table
    // - Send welcome email
    // - Add to email marketing platform

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined the waitlist!',
        data: {
          email,
          firstName,
          lastName
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}