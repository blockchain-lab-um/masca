import { MULTIPART_BOUNDARY } from '@blockchain-lab-um/masca-types';

import StorageService from './Storage.service';

class GoogleService {
  /**
   * Function that returns the google access token
   * @returns string
   */
  static getGoogleSession(): string {
    const state = StorageService.get();
    const session = state.accountState[state.currentAccount].googleSession;
    if (!session) throw new Error('Google session not found');
    return session;
  }

  /**
   * Function that creates a multipart request body
   *
   * *__Note:__ This function is used to create a file in the google drive appDataFolder*
   * @param fileName - name of the file to create
   * @param content - content of the file to create
   * @returns string - multipart request body
   */
  static getMultiPartRequestBody(args: {
    fileName: string;
    content: string;
  }): string {
    const { fileName, content } = args;
    return `--${MULTIPART_BOUNDARY as string}
Content-Type: application/json; charset=UTF-8

{
  "name": "${fileName}",
  "parents": ["appDataFolder"]
}

--${MULTIPART_BOUNDARY as string}
Content-Type: text/plain

${content}

--${MULTIPART_BOUNDARY as string}--`;
  }

  /**
   * Function that creates a file in the google drive
   *
   * *__Note:__ This function is used to create a file in the google drive appDataFolder*
   * @param fileName - name of the file to create
   * @param content - content of the file to create
   * @returns string - id of the created file
   */
  static async createFile(args: {
    fileName: string;
    content: string;
  }): Promise<string> {
    const { fileName, content } = args;
    if (!fileName) throw new Error('Missing fileName parameter');
    if (!content) throw new Error('Missing content parameter');
    const reqBody = this.getMultiPartRequestBody(args);
    const requestParams = {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
        'Content-Type': `multipart/related; boundary=${MULTIPART_BOUNDARY}}`,
        'Content-Length': `${reqBody.length}`,
      }),
      body: reqBody,
    };
    try {
      const file = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        requestParams
      ).then((res) => res.json());
      return file.id as string;
    } catch (error) {
      console.error(`Failed to create file: ${(error as Error).message}`);
      throw new Error(`Failed to create file: ${(error as Error).message}`);
    }
  }

  /**
   * Function that searches for a file in the google drive
   *
   * *__Note:__ This function is used to create a file in the google drive appDataFolder*
   * @param fileName - name of the file to search
   * @returns string - id of the found file
   */
  static async findFile(args: { fileName?: string }): Promise<string> {
    const { fileName } = args;
    if (!fileName) throw new Error('Missing fileName parameter');
    const requestParams = {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
      }),
    };
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name = '${fileName}' and trashed = false and mimeType = 'text/plain'`,
        requestParams
      );
      const data = await res.json();
      if (data.files.length === 0) throw new Error('File not found');
      // console.log('searchFile data: ', JSON.stringify(data, null, 4));
      return data.files[0].id as string;
    } catch (e) {
      console.error(`Failed to search file: ${(e as Error).message}`);
      throw new Error(`Failed to search file: ${(e as Error).message}`);
    }
  }

  // TODO - this is not working
  static async getFileContent(args: {
    id?: string;
    fileName?: string;
  }): Promise<any> {
    const { id, fileName } = args;
    let useId = id;
    const requestParams = {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
      }),
    };
    try {
      let foundId;
      if (fileName) {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name = '${fileName}' and trashed = false and 'appDataFolder' in parents and mimeType = 'text/plain'`,
          requestParams
        );
        const data = await res.json();
        console.log('searchFile data: ', JSON.stringify(data, null, 4));
        const count = data.files.length;
        if (count === 1) {
          foundId = data.files[0].id as string;
          useId = foundId;
        }
      }
      if (id && foundId) {
        if (id !== foundId)
          throw new Error(`File id ${id} does not match found id ${foundId}`);
      }
      if (useId) {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${useId}?alt=media`,
          requestParams
        );
        const data = await res.json();
        console.log('searchFile data: ', JSON.stringify(data, null, 4));
        const count = data.files.length;
        return { count, id: count === 1 ? data.files[0].id : null };
      }
    } catch (e) {
      console.error(`Failed to search file: ${(e as Error).message}`);
      throw new Error(`Failed to search file: ${(e as Error).message}`);
    }
    throw new Error('Must provide either id or fileName');
  }
}

export default GoogleService;
