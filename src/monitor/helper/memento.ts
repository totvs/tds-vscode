export interface IMemento {
  get: (property: any) => any;
  set: (property: any) => any;
  save: (vscode: any, notifyCommand: any) => void;
  reset: () => void;
}

const mementoList: any = {};

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

// function diff(obj1: any, obj2: any): any {
//   const result = {};

//   if (Object.is(obj1, obj2)) {
//     return undefined;
//   }

//   if (!obj2 || typeof obj2 !== "object") {
//     return obj2;
//   }

//   Object.keys(obj1 || {})
//     .concat(Object.keys(obj2 || {}))
//     .forEach((key) => {
//       if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
//         result[key] = obj2[key];
//       }
//       if (typeof obj2[key] === "object" && typeof obj1[key] === "object") {
//         const value = diff(obj1[key], obj2[key]);
//         if (value !== undefined) {
//           result[key] = value;
//         }
//       }
//     });

//   return result;
// }

function doLoadProperty(state: any, property: any, defaultValue: any): any {
  let value = getValue(property, state);

  if (value === undefined) {
    value = getValue(property, defaultValue);
  }

  return value;
}

function doSetProperty(state: any, propertySave: any): any {
  return mergeProperties([state, propertySave]);
}

export function useMemento(
  id: string,
  defaultValues: any,
  initialValues: any = {}
): IMemento {
  if (mementoList.hasOwnProperty(id) && mementoList[id] !== null) {
    return mementoList[id];
  }

  const _this = {
    init: () => {
      mementoList[id] = { defaultValues: defaultValues, state: initialValues };
    },
    get: (property: any): any => {
      const [ state, defaultValue] = mementoList[id];

      return doLoadProperty(state, property, defaultValues);
    },
    set: (property: any) => {
      const [state] = mementoList[id];

      doSetProperty(state, property);
    },
    save: (vscode: any, notifyCommand: any) => {
      const [ state ] = mementoList[id];

      if (notifyCommand) {
        let command: any = {
          action: notifyCommand,
          content: { key: id, state: state },
        };

        vscode.postMessage(command);
      }
    },
    reset: () => {
      mementoList[id] = null;
    },
  };

  _this.init();

  return _this;
}
