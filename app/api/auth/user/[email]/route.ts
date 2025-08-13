import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_REQRES_BASE_URL || '';
const API_KEY = process.env.REQRES_API_KEY || '';

if (!BASE_URL || !API_KEY) {
  throw new Error('Missing API configuration');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await context.params;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch users' },
        { status: response.status }
      );
    }

    const user = data.data?.find((u: { email: string }) => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('User lookup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
