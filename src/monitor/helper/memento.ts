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
  let result = null;

  for (const key in target) {
    const element = target[key];

    if (typeof element === "object") {
      result = getValue(element, properties[key]);
    } else {
      result = properties[key];
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

function doLoadProperty(state: any, property: any, defaultValue: any): any {
  const propList = processKey(property);
  let result = {};

  for (let index = 0; index < propList.length; index++) {
    const prop = propList[index];

    if (state.hasOwnProperty(prop["id"])) {
      result = { ...result, ...state[prop["id"]] };
    } else if (defaultValue) {
      result = { ...result, ...doLoadProperty(defaultValue, property, null) };
    }
  }

  return result;
}

function doSaveProperty(state: any, propertySave: any): any {
  const propList = processKey(propertySave);

  for (let index = 0; index < propList.length; index++) {
    const prop = propList[index];

    state[prop["id"]] = prop["value"];
  }

  return state;
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

export function useMemento(vscode: any, id: string, defaultValues: any, initialValues: any = {}, notifyCommand?: any): any {
  if (!mementoList.hasOwnProperty(id)) {
    let state = vscode.getState();
    let map = {}

    processKey(defaultValues).forEach((element) => {
      map[element["id"]] = element["value"];
    });
    mementoList[id] = map;

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
          content: { key: id, state: savedState }
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
          content: { key: id, state: savedState }
        };
        vscode.postMessage(command);
      }
    },
  };
}
