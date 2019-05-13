export interface ServerConfiguration {
	id: string;
	token: string;
	name: string;
	environments: string[];

	//última conexão
	environment: string;
	username: string;
}