import { prisma } from '@/lib/prisma-client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(null, { status: 201 });
    }

    const foundMe = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    return NextResponse.json(foundMe, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Can not get my profile data' },
      { status: 500 }
    );
  }
}
