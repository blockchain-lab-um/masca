import { MULTIPART_BOUNDARY, CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';

import StorageService from './Storage.service';

/**
 * Class that handles the google drive api.
 *
 * The functions are made to manipulate files in the google drive appDataFolder.
 *
 * This folder is only accessible by the app that created it.
 */
class GoogleService {
  /**
   * Function that returns the google access token
   * @returns string
   */
  static getGoogleSession(): string {
    const state = StorageService.get();
    const session = state[CURRENT_STATE_VERSION].accountState[state[CURRENT_STATE_VERSION].currentAccount].general.googleSession;
    if (!session) throw new Error('Google session not found');
    return session;
  }

  /**
   * Function that creates a multipart request body
   *
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
    if (await this.findFile({ fileName })) throw new Error('Duplicate file.');
    const requestBody = this.getMultiPartRequestBody(args);
    const requestParams = {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
        'Content-Type': 'multipart/related; boundary=mascabound',
        'Content-Length': `${requestBody.length}`,
      }),
      body: requestBody,
    };
    try {
      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        requestParams
      ).then((response) => response.json());
      if (res.id) return res.id as string;
      throw new Error(res.error.message);
    } catch (error) {
      throw new Error(`Failed to create file: ${(error as Error).message}`);
    }
  }

  /**
   * Function that searches for a file in the google drive
   *
   * *__Note:__ id param takes precedence over fileName if both are present*
   * @param args.id - id of the file to search
   * @param args.fileName - name of the file to search
   * @returns string - id of the found file
   */
  static async findFile(args: {
    id?: string;
    fileName?: string;
  }): Promise<string> {
    const { id, fileName } = args;
    if (!id && !fileName) throw new Error('Missing id or fileName parameter');
    const requestParams = {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
      }),
    };
    try {
      if (id) {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}`,
          requestParams
        );
        const data = await res.json();
        if (data.error) return '';
        return data.id as string;
      }
      if (fileName) {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name = '${fileName}' and trashed = false and mimeType = 'text/plain'`,
          requestParams
        );
        const data = await res.json();
        if (data.files.length === 0) return '';
        return data.files[0].id as string;
      }
      return '';
    } catch (e) {
      throw new Error(`Failed to search file: ${(e as Error).message}`);
    }
  }

  /**
   * Function that updates a file content in the google drive
   *
   * *__Note:__ id param takes precedence over fileName if both are present*
   * @param args.id - id of the file to update
   * @param args.fileName - name of the file to update
   * @param args.content - content of the file to update
   * @returns void
   */
  static async updateFile(args: {
    id?: string;
    fileName?: string;
    content: string;
  }): Promise<any> {
    const { id, fileName, content } = args;
    if (!id && !fileName) throw new Error('Missing id or fileName parameter.');
    const file = await this.findFile({
      id,
      fileName,
    });
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${file}?uploadType=media&fields=id`,
      {
        method: 'PATCH',
        headers: new Headers({
          Authorization: `Bearer ${this.getGoogleSession()}`,
          'Content-Type': 'text/plain',
          'Content-Length': `${content.length}`,
        }),
        body: content,
      }
    ).then((response) => response.json());
    if (res.error) throw new Error(res.error.message);
  }

  /**
   * Function that returns the content of a file in the google drive
   *
   * *__Note:__ id param takes precedence if both are present*
   * @param args.id - id of the file to search
   * @param args.fileName - name of the file to search
   * @returns string - content of the found file
   */
  static async getFileContent(args: {
    id?: string;
    fileName?: string;
  }): Promise<string> {
    const { id, fileName } = args;
    const requestParams = {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
      }),
    };
    try {
      if (id) {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
          requestParams
        );
        const data = await res.text();
        return '';
      }
      if (fileName) {
        const file = await this.findFile({ fileName });
        return await this.getFileContent({ id: file });
      }
      throw new Error('Missing id or fileName parameter.');
    } catch (e) {
      throw new Error(`Failed to search file: ${(e as Error).message}`);
    }
  }

  /**
   * Function that deletes a file in the google drive
   * @param args.id - id of the file to delete
   * @returns boolean - true if the file was deleted
   */
  static async deleteFile(args: { id: string }): Promise<boolean> {
    const { id } = args;
    if (!id) throw new Error('Missing id parameter.');
    const requestParams = {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Bearer ${this.getGoogleSession()}`,
      }),
    };
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${id}`,
      requestParams
    );
    if (!res.body) return true;
    const data = await res.json();
    throw new Error(data.error.message);
  }
}

export default GoogleService;
