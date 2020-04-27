import { DebugAdapterDescriptorFactory, DebugSession, DebugAdapterExecutable, ProviderResult, DebugAdapterDescriptor } from 'vscode';
import { getDAP } from './debugConfigs';

export class TotvsDebugAdapterDescriptorFactory implements DebugAdapterDescriptorFactory {

	createDebugAdapterDescriptor(_session: DebugSession, executable: DebugAdapterExecutable | undefined): ProviderResult<DebugAdapterDescriptor> {
		// use the executable specified in the package.json if it exists or determine it based on some other information (e.g. the session)
		if (!executable) {
			let dap = getDAP();
			executable = new DebugAdapterExecutable(dap.command, dap.args);
		}
		// make VS Code launch the DA executable
		return executable;
	}

}