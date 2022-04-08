import {
  chain,
  noop,
  Rule,
} from '@angular-devkit/schematics';

import { addModuleToImports, addPackageJsonDependencies, createFiles, installPackageJsonDependencies } from './ng-add';


export default function (options: any): Rule {
  return chain([
    createFiles(options),
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
    options && options.skipPackageJson
      ? noop()
      : installPackageJsonDependencies(),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
  ]);
}
