export interface IMemento {
  load: (property?: any) => any;
  reset: () => any;
  save: (property: any) => any;
}

function processKey(properties: any, parentKey: string = ""): string[] {
  let result = [];
  if (parentKey !== "") {
    parentKey += ".";
  }

  for (const key in properties) {
    const element = properties[key];

    if (typeof element === "object") {
      result.push(...processKey(element, parentKey + key));
    } else {
      result.push({ id: parentKey + key, value: element });
    }
  }

  return result;
}

function getValue(target: any, properties: any): any {
  let result = undefined;

  for (const key in target) {
    const element = target[key];

    if (properties.hasOwnProperty(key)) {
      if (Array.isArray(element)) {
        let list = [];

        if (element.length > 0){
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

function doResetMemento(vscode: any, id: string) {
  const state = vscode.getState(vscode);
  state.removeItem(id);
}

function diff(obj1: any, obj2: any): any {
  const result = {};

  if (Object.is(obj1, obj2)) {
    return undefined;
  }

  if (!obj2 || typeof obj2 !== "object") {
    return obj2;
  }

  Object.keys(obj1 || {})
    .concat(Object.keys(obj2 || {}))
    .forEach((key) => {
      if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key];
      }
      if (typeof obj2[key] === "object" && typeof obj1[key] === "object") {
        const value = diff(obj1[key], obj2[key]);
        if (value !== undefined) {
          result[key] = value;
        }
      }
    });

  return result;
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

function mountKey(properties: any): string[] {
  let result;

  for (const key in properties) {
    const element = properties[key];

    if (typeof element === "object") {
      result = +mountKey(element) + ".";
    } else {
      result = +"" + element; //força transformação
    }
  }

  return [result];
}

const mementoList: any = {};

export function useMemento(
  vscode: any,
  id: string,
  defaultValues: any,
  initialValues: any = {},
  notifyCommand?: any
): any {
  if (!mementoList.hasOwnProperty(id)) {
    let state = vscode.getState();

    mementoList[id] = defaultValues;

    if (state === undefined) {
      state = { [id]: initialValues };
    } else {
      state = { ...state, [id]: initialValues };
    }

    vscode.setState(state);
  }

  return {
    get: (property: any): any => {
      let state = vscode.getState();

      return doLoadProperty(state[id], property, mementoList[id]);
    },
    reset: () => {
      let state = vscode.getState();
      let savedState = { [id]: null };

      state = { ...state, [id]: {} };
      vscode.setState(state);

      if (notifyCommand) {
        let command: any = {
          action: notifyCommand,
          content: { key: id, state: savedState },
        };
        vscode.postMessage(command);
      }
    },
    set: (property: any) => {
      let state = vscode.getState();
      let savedState = doSaveProperty(state[id], property);

      state = { ...state, [id]: savedState };
      vscode.setState(state);

      if (notifyCommand) {
        let command: any = {
          action: notifyCommand,
          content: { key: id, state: savedState },
        };
        vscode.postMessage(command);
      }
    },
  };
}
