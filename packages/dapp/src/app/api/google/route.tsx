import { NextRequest, NextResponse } from 'next/server';
import { drive_v3, google } from 'googleapis';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const actions = ['import', 'backup', 'delete'];

async function createDriveInstance(accessToken: string) {
  if (!accessToken) throw new Error('Missing accessToken');
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  google.options({ auth: oauth2Client });
  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });
  return drive;
}

async function verifyAccessToken(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
  return tokenInfo;
}

async function createDriveFile(drive: drive_v3.Drive, content: string) {
  const mimeType = 'text/plain';
  const fileMetadata = {
    parents: ['appDataFolder'],
    name: process.env.GOOGLE_DRIVE_FILE_NAME,
    mimeType,
  };
  const media = {
    mimeType,
    body: content,
  };
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
  });
  return res.data;
}

async function getBackupFileId(drive: drive_v3.Drive) {
  let id = '';
  const list = await drive.files.list({
    q: `name='${process.env.GOOGLE_DRIVE_FILE_NAME}'`,
    spaces: 'appDataFolder',
  });

  if (list.data.files?.length) {
    id = list.data.files[0].id!;
  }
  return id || false;
}

async function getBackupFileContent(drive: drive_v3.Drive) {
  const id = await getBackupFileId(drive);
  if (!id) throw new Error('File not found');

  const res = await drive.files.get({
    fileId: id,
    alt: 'media',
  });

  if (!res.data || res.status !== 200) throw new Error('Error getting file');
  return res.data as string;
}

async function updateDriveFile(drive: drive_v3.Drive, content: string) {
  const fileId = await getBackupFileId(drive);
  if (!fileId) {
    const res = createDriveFile(drive, content);
    return res;
  }
  const media = {
    mimeType: 'text/plain',
    body: content,
  };
  const res = await drive.files.update({
    fileId,
    media,
  });
  return res.data;
}

async function deleteDriveFile(drive: drive_v3.Drive) {
  const fileId = await getBackupFileId(drive);
  if (!fileId) throw new Error('File not found');

  const res = await drive.files.delete({
    fileId,
  });
  return res.data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.data) {
      return new NextResponse('Missing data parameter', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    const { accessToken, action, content } = body.data;
    if (!actions.includes(action)) {
      return new NextResponse('Invalid action', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    // Verify access token
    const tokenInfo = await verifyAccessToken(accessToken);

    const scopes = process.env.NEXT_PUBLIC_GOOGLE_SCOPES?.split(' ');
    if (
      !tokenInfo.scopes ||
      !scopes?.every((scope) => tokenInfo.scopes.includes(scope))
    ) {
      return new NextResponse('Invalid access token', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }

    const drive = await createDriveInstance(accessToken);

    if (!drive) {
      return new NextResponse('Error creating drive instance', {
        status: 400,
        headers: { ...CORS_HEADERS },
      });
    }
    switch (action) {
      case 'import': {
        const fileContent = await getBackupFileContent(drive);
        return new NextResponse(fileContent, {
          headers: { ...CORS_HEADERS },
        });
      }
      case 'backup': {
        if (!content) {
          return new NextResponse('Missing content parameter', {
            status: 400,
            headers: { ...CORS_HEADERS },
          });
        }
        const file = await updateDriveFile(drive, content);
        return new NextResponse(JSON.stringify(file), {
          headers: { ...CORS_HEADERS },
        });
      }
      case 'delete': {
        const file = await deleteDriveFile(drive);
        return new NextResponse(JSON.stringify(file), {
          headers: { ...CORS_HEADERS },
        });
      }
      default:
        return new NextResponse('Invalid action', {
          status: 400,
          headers: { ...CORS_HEADERS },
        });
    }
  } catch (e) {
    return new NextResponse((e as Error).message, {
      status: 400,
      headers: { ...CORS_HEADERS },
    });
  }
}
