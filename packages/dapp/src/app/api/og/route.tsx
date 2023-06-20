/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const interRegular = fetch(
  new URL('../../../../public/fonts/Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL('../../../../public/fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
  try {
    const fontRegular = await interRegular;
    const fontBold = await interBold;

    const { searchParams } = new URL(req.url);

    const values = Object.fromEntries(searchParams);

    const {
      title = 'Masca',
      description = 'A MetaMask Snap (plugin/wallet) for decentralized identity - Decentralized identifiers (DIDs) and Verifiable Credentials (VCs).',
    } = values;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(0deg, rgba(255,175,138,1) 0%, rgba(255,171,185,1) 100%)',
          }}
        >
          <div tw="flex">
            <div tw="flex w-full flex-col p-12 md:flex-row md:items-center">
              <div tw="flex flex-3 flex-col">
                <h2
                  tw="tracking-tight text-6xl"
                  style={{
                    fontFamily: 'Inter Bold',
                    fontWeight: 'bold',
                  }}
                >
                  {title}
                </h2>
                <div
                  tw="tracking-tight text-2xl"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                  }}
                >
                  {description}
                </div>
              </div>
              <div tw="h-[128px] w-[2px] bg-gray-600 mx-8" />
              <div tw="flex flex-2 flex-col items-center justify-center">
                <img
                  alt="Masca logo"
                  width={333}
                  src="data:image/svg+xml,%3Csvg width='415' height='364' viewBox='0 0 415 364' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M363.619 182c0 100.516-81.399 182-181.809 182C81.399 364 0 282.516 0 182S81.399 0 181.81 0c100.41 0 181.809 81.484 181.809 182Z' fill='url(%23a)'/%3E%3Cpath d='M146.238 146.391c0-10.925 8.848-19.782 19.762-19.782h229.238c10.914 0 19.762 8.857 19.762 19.782v106.826c0 10.926-8.848 19.783-19.762 19.783H166c-10.914 0-19.762-8.857-19.762-19.783V146.391Z' fill='%23000'/%3E%3Cdefs%3E%3ClinearGradient id='a' x1='207.5' y1='0' x2='207.5' y2='364' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FE3D67'/%3E%3Cstop offset='1' stop-color='%23FF7131'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter Bold',
            data: fontBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
