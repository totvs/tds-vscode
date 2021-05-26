import * as fs from 'fs';
import * as vscode from 'vscode';
import Utils from './utils';
import * as nls from 'vscode-nls';
import utils from './utils';

const localize = nls.config({
  locale: vscode.env.language,
  bundleFormat: nls.BundleFormat.standalone,
})();

export interface IRpoToken {
  token: string;
  header: {
    alg: string;
    typ: string;
  };
  body: {
    auth: string;
    exp: Date;
    iat: Date;
    iss: string;
    name: string;
    sub: string;
  };
  error?: string;
  warning?: string;
}

function noRpoToken(): IRpoToken {
  return {
    token: '',
    header: {
      alg: '',
      typ: '',
    },
    body: {
      auth: '',
      exp: new Date(0),
      iat: new Date(0),
      iss: '',
      name: '',
      sub: '',
    },
    error: '',
    warning: '',
  };
}

export function getRpoTokenFromFile(path: string): IRpoToken {
  let result: IRpoToken = noRpoToken();

  if (path) {
    if (fs.existsSync(path)) {
      try {
        const buffer: any = fs.readFileSync(path);
        const token: string = buffer.toString();
        const content: string = Buffer.from(token, 'base64').toString('ascii');
        result = getRpoTokenFromString(content);
      } catch (error) {
        result.error = error.message;
      }
    } else {
      result.error = localize(
        'tds.vscode.rpoToken.file.not.found',
        'File not found. File: {0}',
        path
      );
    }
  }

  return result;
}

export function getRpoTokenFromString(value: string): IRpoToken {
  let result: IRpoToken = noRpoToken();

  const token: string = value;
  const content: string = Buffer.from(token, 'base64').toString('ascii');
  const header: string = content.substring(
    content.indexOf('{'),
    content.indexOf('}') + 1
  );
  let body: string = content.substring(header.length);
  body = content.substring(
    header.length,
    header.length + body.indexOf('}') + 1
  );

  if (header && body) {
    const headerJson: any = JSON.parse(header);
    const bodyJson: any = JSON.parse(body);

    result.token = token;
    result.header = headerJson;
    result.body = {
      ...bodyJson,
      exp: new Date(bodyJson.exp * 1000),
      iat: new Date(bodyJson.iat * 1000),
    };
  }

  return result;
}

export function rpoTokenInputBox() {
  const rpoToken: IRpoToken = utils.getRpoTokenInfos();
  vscode.window
    .showInputBox({
      prompt: 'Input RPO Token string',
      placeHolder: rpoToken.token,
    })
    .then((rpoTokenString: string) => {
      if (rpoTokenString) {
        saveRpoTokenString(rpoTokenString.trim()).then(
          () => {
            vscode.window.showInformationMessage('RPO token saved');
          },
          (error: string) => {
            vscode.window.showErrorMessage(error);
          }
        );
      }
    });
}

export function saveRpoTokenString(rpoTokenString: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const rpoToken: IRpoToken = getRpoTokenFromString(rpoTokenString || '');
    if (rpoToken.error) {
      reject(rpoToken.error);
    } else {
      Utils.saveRpoTokenInfos(rpoToken);
      resolve(true);
    }
  });
}
