import * as fs from 'fs';
import * as vscode from 'vscode';
import { ServerItem } from './serverItemProvider';
import Utils from './utils';
import * as nls from 'vscode-nls';

const localize = nls.config({
  locale: vscode.env.language,
  bundleFormat: nls.BundleFormat.standalone,
})();

export interface IRpoToken {
  file: string;
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

const noRpoToken: IRpoToken = {
  file: '',
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

export function getRpoTokenFromFile(path: string): IRpoToken {
  let result: IRpoToken = noRpoToken;

  if (path) {
    if (fs.existsSync(path)) {
      try {
        const buffer: any = fs.readFileSync(path);
        const token: string = buffer.toString();
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

        const headerJson: any = JSON.parse(header);
        const bodyJson: any = JSON.parse(body);

        result.token = token;
        result.header = headerJson;
        result.body = {
          ...bodyJson,
          exp: new Date(bodyJson.exp),
          iat: new Date(bodyJson.iat),
        };
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

export function rpoTokenSelection() {
  const server: ServerItem | undefined = Utils.getCurrentServer();

  if (!server) {
    vscode.window.showErrorMessage(
      localize('tds.vscode.rpoToken.no.server', 'No selected server.')
    );

    return;
  }

  const tokenFile: string = localize(
    'tds.vscode.rpoToken.token.file',
    'Token file'
  );
  const allFile: string = localize('tds.vscode.rpoToken.all.file', 'All files');

  vscode.window
    .showOpenDialog({
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: localize('tds.vscode.rpoToken.file.open.label', 'Select'),
      title: localize(
        'tds.vscode.rpoToken.file.title',
        'Select RPO Token File'
      ),
      filters: {
        [tokenFile]: ['token'],
        [allFile]: ['*'],
      },
    })
    .then((file: vscode.Uri[]) => {
      if (file && file[0]) {
        const rpoToken: IRpoToken = getRpoTokenFromFile(file[0].fsPath);
        if (rpoToken.error) {
          vscode.window.showErrorMessage(rpoToken.error);
        } else {
          rpoToken.file = file[0].fsPath;
          Utils.saveRpoToken(server.id, rpoToken);
        }
      }
    });
}

export function getContentRpoTokenFilename(id: string): string {
  return Utils.getRpoTokenFileInfo(id).file;
}
