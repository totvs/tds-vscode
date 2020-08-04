export interface IMemento {
  get: (property: any) => any;
  set: (property: any) => any;
  save: (reset?: boolean) => void;
  reload: () => void;
}

function getValue(target: any, properties: any): any {
  let result = undefined;

  for (const key in target) {
    const element = target[key];

    if (properties.hasOwnProperty(key)) {
      if (Array.isArray(element)) {
        let list = [];

        if (element.length > 0) {
          for (let index = 0; index < element.length; index++) {
            const item = element[index];
            const value = getValue(item, properties[key][index]);
            if (value) {
              list.push(value);
            }
          }
        } else {
          list = properties[key];
        }

        result = list;
      } else if (typeof element === "object") {
        result = getValue(element, properties[key]);
      } else {
        result = properties[key];
      }
    }

    if (result) {
      break;
    }
  }

  return result;
}

export function mergeProperties(properties: any[]): any {
  let result = {};

  properties.forEach((element) => {
    result = update(result, element);
  });

  return result;
}

function update(target: any, properties: any): any {
  for (const key in properties) {
    const element = properties[key];

    if (typeof element === "object") {
      if (target.hasOwnProperty(key)) {
        target[key] = update(target[key], properties[key]);
      } else {
        target[key] = element;
      }
    } else {
      target[key] = element;
    }
  }

  return target;
}

function doLoadProperty(state: any, property: any, defaultValue: any): any {
  let value = getValue(property, state);

  if (value === undefined) {
    value = getValue(property, defaultValue);
  }

  return value;
}

function doSaveProperty(state: any, propertySave: any): any {
  return mergeProperties([state, propertySave]);
}

function doSave(
  vscode: any,
  id: string,
  notifyCommand: string,
  state: any,
  reset: boolean
) {
  let command: any = {
    action: notifyCommand,
    content: { key: id, state: state, reload: reset },
  };

  vscode.postMessage(command);
}

const mementoList: any = {};

export function useMemento(
  vscode: any,
  id: string,
  notifyCommand: any,
  defaultValues: any,
  initialValues: any = {},
  autoSave: boolean = true
): any {
  if (mementoList.hasOwnProperty(id) && mementoList[id] !== undefined) {
    return mementoList[id];
  }

  mementoList[id] = {
    defaultValues: defaultValues,
    state: initialValues,
    get: (property: any): any => {
      let state = mementoList[id]["state"];
      let defaultValues = mementoList[id]["defaultValues"];

      return doLoadProperty(state, property, defaultValues);
    },
    set: (property: any) => {
      let state = mementoList[id]["state"];
      let savedState = doSaveProperty(state, property);

      if (JSON.stringify(state) !== JSON.stringify(savedState)) {
        state = { ...state, ...savedState };

        mementoList[id]["state"] = state;

        if (autoSave) {
          doSave(vscode, id, notifyCommand, state, false);
        }
      }
    },
    save: (reset: boolean = false) => {
      let state = mementoList[id]["state"];

      if (reset) {
        state = {};
        mementoList[id] = undefined;
      }

      doSave(vscode, id, notifyCommand, state, reset);
    },
    reload: () => {
      let state = mementoList[id]["state"];

      let command: any = {
        action: notifyCommand,
        content: { key: id, state: state, reload: true },
      };

      vscode.postMessage(command);
    },
  };

  return mementoList[id];
}
