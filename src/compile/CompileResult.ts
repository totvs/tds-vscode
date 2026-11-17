import * as vscode from 'vscode';
import { CompileInfo } from './CompileInfo';

export class CompileResult {
	returnCode: number;
	compileInfos: Array<CompileInfo>;
	diagnostics: Array<vscode.Diagnostic>;
}
