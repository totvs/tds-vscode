// import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDataGrid, vsCodeDataGridRow, vsCodeDataGridCell } from "@vscode/webview-ui-toolkit";

// // In order to use the Webview UI Toolkit web components they
// // must be registered with the browser (i.e. webview) using the
// // syntax below.
// //
// // To register more toolkit components, simply import the component
// // registration function and call it from within the register
// // function, like so:
// //
// // provideVSCodeDesignSystem().register(
// //   vsCodeButton(),
// //   vsCodeCheckbox()
// // );
// //

// provideVSCodeDesignSystem().register(
//     vsCodeButton(),
//     vsCodeDataGrid(),
//     vsCodeDataGridRow(),
//     vsCodeDataGridCell()
//   );


// // Get access to the VS Code API from within the webview context
// const vscode = undefined; //acquireVsCodeApi();

// let sourceListArr;

// // Just like a regular webpage we need to wait for the webview
// // DOM to load before we can reference any of the HTML elements
// // or toolkit components
// window.addEventListener("load", main);

// // Main function that gets executed once the webview DOM loads
// function main() {
//   // To get improved type annotations/IntelliSense the associated class for
//   // a given toolkit component can be imported and used to type cast a reference
//   // to the element (i.e. the `as Button` syntax)
//   const btnExportToTxt = document.getElementById("exportToTxt") as Button;
//   btnExportToTxt?.addEventListener("click", handleExportToTxtClick);

//   const btnExportToCsv = document.getElementById("exportToCsv") as Button;
//   btnExportToCsv?.addEventListener("click", handleExportToCsvClick);

//   loadSourcesInfo();

// }

// function loadSourcesInfo()
// {
//   //Forma de pegar o script corrente de uma pagina com type=module, onde nesse caso a opcao document.currentScript sempre retorna null
//   // let currentScript = (function() {
//   //   var scripts = document.getElementsByTagName('script');
//   //   return scripts[scripts.length - 1];
//   // })();

//   var table : any = document.getElementById("sourcesgrid");
//   const module = document.getElementById("module");
//   const sourceListObj = module.getAttribute("sourceList");

//   const obj = JSON.parse(sourceListObj);
//   let tableData = [];

//   sourceListArr = obj.sourceList;

//   sourceListArr.forEach(function (sourceObj) {
//     //Para os dados do vscode datagrid, o array deve ser preenchido no formato: { HeaderName1: CellValue, HeaderName2: CellValue, HeaderName3: CellVale }.
//     //Onde cada objeto corresponder a uma linha do data grid e em cada celula deve ser informado o nome do Header a qual ele corresponde.
//     tableData.push({"Source Name": sourceObj.name, "Compile Date": sourceObj.compileDate});
//   });

//   table.rowsData = tableData;
// }


// // Callback function that is executed when the howdy button is clicked
// function handleExportToTxtClick() {
//   // Some quick background:
//   //
//   // Webviews are sandboxed environments where abritrary HTML, CSS, and
//   // JavaScript can be executed and rendered (i.e. it's basically an iframe).
//   //
//   // Because of this sandboxed nature, VS Code uses a mechanism of message
//   // passing to get data from the extension context (i.e. src/panels/HelloWorldPanel.ts)
//   // to the webview context (this file), all while maintaining security.
//   //
//   // vscode.postMessage() is the API that can be used to pass data from
//   // the webview context back to the extension context––you can think of
//   // this like sending data from the frontend to the backend of the extension.
//   //
//   // Note: If you instead want to send data from the extension context to the
//   // webview context (i.e. backend to frontend), you can find documentation for
//   // that here:
//   //
//   // https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview
//   //
//   // The main thing to note is that postMessage() takes an object as a parameter.
//   // This means arbitrary data (key-value pairs) can be added to the object
//   // and then accessed when the message is recieved in the extension context.
//   //
//   var table : any = document.getElementById("sourcesgrid");
//   vscode.postMessage({
//     command: "exportToTxt",
//     data: sourceListArr,
//   });
// }

// function handleExportToCsvClick() {
//   var table : any = document.getElementById("sourcesgrid");
//   vscode.postMessage({
//     command: "exportToCsv",
//     data: sourceListArr,
//   });
// }

