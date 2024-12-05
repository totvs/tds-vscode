/**
 * Type for props to send when requesting the user to select resources.
 *
 * @param canSelectMany - Whether multiple resources can be selected.
 * @param canSelectFiles - Whether files can be selected.
 * @param canSelectFolders - Whether folders can be selected.
 * @param currentFolder - The current folder path.
 * @param title - The title for the resource selection dialog.
 * @param openLabel - The label for the open button.
 * @param accept - The allowed file filters.
 */
// const TSendSelectResourceOptions = {
// 	canSelectMany: boolean,
// 	canSelectFiles: boolean,
// 	canSelectFolders: boolean,
// 	currentFolder: string,
// 	title: string,
// 	openLabel: string,
// 	accept:string
//   }

/**
* Sends a message to the webview panel to select a resource.
*
* @param firedBy - The string identifier of the entity that triggered the resource selection.
* @param props - An object containing the properties related to the resource selection, including the model data.
*/
function sendSelectResource(firedBy/*: string*/, options/*TSendSelectResourceOptions*/) {
	const message = {
	  command: "SELECT_RESOURCE",
	  data: {
		...options,
		target: firedBy
		}
	}

	vscode.postMessage(message);
  }

function fireChooseFile(event, title, label) {
	event.preventDefault();
	event.stopPropagation();

	sendSelectResource(event.target.id || event.target.name,
		{
			canSelectMany: event.target.hasAttribute("multiple"),
			canSelectFiles: !(event.target.hasAttribute("webkitdirectory") || event.target.hasAttribute("directory")),
			canSelectFolders: (event.target.hasAttribute("webkitdirectory") || event.target.hasAttribute("directory") ),
			currentFolder: "",
			title: title,
			openLabel: label || "Select",
			accept: event.target.getAttribute("accept")
		}
	)
}

