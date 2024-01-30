/* eslint-disable @next/next/no-img-element */
import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const interRegular = fetch(
    new URL('../../../../public/fonts/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const calSansSemiBold = fetch(
    new URL('../../../../public/fonts/CalSans-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  try {
    const fontRegular = await interRegular;
    const fontBold = await calSansSemiBold;

    const { searchParams } = new URL(req.url);

    const values = Object.fromEntries(searchParams);

    const {
      title = 'Masca',
      description = 'A MetaMask Snap (plugin/wallet) for decentralized identity - Decentralized identifiers (DIDs) and Verifiable Credentials (VCs).',
      type,
      holder,
      numberOfCredentials,
      credentialIssuer = 'unknown',
      credentialType = 'unknown',
      credentialSubject = 'unknown',
      credentialIssuanceDate = 'unknown',
    } = values;

    if (type && type === 'share-presentation') {
      // If 1 VC show VC

      if (numberOfCredentials === '1') {
        return new ImageResponse(
          (
            <div
              tw="flex justify-center items-center"
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
              <div
                tw="flex p-8 items-center justify-between rounded-3xl shadow-md shadow-black/50 w-[800px]"
                style={{
                  background: 'linear-gradient(#E5591A, #F21D4B)',
                }}
              >
                <div
                  tw="flex-col"
                  style={{
                    display: 'flex',
                  }}
                >
                  <div
                    tw="flex text-4xl text-white"
                    style={{
                      fontFamily: 'Cal Sans semibold',
                    }}
                  >
                    {title}
                  </div>
                  <div tw="text-md text-orange-100 mt-12">ISSUED BY</div>
                  <div
                    tw="tracking-tight flex text-xl text-white"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 'normal',
                    }}
                  >
                    {credentialIssuer.substring(0, 10)}...
                    {credentialIssuer.substring(
                      holder.length,
                      holder.length - 10
                    )}
                  </div>
                  <div tw="text-md text-orange-100 mt-4">ISSUED TO</div>
                  <div
                    tw="tracking-tight flex text-xl text-white"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 'normal',
                    }}
                  >
                    {credentialSubject.substring(0, 10)}...
                    {credentialSubject.substring(
                      holder.length,
                      holder.length - 10
                    )}
                  </div>
                  <div tw="text-md text-orange-100 mt-4">ISSUED ON</div>
                  <div
                    tw="tracking-tight flex text-xl text-white"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 'normal',
                    }}
                  >
                    {new Date(
                      Date.parse(credentialIssuanceDate)
                    ).toDateString()}
                  </div>
                </div>
                <div
                  tw="text-4xl flex w-full text-orange-100 justify-end"
                  style={{
                    fontFamily: 'Inter Medium',
                  }}
                >
                  {credentialType.split(',')[0]}
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
                name: 'Inter Medium',
                data: fontRegular,
                weight: 600,
                style: 'normal',
              },
              {
                name: 'Cal Sans SemiBold',
                data: fontBold,
                weight: 700,
                style: 'normal',
              },
            ],
          }
        );
      }

      // If more...
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
            <div tw="flex justify-center">
              <div tw="flex ml-16 w-full flex-col p-12 md:flex-row md:items-center justify-center">
                <div
                  tw="flex flex-3 flex-col p-4 rounded-3xl shadow-md shadow-black/50"
                  style={{
                    background: 'linear-gradient(#E5591A, #F21D4B)',
                  }}
                >
                  <h2
                    tw="text-6xl text-white"
                    style={{
                      fontFamily: 'Cal Sans SemiBold',
                      fontWeight: 'bold',
                    }}
                  >
                    {title}
                  </h2>
                  <div tw="text-md text-orange-100 mt-4">HELD BY</div>
                  <div
                    tw="tracking-tight flex text-3xl text-white"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 'normal',
                    }}
                  >
                    {holder.substring(0, 20)}...
                    {holder.substring(holder.length, holder.length - 10)}
                    di
                  </div>
                  <div tw="text-md text-orange-100 mt-4">
                    NUMBER OF CREDENTIALS
                  </div>
                  <div
                    tw="tracking-tight flex text-3xl text-white"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 'normal',
                    }}
                  >
                    {numberOfCredentials}
                  </div>
                </div>
                <div tw="flex flex-2 flex-col items-center justify-center">
                  <img
                    alt="Masca logo"
                    width={256}
                    src="https://masca.io/images/masca_black.svg"
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
              name: 'Cal Sans SemiBold',
              data: fontBold,
              weight: 700,
              style: 'normal',
            },
          ],
        }
      );
    }

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
          <div tw="flex justify-center">
            <div tw="flex justify-center w-full flex-col p-12 md:flex-row md:items-center">
              <div tw="pl-8 flex flex-3 flex-col">
                <h2
                  tw="text-6xl"
                  style={{
                    fontFamily: 'Cal Sans SemiBold',
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
              <div tw="h-[256px] w-[2px] bg-gray-600 mx-8" />
              <div tw="flex flex-2 flex-col items-center justify-center">
                <img
                  alt="Masca logo"
                  width={256}
                  src="https://masca.io/images/masca_black.svg"
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
            name: 'Cal Sans SemiBold',
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
