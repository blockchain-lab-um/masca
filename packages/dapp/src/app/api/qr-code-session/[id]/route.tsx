import { NextResponse } from 'next/server';

import { prisma } from '@/utils/prisma';

export async function GET(
  _: Request,
  { params: { id } }: { params: { id: string } }
) {
  if (!id) {
    return NextResponse.json(
      { error_description: 'Missing sessionId parameter' },
      { status: 400 }
    );
  }
  console.log('Get request');
  // Get session from database
  const session = await prisma.sessions.findUnique({
    where: {
      id,
    },
  });

  if (!session) {
    return NextResponse.json(
      { error_description: 'Session not found' },
      { status: 404 }
    );
  }

  await prisma.sessions.delete({
    where: {
      id,
    },
  });

  // Get session data
  return NextResponse.json(
    { data: session.data, iv: session.iv },
    { status: 200 }
  );
}

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  console.log('Post request');
  try {
    const jsonData = await request.json();

    const { data, iv } = jsonData;
    if (!id) {
      return NextResponse.json(
        { error_description: 'Missing sessionId' },
        {
          status: 400,
        }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error_description: "Missing 'data' parameter" },
        {
          status: 400,
        }
      );
    }

    if (!iv) {
      return NextResponse.json(
        { error_description: "Missing 'iv' parameter" },
        {
          status: 400,
        }
      );
    }

    // Put session data in database
    await prisma.sessions.upsert({
      where: {
        id,
      },
      update: {
        data,
        iv,
      },
      create: {
        id,
        data,
        iv,
      },
    });

    return new NextResponse(null, {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error_description: 'Bad request' },
      {
        status: 400,
      }
    );
  }
}

export async function OPTIONS(_: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
