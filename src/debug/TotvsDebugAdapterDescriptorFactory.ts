import { DebugAdapterDescriptorFactory, DebugSession, DebugAdapterExecutable, ProviderResult, DebugAdapterDescriptor, ExtensionContext } from 'vscode';
import { existsSync } from 'fs';
import { getDAP } from './debugConfigs';
import Utils, { MESSAGETYPE } from '../utils';

export class TotvsDebugAdapterDescriptorFactory implements DebugAdapterDescriptorFactory {

	createDebugAdapterDescriptor(_session: DebugSession, executable: DebugAdapterExecutable | undefined): ProviderResult<DebugAdapterDescriptor> {
		// use the executable specified in the package.json if it exists or determine it based on some other information (e.g. the session)
		if (!executable) {
			let dap = getDAP();
			executable = new DebugAdapterExecutable(dap.command, dap.args);
		}

		const found = !!executable.command && existsSync(executable.command);
		Utils.logMessage(
			`[debug] Starting debug adapter: command="${executable.command}" args=${JSON.stringify(executable.args)} exists=${found}`,
			found ? MESSAGETYPE.Info : MESSAGETYPE.Error,
			!found
		);

		// make VS Code launch the DA executable
		return executable;
	}

}
