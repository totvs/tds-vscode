import { TdsMcpServer } from './mcpServer';

async function start(): Promise<void> {
	const server = new TdsMcpServer();
	await server.start();
}

void start().catch((error) => {
	const message = error instanceof Error ? error.stack ?? error.message : String(error);
	process.stderr.write(`[tds-mcp-server] fatal: ${message}\n`);
	process.exit(1);
});
