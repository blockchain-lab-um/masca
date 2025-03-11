import { type NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get url from search params where to send the request
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return new NextResponse('Missing url parameter', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    // Send the request to the url
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'manual',
    });

    if (response.status !== 302) {
      return new NextResponse('Bad response from server', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!response.headers.has('location')) {
      return new NextResponse('Missing location header', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    return NextResponse.json(
      { location: response.headers.get('location') },
      { headers: { ...CORS_HEADERS } }
    );
  } catch (e) {
    console.error(e);
    return new NextResponse('Bad request', {
      status: 400,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get url from search params where to forward the request
    const body = await request.json();

    if (!body.redirectUri) {
      return new NextResponse('Missing redirectUri parameter', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    if (!body.data) {
      return new NextResponse('Missing data parameter', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    // Forward the request to the url
    const response = await fetch(body.redirectUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'manual',
      body: new URLSearchParams(body.data).toString(),
    });

    if (response.status !== 302) {
      return new NextResponse('Bad response from server', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    if (!response.headers.has('location')) {
      return new NextResponse('Missing location header', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    return NextResponse.json(
      { location: response.headers.get('location') },
      { headers: { ...CORS_HEADERS } }
    );
  } catch (e) {
    console.error(e);
    return new NextResponse('Missing location header', {
      status: 400,
      headers: { ...CORS_HEADERS },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
