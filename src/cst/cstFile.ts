import * as path from "path";
import * as vscode from "vscode";

export type CstFileKind = "json" | "txt";

/**
 * Calcula o caminho do arquivo de saída da CST: mesmo local e nome do fonte,
 * trocando a extensão por ".cst.json" ou ".cst.txt".
 * Ex.: c:\fontes\teste.prw -> c:\fontes\teste.cst.json
 */
export function getCstFilePath(sourceFile: string, kind: CstFileKind): string {
  const parsed = path.parse(sourceFile);
  return path.join(parsed.dir, `${parsed.name}.cst.${kind}`);
}

/**
 * Grava a CST ao lado do fonte e a exibe ao lado do editor.
 * Fontes sem arquivo em disco (ex.: "untitled") não têm local de destino;
 * nesses casos o conteúdo é apenas exibido em um documento sem título.
 * @returns caminho gravado, ou undefined quando o fonte não está em disco.
 */
export async function saveAndShowCst(
  document: vscode.TextDocument,
  cst: unknown,
  kind: CstFileKind
): Promise<string | undefined> {
  // Formato "text" pode retornar string pronta; evita escapá-la com JSON.stringify.
  const content =
    typeof cst === "string" ? cst : JSON.stringify(cst, null, 2);
  const showOptions: vscode.TextDocumentShowOptions = {
    viewColumn: vscode.ViewColumn.Beside,
    preview: true,
  };

  if (document.isUntitled || document.uri.scheme !== "file") {
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: kind === "json" ? "json" : "plaintext",
    });
    await vscode.window.showTextDocument(doc, showOptions);
    return undefined;
  }

  const targetPath = getCstFilePath(document.uri.fsPath, kind);
  const targetUri = vscode.Uri.file(targetPath);
  await vscode.workspace.fs.writeFile(targetUri, Buffer.from(content, "utf8"));

  const doc = await vscode.workspace.openTextDocument(targetUri);
  await vscode.window.showTextDocument(doc, showOptions);

  return targetPath;
}
