import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Get session ID from URL
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return new Response("Missing 'sessionId' query parameter", {
      status: 400,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  // Get session from database
  const session = await prisma.sessions.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    return new Response('Session not found', {
      status: 404,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  // Get session data
  return NextResponse.json({ data: session.data });
}

export async function POST(request: Request) {
  try {
    const { sessionId, data } = await request.json();

    if (!sessionId) {
      return new Response("Missing 'sessionId' parameter", {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!data) {
      return new Response("Missing 'data' parameter", {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    // Put session data in database
    await prisma.sessions.upsert({
      where: {
        id: sessionId,
      },
      update: {
        data,
      },
      create: {
        id: sessionId,
        data,
      },
    });

    return new Response(null, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
      },
    });
  } catch (e) {
    console.log(e);
    return new Response('Bad request', {
      status: 400,
      headers: { ...CORS_HEADERS },
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
