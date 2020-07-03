
export interface IMemento {
  load: (property?: any) => any,
  reset: () => any,
  save: (property: any) => any
}

const mementoList:IMemento[] = [];

function process(properties: any): any {
  const result = {};

  for (const key in properties) {
    const element = properties[key];

    if (typeof element === "object") {
      result[key] = process(element);
    } else {
      result[key] = element;
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
      if(target.hasOwnProperty(key)){
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

export function createMemento(
  id: string,
  propertiesDefault: any
): IMemento {
  const propertiesValue: any = process(propertiesDefault);
  const savedValues = localStorage.getItem("@totvs.tds." + id);
  let updatedValues = propertiesValue;

  if (savedValues) {
    updatedValues = update(propertiesDefault, JSON.parse(savedValues));
  }

  mementoList[id] = updatedValues;

  return {
    load: (property: any = undefined): any => {
      return property?doLoadProperty(id, property):mementoList[id];
    },
    reset: () => {
      doResetMemento(id);
    },
    save: (property: any) => {
      doSaveMemento(id, property);
    },
  };
}

function doResetMemento(id: string) {
  localStorage.removeItem("@totvs.tds." + id);
  mementoList[id] = null;
}

function doLoadProperty(id: string, property: any): any {
  const values: any = mementoList[id];
  let value: any = getValue(property, values);

  return value;
}

function doSaveMemento(id: string, propertiesSave: any) {
   mementoList[id] = update(mementoList[id], propertiesSave);

  localStorage.setItem("@totvs.tds." + id, JSON.stringify(mementoList[id]));
}

export function useMemento(id: string): any {
  return mementoList[id];
}
