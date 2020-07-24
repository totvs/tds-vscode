# TOTVS Developer Studio for Code

[![Build Status](https://travis-ci.org/totvs/tds-vscode.svg?branch=master)](https://travis-ci.org/totvs/tds-vscode)

The TOTVS Developer Studio Code extension provides a development suite for the Protheus ecosystem.
It uses the communication protocols LSP (Language Server Protocol) and DAP (Debug Adapter Protocol), both widely used and extensible to other market IDEs, such as Atom, Visual Studio, Eclipse, Eclipse Theia, Vim and Emacs.

> [List of IDEs with LSP support](https://microsoft.github.io/language-server-protocol/implementors/tools).
[List of IDEs with DAP support](https://microsoft.github.io/debug-adapter-protocol/implementors/tools).

## Functionalities

* Syntax Highlight
* Communication based on LSP / DAP protocols.
* Compilation of fonts, folders and the desktop.
* Debugging fonts (Local and WebApp).
* Patch Generation.
* Patch application.
* Deletion of RPO sources.
* Defragmentation of the RPO.
* RPO Object Inspector.
* RPO functions inspector.
* WS Protheus generation.

## General Settings

### Welcome screen

* The welcome screen allows you to configure the location of SmartClient and Includes directories that will be used during the compilation of source codes.
* This screen will be presented at the first execution of the plugin, as soon as the first AdvPL / 4GL source is opened.
* Locate the `SmartClient.exe` (Windows) or` smartclient` (Linux).
* Locate the Includes directories you need for your projects.
* Press the `Save` button to finish.

![Welcome Page](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/Welcome.gif)

### Registering servers using the wizard

* Click on the `" + "` icon in the upper right corner of the view, next to the `Servers' tab.
* Fill in the server's `name`,` ip` and `port` information.
* Click the `Save` button.
* There is a shortcut to open the wizard: `CTRL + SHIFT + P` type` TOTVS: Add Server`.

![New server](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/AddServer.gif)

### Connection to servers

* After executing the registration of at least one server.
* Go to the servers view (Access by the TOTVS icon on the left side of the VSCode).
* Right click and select the `Connect` option.
* Enter `environment`,` user` and `password` (can be" blank ") to proceed.
* Wait for the connection to finish.
* Connection to servers can be made by selecting the text `[Select server / environment]` in the toolbar. Or by the shortcut `CTRL + SHIFT + P` type` TOTVS: Select Server`.

![Connect Server](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/ConnectServer.gif)

## Compilation

### Compiling the source of the current editor

* To compile the source of the current editor, use the shortcut `CTRL + F9`. Or by the shortcut `CTRL + SHIFT + P` type` TOTVS: Compile Selection`.
Compilation made from the editor will always recompile the source, thus maintaining the same behavior as TDS-Eclipse.

* To recompile the source of the current editor, use the shortcut `CTRL + SHIFT + F9`.

### Compiling all open sources

* To compile all the sources of the open editors, use the shortcut `CTRL + F10`. Or by the shortcut `CTRL + SHIFT + P` type` TOTVS: Compile Open Editors`.

* To recompile all the sources of the open editors, use the shortcut `CTRL + SHIFT + F10`.

### Compilation result

* If you want to clean the console before compiling, enable the option: `File | Preferences | Settings | Extensions | TOTVS | Clear Console Before Compile`.

* To analyze the result of the compilation of multiple files, there is the option of opening a table with information of all the files that have been compiled.

* To display this table, select more than one file, compile and after compilation the following question will be presented: Click on `Yes`.

![ShowCompileResult](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/compile/askCompileResult.PNG)

* The table below will be displayed, ordered by the result column.

![TableCompileResult](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/compile/CompileResults.PNG)

* In the preferences there is a way to enable and disable the question about opening the table.

* Click on `File | Preferences | Settings` and type `totvsLanguageServer.askCompileResult` in the search field.

## Build Settings

### Encoding

We have had reports of encode problems opening sources previously saved in TDS, this is because the original VSCode encode is UTF8 and the TDS is another.
To guarantee compilation, it is necessary to make the encode compatible as follows:
 * In the original state, the Source will be shown as follows: <br/>
 ! [Encoding 1] (https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding1.png)
 * ** Before editing / saving any font in VS ** enter the VS `Ctrl +,` settings.
 * In the search field type `encode` and select` Windows1252`. <br/>
 * Open the source with the new encode (reinforcing that you MUST NOT have saved it in UTF8 before) <br/>
 ! [Encoding 3] (https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding3.png)
 * Compile and / or recompile the source and run it. <br/>
 ! [Encoding 4] (https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding4.png)

 When opening the workspace, we ask if the user wants to change the encoding to the TOTVS standard and this configuration is done automatically.

### Compiling Function and Main Function with Compilation Key

* This process is being reviewed and may change.

* To apply a compilation key, right click on the server view and select the `Compile key` option.
* Will open a wizard to select the key you want. All .aut files can be selected.
* It is also possible to open the wizard using the `CTRL + SHIFT + P` shortcut by typing` TOTVS: Compile Key`.
* After selecting the key, it will be read and the fields filled with your information.
* Click on the `Validate` button to check if the key is valid.

* NOTE: The key will only be saved by clicking on the `Save` or` Save / Close` button if the key is valid.

## Compile key

* From 05/17/2019 all keys must be regenerated using the ID displayed in our VSCode extension. This is necessary for Linux and MAC support.

* Linux and MAC build key support from 05/17/2019.

![Compile Key](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/CompileKey.gif)

### Include configuration

* In the servers view, click with the context menu and select the `Include` option.
* It is also possible to configure through the wizard: `CTRL + SHIFT + P` type` TOTVS: Include`.

* Include settings are in the file `% USERHOME% /. Totvsls / servers.json`. Open this file.
* The `` C: / totvs / includes "` directory already exists by default.
* To add a new include configuration, separate with a comma or replace the existing path.
  Ex: `" includes ": [" C: / totvs / includes1 "," C: / totvs / includes2 "," C: / totvs / includes3 "]`.

![Configure Include](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/Include.gif)

### Pre-compiler files

* To keep the files generated by the precompiler, enable the option in the preferences in: `File | Preferences | Settings | Extensions | TOTVS | Leave PPO File`.
* If you want a complete log of the operations performed by the precompiler, enable the option: `File | Preferences | Settings | Extensions | TOTVS | Show Pre Compiler`.

## Debug Settings

### Manually creating a debug configuration

* The `launch.json` file will be created automatically through the Welcome Screen.
* If there are problems with this file you can create it manually using the following steps:

  * Select the `Debug` section in the left panel of VSCode.
  * Select `Add Configuration ...` at the top of this screen.
  * Start typing `TOTVS` and select the desired type
    * Type: _totvs_language_debug_, uses SmartClient Desktop.
      Fill in the `launch.json` file according to your environment and needs, as in the example below.

>``{``
"type": "totvs_language_debug",
"request": "launch",
"name": "TOTVS Language Debug",
"program": "${command:AskForProgramName}",
"cwb": "${workspaceFolder}",
"smartclientBin": "/home/mansano/_c/totvs12/bin/smartclient/smartclient",
"isMultiSession": true,
"enableTableSync": true
``}``

    * Type: _totvs_language_web_debug_, use SmartClient Html.
      Fill in the `launch.json` file according to your environment and needs, as in the example below.

>``{``
"type": "totvs_language_web_debug",
"request": "launch",
"name": "TOTVS Language Debug",
"program": "${command:AskForProgramName}",
"cwb": "${workspaceFolder}",
"smartclientUrl": "<http://localhost:8080>",
"isMultiSession": true,
"enableTableSync": true
``}``

* Note: * Open the file `settings.json` and enter the key" ", with the full path of your web browser.
>``{``
"totvsLanguageServer.welcomePage": false,
"totvsLanguageServer.web.navigator": "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
``}``

See details on how to use the directives [$ {command:}] (https: // link) and [passing parameters] (https: link).

### Creating a debug configuration with a wizard

* To open the new debug setup wizard, press the `CTRL + SHIFT + P` shortcut and type` TOTVS: Configure Launchers`.
* A launcher configuration wizard will open that allows you to create a new configuration or edit an existing configuration.
* Fill in the information and click on 'Save`.

![New Launcher](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/CreateLauncher.gif)

### Starting a debug

* If necessary, check that the data in the `launch.json` file are correct.
* Connect to a previously registered server.
* Press the shortcut `F5` to start debugging.
* If necessary to open `launch.json` again, select the` Debug` section in the left panel of VSCode
* And finally the configuration icon at the top `Open launch.json`, represented by the icon of a` gear`.
* A field will be displayed for typing the source you want to debug, ex: `u_teste`.
* Press `Enter` to start debugging.

![Start Debug](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/StartDebug.gif)

### Using Debug Console

* It is possible to check the values ​​of variables, table contents and execute methods during debugging with the Debug Console.
* Place a breakpoint at a necessary point in your source.
* When debugging "stops" at the breakpoint, open the `Debug Console` view at the bottom of the screen.
* Enter an operation or AdvPL / 4GL variable available in your debugging environment.
* To check the contents of an open table, type the following command: table: table_name (eg table: SM0)
* Analyze the data returned according to your need.

In [Debug Console: visual configuration] (https://github.com/totvs/tds-vscode/wiki/Debug-Console:-configura%C3%A7%C3%A3o-visual), you have details on how to customize the visual of this vision.

![Debug Console](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/DebugConsole.gif)

### Synchronization of tables during debugging

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-ShowingTables.gif)

* The timing of tables can be changed by setting the "launcher" using the parameter: enableTableSync
* It is enabled by default in a new run configuration.

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-EnableTableSyncProperty.gif)

* You can change this option during debugging using the command: "TOTVS: Toggle table sync". Note that when using this command, the launcher parameter is changed, so the next debug will use this definition. That is, if it has been disabled, the next debugging will start with table synchronization disabled as well.

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-CommandToggleTableSync.gif)

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-CommandToggleChangingProperty.gif)

* It is possible to view the contents of an open table using the "Debug Console" view. To do this, type the following command in the view: table: table_name (eg table: SM0)

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-DebugCommands.gif)

## Patch

### Generating a Patch (From RPO) using the wizard

* To generate a patch, connect to the server.

* Select the connected server with the right mouse button.
* Select the `Patch Generation (From RPO)` option.
* There is a shortcut for opening the page: `CTRL + SHIFT + P` type `TOTVS` and select the option` TOTVS: Patch Generation (From RPO) `.

* Wait for the object inspector files to load.
* Select the files you want for the patch using the `Filter` field.
* To enter the filter simply leave the field or press `Enter`.
* Now select the files in the list on the left and move the desired ones to the list on the right using the button "" >> "`.
* Repeat the process until you have selected all the necessary files.
* Now select the `directory` where you want to save the Patch.
* Choose the desired `file name` of Patch. (When not informed, the patch will be generated with the name of the RPO).
* Perform and generate the Patch by pressing the `Generate` button.

![Patch Generate](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/GeneratePatchWizard.gif)

### Generating a Patch (From Folder) using the context menu

* To generate a patch, connect to the server.
* Right click on the folder containing the fonts that will be part of the patch.
* Select the `Patch Generation (From Folder)` option.
* A window will open to select where you want the font to be saved. Select a folder.
* A window will open to collect the name of the patch that will be generated. (When not informed, the patch will be generated with the name of the RPO).
* After confirmation, the patch will be generated in the desired path.

![Patch Generate Folder](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/GeneratePatchWizardFromFolder.gif)

### Applying Patch using the wizard

* To apply a patch, connect to the server.

* Select the server with the right mouse button.
* Select the `Patch Apply` option.
* There is a shortcut for opening the page: `CTRL + SHIFT + P` type `TOTVS` and select the` TOTVS: Patch Apply` option.

* The server fields are automatically filled with the information of the connected server.
* In the `Patch File` field, select the patch you want to apply.
* Confirm the application.

![Patch Apply](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/ApplyPatch.gif)

### Applying Patch using the context menu

* To apply a patch, connect to the server.

* Select the patch with the right mouse button.
* Select the `Patch Apply from file` option.
* Confirm the application and the patch will be applied.

![Patch Apply from File](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/ApplyPatchMenu.gif)

## RPO

### Defragmentation of RPO

* To defragment an RPO, connect to the server.
* Select the server with the context menu and select the `Defrag RPO` option.
* It is also possible to select the option via the `CTRL + SHIFT + P` shortcut by typing` TOTVS: Defrag RPO`.

* The defragmentation start and end messages will be displayed in the lower right corner.

![Defrag RPO](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/DefragRPO.gif)

### Delete RPO resources

* To delete any RPO resource, connect to the server.
* With the context menu on top of the file you want to delete, select the `Delete File / Resource from RPO` option.
* Confirm the deletion.
* The confirmation of the deletion will be displayed on the console and in messages in the lower left corner.

![Delete File RPO](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/DeleteFromRPO.gif)

### RPO Object Inspector

* To view the files that are part of the RPO, connect to the server.
* With the context menu on top of the server, select the `Objects inspector` option.
* A wizard will open with all the files that are part of the RPO, use the filter to find a specific file.
* It is also possible to open the wizard via the `CTRL + SHIFT + P` shortcut by typing` TOTVS: Objects inspector`.

![Objects inspector](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/InspectObject.gif)

### RPO Role Inspector

* To view the functions that are part of the RPO, connect to the server.
* With the context menu on top of the server, select the option `Functions inspector`.
* A wizard will open with all the functions that are part of the RPO, use the filter to find a specific function.
* It is also possible to open the wizard via the `CTRL + SHIFT + P` shortcut by typing` TOTVS: Functions inspector`.

![Functions inspector](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/InspectFunction.gif)

## Generation of Client WS Protheus

* It is possible to generate ADVPL files from WSDL clients.
* Open the wizard with the shortcut `CTRL + SHIFT + P` and type` TOTVS: Generate WS Protheus`.
* Fill in the `URL` field, select a directory and write the name and extension of the protheus file that will be generated in the specified directory.
* After filling in, a success message will tell you that everything was created correctly.

![Generate WS](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/GenerateWS.gif)

## Support

### Log Capture

* If you have problems with the tool and want support from the plugin development team, start a log collection tool to assist in support. This tool collects information such as versions of tools and plugins, operating system, VSCode version, server configuration and etc.

* To activate it, select by the shortcut `CTRL + SHIFT + P` type` TOTVS: On Logger Capture`. At that point the log capture will start.

* Reproduce the problem and select the option `CTRL + SHIFT + P` type` TOTVS: Off Logger Capture` or in the bottom bar click on the text `Capturing logs ...`. The captors will be closed and a file called `tdsSupport.zip` will be generated. Attach this file to the ticket.

![Logger](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/Logger.gif)

### Collaborative Development

* If you want to contribute to the development of the plugin, visit [Git Hub TDS-VSCODE] (https://github.com/totvs/tds-vscode), make your commit and we will analyze it!

## Recommended extensions

* TDS Monitor for VSCODE.

  Allows to monitor protheus servers.

  <https://marketplace.visualstudio.com/items?itemName=totvs.tds-monitor>

* Numbered Bookmarks.

  Allows use of Delphi style bookmarks numbered from 1 to 9.

  <https://marketplace.visualstudio.com/items?itemName=alefragnani.numbered-bookmarks>

  ![Toggle](https://github.com/alefragnani/vscode-numbered-bookmarks/raw/master/images/numbered-bookmarks-toggle.png)