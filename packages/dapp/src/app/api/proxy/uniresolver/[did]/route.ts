import { type NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const UNIRESOLVER_URL = 'https://resolver.masca.io/1.0/identifiers';

export async function GET(
  _: NextRequest,
  { params: { did } }: { params: { did: string } }
) {
  // Forward the request to the uniresolver
  const response = await fetch(`${UNIRESOLVER_URL}/${did}`);

  if (!response.ok) {
    const { status, statusText } = response;
    const text = await response.text();

    return new NextResponse(text, {
      status,
      headers: {
        statusText,
        ...CORS_HEADERS,
      },
    });
  }

  const result = await response.json();
  return new NextResponse(JSON.stringify(result), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      // Add a cache header to avoid hitting the uniresolver too often
      'Cache-Control': 's-maxage=43200',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
