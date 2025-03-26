/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ExtensionContext, SecretStorage } from "vscode"

export type TSecretStorageData = {
	token: string;
	environment: string;
	username: string;
	password: string;
}

const SECRET_KEY_NAME: string = "connection_data";

export class AuthSettings {
	private static _instance: AuthSettings

	constructor(private secretStorage: SecretStorage) {

	}

	static init(context: ExtensionContext): void {
		AuthSettings._instance = new AuthSettings(context.secrets)
	}

	static get instance(): AuthSettings {
		return AuthSettings._instance
	}

	async storeAuthData(data: TSecretStorageData, key: string = SECRET_KEY_NAME): Promise<void> {
		this.secretStorage.store(key, JSON.stringify(data));
	}

	async removeAuthData(key: string = SECRET_KEY_NAME): Promise<void> {
		this.secretStorage.delete(key);
	}

	async getAuthData(key: string = SECRET_KEY_NAME): Promise<TSecretStorageData | undefined> {
		const data: string | undefined = await this.secretStorage.get(key);
		if (data) {
			return JSON.parse(data);
		}

		return undefined;
	}
}
