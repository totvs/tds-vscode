const mementoList = [];

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

function update(target: any, properties: any): any {
  for (const key in properties) {
    const element = properties[key];

    if (typeof element === "object") {
      target[key] = update(target[key], properties[key]);
    } else {
      target[key] = element;
    }
  }

  return target;
}

export function createMemento(
  id: string,
  target: any,
  propertiesDefault: any
): any {
  const propertiesValue: any = process(propertiesDefault);
  const savedValues = localStorage.getItem("@totvs.tds." + id);
  let updatedValues = propertiesValue;

  if (savedValues) {
    updatedValues = update(propertiesDefault, JSON.parse(savedValues));
  }

  mementoList[id] = updatedValues;

  return {
    memento: (): any => {
      return updatedValues;
    },
    reset: () => {
      doResetMemento(id, propertiesValue);
    },
    save: (property: any) => {
      doSaveMemento(id, updatedValues, property);
    },
  };
}

function doResetMemento(id: string, propertiesDefault: any) {
  localStorage.removeItem("@totvs.tds." + id);
}

function doSaveMemento(
  id: string,
  propertiesList: any,
  propertiesSave: any
) {
  const updatedValues = update(propertiesList, propertiesSave );

  localStorage.setItem("@totvs.tds." + id, JSON.stringify(updatedValues));
}

export function useMemento(
  id: string
): any {
  return mementoList[id];
}
