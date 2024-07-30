//import * as fs from 'fs';
//import * as path from 'path';
//import Utils from '../utils';
import { register as R4gl } from './fourglFormatting';
import { register as RAdvpl } from './advplFormatting';

export const documentFormatting = (_resources: string[]) => {
  //const resourceList: string[] = getResourceList(resources);
  // const advplResources: string[] = resourceList.filter((resource: string) =>
  //   Utils.isAdvPlSource(resource)
  // );
  // const fourglResources: string[] = resourceList.filter((resource: string) =>
  //   Utils.is4glSource(resource)
  // );

  // resourceFormatting(advplResources);
  // resourceFormatting(fourglResources);
};

// function getResourceList(resources: string[]): string[] {
//   const resultList: string[] = [];

//   resources.forEach((resourcePath: string) => {
//     const fi: fs.Stats = fs.lstatSync(resourcePath);
//     if (fi.isDirectory()) {
//       const filenames = fs
//         .readdirSync(resourcePath)
//         .map<string>((filename: string) => {
//           return path.join(resourcePath, filename);
//         });
//       resultList.push(...getResourceList(filenames));
//     } else {
//       resultList.push(resourcePath);
//     }
//   });

//   return resultList;
// }

export const register4glFormatting = () =>
  R4gl({ language: '4gl', scheme: 'file' });
export const registerAdvplFormatting = () =>
  RAdvpl({ language: 'advpl', scheme: 'file' });
