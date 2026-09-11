# tds-vscode Compilation Reference

Reference material for the `advpl-tlpp-compile` skill. Loaded on demand for exact command IDs, the `servers.json` schema, OS-specific paths, supported extensions, and troubleshooting.

Source: [tds-vscode docs](https://github.com/totvs/tds-vscode/tree/master/docs) — `compilation.md`, `servers.md`, `api.md`, and `package.json`.

---

## Extension

| Item | Value |
| --- | --- |
| Marketplace id | `TOTVS.tds-vscode` |
| Display name | TOTVS Developer Studio for VSCode (AdvPL, TLPP e 4GL) |
| Activity-bar view | `TOTVS` (id `totvs-plataform` / view `totvs_server`) |
| Requires | 64-bit OS; standalone AppServer (no load balancer / HTTP broker) |

After installing, a window reload may be needed for the `TOTVS` activity-bar icon and the `Servers` view to appear.

---

## Command IDs

Exact command IDs (from the extension `package.json`). Many connection commands are hidden from the Command Palette (`when: "1 == 0"`) but can still be executed directly by id.

### Compilation

| Command id | Title | Default shortcut | Scope |
| --- | --- | --- | --- |
| `totvs-developer-studio.rebuild.file` | Recompile File/Folder | `Ctrl+F9` (`Cmd+F9`) | Active editor — always recompiles the focused source |
| `totvs-developer-studio.build.file` | Compile File/Folder | `Ctrl+Shift+F9` (`Cmd+Shift+F9`) | Active editor |
| `totvs-developer-studio.rebuild.openEditors` | Recompile Open Editors | `Ctrl+F10` (`Cmd+F10`) | All open editors |
| `totvs-developer-studio.build.openEditors` | Compile Open Editors | `Ctrl+Shift+F10` (`Cmd+Shift+F10`) | All open editors |
| `totvs-developer-studio.rebuild.workspace` | Recompile workspace/folder | — | Folder / workspace |
| `totvs-developer-studio.build.workspace` | Compile workspace/folder | — | Folder / workspace |
| `totvs-developer-studio.show.result.build` | Show compile result table | — | Multi-file result summary |

> **rebuild** = recompile (force). **build** = incremental compile. In the Explorer context menu the default action is *Recompile*; holding `ALT`/`SHIFT` switches it to *Compile*.

> **Active-editor dependency.** `rebuild.file`/`build.file` take **no file-path argument** — they compile the focused editor. To compile a specific file via automation, first open and focus it with the terminal command `code --reuse-window "/absolute/path/to/source"` (most reliable in agent contexts), then call the file-scope command. The editor command `vscode.open` (passing a `file:///` URI and `skipCheck: true`) is a fallback but often returns *"Failed to run command"* in agent contexts. For folders or batches, use `rebuild.workspace`/`build.workspace`, which act on the selected resource and need no open editor.

### Connection / servers

| Command id | Title | Notes |
| --- | --- | --- |
| `totvs-developer-studio.add` | Add Server | Opens the register-server assistant (`name`, `address`, `port`) |
| `totvs-developer-studio.connect` | Connect | Prompts for environment, username, **password** (typed by the user) |
| `totvs-developer-studio.reconnect` | Reconnect | Reuses a saved token |
| `totvs-developer-studio.serverSelection` | Select Server | Pick server/environment |
| `totvs-developer-studio.selectenv` | Select environment | — |
| `totvs-developer-studio.disconnect` | Disconnect | — |
| `totvs-developer-studio.config` | Configure Server View | Opens `servers.json` for editing |

### Compile key / RPO token (only for `Function` / `Main Function`)

| Command id | Title |
| --- | --- |
| `totvs-developer-studio.compile.key` | Compile Key (apply `*.aut` authorization) |
| `totvs-developer-studio.inputRpoToken` | Input RPO token |
| `totvs-developer-studio.selectRpoToken` | Select RPO token |
| `totvs-developer-studio.clearRpoToken` | Clear RPO token |

> Compiling sources that contain `Function` / `Main Function` requires a valid compilation key (`*.aut`). Request it from the team responsible for key generation.

---

## servers.json

### Location (per OS)

| OS | Path |
| --- | --- |
| Windows | `%USERPROFILE%\.totvsls\servers.json` |
| macOS | `$HOME/.totvsls/servers.json` |
| Linux | `$HOME/.totvsls/servers.json` |

Enabling **File → Preferences → Settings → Extensions → TOTVS → Workspace server config** (`totvsLanguageServer.workspaceServerConfig`) stores a workspace-local `servers.json` instead, which overrides the user-level one for that workspace.

### Schema (key fields)

```json
{
  "version": "0.3.0",
  "includes": ["m:\\protheus\\includes"],
  "permissions": {
    "authorizationtoken": ""
  },
  "configurations": [
    {
      "id": "pgfb077eunhkt1u2mu4794eqxtfvj",
      "type": "totvs_server_protheus",
      "name": "p20",
      "group": "ERP/REST",
      "port": 2030,
      "address": "localhost",
      "buildVersion": "7.00.210324P",
      "secure": true,
      "includes": [],
      "environments": ["p12"],
      "username": "admin",
      "environment": "p12",
      "token": "djM6cGdmYjA3N2..."
    }
  ],
  "savedTokens": [],
  "lastConnectedServer": "pgfb077eunhkt1u2mu4794eqxtfvj"
}
```

| Key | Description | Agent may write? |
| --- | --- | --- |
| `version` | File version. Do not edit. | No |
| `includes` (root) | Global definition-file folders (used when not set per server, and for the linter). | Yes |
| `permissions.authorizationtoken` | Compilation key/permissions. | **No** (generated) |
| `configurations[].id` | Unique id generated at registration. | Prefer letting the extension generate it |
| `configurations[].type` | `totvs_server_protheus`, `totvs_server_logix`, or `totvs_server_totvstec` (>= 7.00.210324P / Harpia). | Yes |
| `configurations[].name` | Human-friendly server name. | Yes |
| `configurations[].group` | Optional tree folder, e.g. `ERP`, `ERP/REST`. | Yes |
| `configurations[].port` | Connection port (TDS/LSP port). | Yes |
| `configurations[].address` | IP/hostname. | Yes |
| `configurations[].buildVersion` | Server version. Obtained automatically on connect. | No (leave empty for new) |
| `configurations[].secure` | SSL on/off. Obtained automatically. | No (leave empty for new) |
| `configurations[].includes` | Per-server definition-file folders. Falls back to root `includes`. | Yes |
| `configurations[].environments` | Available environments. | Yes |
| `configurations[].username` | Last used username. | Optional |
| `configurations[].environment` | Last used environment. | Optional |
| `configurations[].token` | Reconnect token. Obtained automatically. | **No** (generated) |
| `savedTokens` | Per-server/environment tokens. Generated. | **No** |
| `lastConnectedServer` | Last server id (auto-reconnect). Generated. | **No** |

> When editing manually, **disconnect all servers first** and keep a backup. Writing wrong token values can break the extension.

### Minimal new-server entry (manual fallback)

```json
{
  "type": "totvs_server_protheus",
  "name": "local",
  "port": 2030,
  "address": "localhost",
  "includes": ["c:/totvs/includes"],
  "environments": ["ENVIRONMENT"]
}
```

Append this object to `configurations`. The extension fills `id`, `buildVersion`, `secure`, and `token` on first connect.

---

## Compilable extensions

Default `totvsLanguageServer.folder.extensionsAllowed` list (case-insensitive):

`.PRW` `.PRX` `.PRG` `.PPX` `.PPP` `.TLPP` `.APW` `.APH` `.APL` `.AHU` `.TRES` `.PNG` `.BMP` `.RES` `.4GL` `.PER` `.JS` `.RPTDESIGN`

- The `.PPP`/`.PPX` files are pre-processed output; generate `.ppo` via the *Generate PPO file* option (`totvsLanguageServer.compilation.generatePpoFile`) when needed.
- Disable the filter with *Enable Extension Filter* off (`totvsLanguageServer.folder.enableExtensionsFilter`) to compile other extensions as resources.

---

## Compilation requirements (checklist)

1. Server/environment **connected**.
2. User **authenticated** (when required).
3. **Include** folders configured (definition files `.ch`/`.th`). *4GL sources ignore include folders.*
4. **Exclusive RPO access**.
5. **Compilation token** (only for `Function`/`Main Function`).
6. Source encoded in **CP1252** (Windows-1252).
7. Avoid network/cloud drives (OneDrive, Google Drive) — they can cause partial compiles.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `It wasn't possible to obtain exclusive access to the objects repository` | Other users/JOBS hold the RPO | Disconnect all users/JOBS, or set the `BuildKillUsers` key in the AppServer `[GENERAL]` section to auto-disconnect before compiling |
| Garbled characters / invalid syntax after compile | Source saved as UTF-8 | Convert to CP1252 (`utf8-to-cp1252-conversion` skill) and recompile |
| Missing `#include` / undefined define errors | Include folders not configured | Set per-server `includes` in `servers.json` or via `totvs-developer-studio.include` |
| `Function`/`Main Function` rejected | No valid compilation key | Apply `*.aut` via `totvs-developer-studio.compile.key` |
| TOTVS view absent after install | Window not reloaded | Reload the VS Code window |
| Cannot connect | Server behind load balancer / HTTP broker | Use a standalone secondary server; HTTP broker is unsupported |
