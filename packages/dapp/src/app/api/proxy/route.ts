import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: Request) {
  // Get url from search params where to send the request
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  console.log(url);

  if (!url) {
    return new Response('Missing url parameter', {
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

  if (!response.ok && response.status !== 302) {
    return new Response('Bad response from server', {
      status: 400,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  if (!response.headers.has('location')) {
    return new Response('Missing location header', {
      status: 400,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  console.log(response.headers.get('location'));

  return NextResponse.json(
    { location: response.headers.get('location') },
    { headers: { ...CORS_HEADERS } }
  );
}

export async function POST(request: Request) {
  try {
    // Get url from search params where to forward the request
    const body = await request.json();

    if (!body.redirectUri) {
      return new Response('Missing redirectUri parameter', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    if (!body.data) {
      return new Response('Missing data parameter', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    console.log(body.data);
    console.log(body.redirectUri);
    // Forward the request to the url
    const response = await fetch(body.redirectUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'manual',
      body: new URLSearchParams(body.data).toString(),
    });

    console.log(response.headers.get('location'));

    if (!response.ok && response.status !== 302) {
      return new Response('Bad response from server', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    if (!response.headers.has('location')) {
      return new Response('Missing location header', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    return NextResponse.json(
      { location: response.headers.get('location') },
      { headers: { ...CORS_HEADERS } }
    );
  } catch (e) {
    console.log(e);
    return new Response('Missing location header', {
      status: 400,
      headers: { ...CORS_HEADERS },
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response('', {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
