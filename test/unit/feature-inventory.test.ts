import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";

type PackageJson = {
  activationEvents: string[];
  contributes: {
    commands: Array<{ command: string }>;
    languages: Array<{ id: string; extensions: string[] }>;
    grammars: Array<{ language?: string; scopeName?: string; path: string }>;
    snippets: Array<{ language: string; path: string }>;
    debuggers: Array<{ type: string }>;
    customEditors: Array<{ viewType: string }>;
    colors: Array<{ id: string }>;
    keybindings: Array<{ command: string; key: string }>;
    configuration: { properties: Record<string, unknown> };
    viewsContainers: { activitybar: Array<{ id: string }> };
    views: Record<string, Array<{ id: string }>>;
    menus: {
      "explorer/context": unknown[];
      "view/item/context": unknown[];
      "view/title": unknown[];
      commandPalette: unknown[];
    };
  };
};

function readText(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function readPackageJson(repoRoot: string): PackageJson {
  const packagePath = path.join(repoRoot, "package.json");
  return JSON.parse(readText(packagePath)) as PackageJson;
}

function sectionBlock(markdown: string, title: string, nextTitle?: string): string {
  const start = markdown.indexOf(title);
  if (start < 0) {
    return "";
  }

  const end = nextTitle ? markdown.indexOf(nextTitle, start) : markdown.length;
  return markdown.slice(start, end < 0 ? markdown.length : end);
}

function parseBulletCommands(block: string): string[] {
  return block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^- [a-z0-9][a-z0-9.\-]+$/i.test(line))
    .map((line) => line.replace(/^-\s+/, ""));
}

suite("feature-inventory", () => {
  const repoRoot = path.resolve(__dirname, "..", "..");
  const inventoryPath = path.join(repoRoot, "docs", "feature-inventory.md");
  const extensionPath = path.join(repoRoot, "src", "extension.ts");

  const inventory = readText(inventoryPath);
  const extension = readText(extensionPath);
  const pkg = readPackageJson(repoRoot);

  test("feature-inventory document exists and has key sections", () => {
    expect(fs.existsSync(inventoryPath)).to.equal(true);
    expect(inventory.includes("## 1) Capacidades Nucleares")).to.equal(true);
    expect(inventory.includes("## 2) Contribuicoes Declaradas no Manifesto")).to.equal(true);
    expect(inventory.includes("## 3) Mapa de Comandos (Manifesto)")).to.equal(true);
    expect(inventory.includes("## 4) Registro em Runtime (src/extension.ts)")).to.equal(true);
  });

  test("commands listed in inventory match contributes.commands exactly", () => {
    const commandsSection = sectionBlock(
      inventory,
      "## 3) Mapa de Comandos (Manifesto)",
      "## 4) Registro em Runtime (src/extension.ts)"
    );

    const docCommands = parseBulletCommands(commandsSection);
    const manifestCommands = pkg.contributes.commands.map((c) => c.command);

    expect(docCommands.length).to.equal(60);
    expect(new Set(docCommands).size).to.equal(docCommands.length);
    expect(new Set(manifestCommands).size).to.equal(manifestCommands.length);
    expect([...docCommands].sort()).to.deep.equal([...manifestCommands].sort());
  });

  test("command group counts in inventory stay consistent", () => {
    const buildSection = sectionBlock(inventory, "### 3.1 Build e Formatar", "### 3.2 Debug");
    const debugSection = sectionBlock(inventory, "### 3.2 Debug", "### 3.3 Patch");
    const patchSection = sectionBlock(inventory, "### 3.3 Patch", "### 3.4 RPO e Inspecao");
    const rpoSection = sectionBlock(inventory, "### 3.4 RPO e Inspecao", "### 3.5 Servidores e Conexao");
    const serverSection = sectionBlock(inventory, "### 3.5 Servidores e Conexao", "### 3.6 Token, Usage e Utilitarios");
    const tokenSection = sectionBlock(inventory, "### 3.6 Token, Usage e Utilitarios", "### 3.7 Includes, WS, Template e Monitor");
    const miscSection = sectionBlock(inventory, "### 3.7 Includes, WS, Template e Monitor", "## 4) Registro em Runtime (src/extension.ts)");

    expect(parseBulletCommands(buildSection).length).to.equal(9);
    expect(parseBulletCommands(debugSection).length).to.equal(7);
    expect(parseBulletCommands(patchSection).length).to.equal(7);
    expect(parseBulletCommands(rpoSection).length).to.equal(7);
    expect(parseBulletCommands(serverSection).length).to.equal(13);
    expect(parseBulletCommands(tokenSection).length).to.equal(11);
    expect(parseBulletCommands(miscSection).length).to.equal(6);
  });

  test("manifest contributions match documented inventory numbers", () => {
    expect(pkg.contributes.languages.length).to.equal(5);
    expect(pkg.contributes.grammars.length).to.equal(5);
    expect(pkg.contributes.snippets.length).to.equal(2);
    expect(pkg.contributes.debuggers.length).to.equal(3);
    expect(pkg.contributes.customEditors.length).to.equal(1);
    expect(pkg.contributes.viewsContainers.activitybar.length).to.equal(1);
    expect((pkg.contributes.views["totvs-plataform"] || []).length).to.equal(1);
    expect(pkg.contributes.keybindings.length).to.equal(4);
    expect(pkg.contributes.colors.length).to.equal(5);

    expect(pkg.contributes.menus["explorer/context"].length).to.equal(12);
    expect(pkg.contributes.menus["view/item/context"].length).to.equal(27);
    expect(pkg.contributes.menus["view/title"].length).to.equal(3);
    expect(pkg.contributes.menus.commandPalette.length).to.equal(18);

    expect(Object.keys(pkg.contributes.configuration.properties).length).to.equal(33);
  });

  test("manifest includes expected language IDs, debugger IDs and activation events", () => {
    const languageIds = pkg.contributes.languages.map((l) => l.id).sort();
    expect(languageIds).to.deep.equal(["4gl", "advpl", "advpl-asp", "totvs_patch", "totvs_template"].sort());

    const debuggerTypes = pkg.contributes.debuggers.map((d) => d.type).sort();
    expect(debuggerTypes).to.deep.equal([
      "totvs_language_debug",
      "totvs_language_web_debug",
      "totvs_tdsreplay_debug",
    ].sort());

    expect(pkg.activationEvents).to.include("workspaceContains:**/*.pr[wgx]");
    expect(pkg.activationEvents).to.include("workspaceContains:**/*.tlpp");
  });

  test("runtime activation contains core registrations from inventory", () => {
    const requiredRuntimeSignals = [
      "registerXRef(context)",
      "registerWorkspace(context)",
      "registerDebug(context, languageClient)",
      "PatchEditorProvider.register(context)",
      "registerAdvplFormatting()",
      "register4glFormatting()",
      "register4glOutline()",
      "totvs-developer-studio.run.formatter",
      "totvs-developer-studio.patchApply",
      "totvs-developer-studio.patchGenerate.fromRPO",
      "totvs-developer-studio.patchGenerate.fromFolder",
      "totvs-developer-studio.patchGenerate.byDifference",
      "totvs-developer-studio.serverSelection",
      "totvs-developer-studio.logger.on",
      "totvs-developer-studio.logger.off",
      "tds-monitor.open-monitor-view",
      "totvs-developer-studio.ws.show",
      "totvs-developer-studio.templateApply",
      "totvs-developer-studio.open-loadrpoinfo-view",
    ];

    requiredRuntimeSignals.forEach((signal) => {
      expect(extension.includes(signal), `missing runtime signal: ${signal}`).to.equal(true);
    });
  });

  test("inventory attention points remain represented in code", () => {
    expect(extension.includes("commands.registerCommand(\"tds.getDAP\"")).to.equal(true);
    expect(pkg.contributes.commands.some((c) => c.command === "totvs-developer-studio.getDAP")).to.equal(true);

    const freshenIndexCommentedRegistration = /\/\/\s*commands\.registerCommand\("advpl\.freshenIndex"/m;
    expect(freshenIndexCommentedRegistration.test(extension)).to.equal(true);
    expect(pkg.contributes.commands.some((c) => c.command === "advpl.freshenIndex")).to.equal(true);
  });
});
