import {
  chain,
  noop,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  NodeDependency,
  NodeDependencyType,
  addPackageJsonDependency,
  getWorkspace,
  getProjectFromWorkspace,
} from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addModuleImportToRootModule } from 'schematics-utilities/dist/cdk/utils/ast';

/**
 * Add dependencies in package.json file
 * @returns 
 */
export function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      {
        type: NodeDependencyType.Default,
        version: '~0.0.1',
        name: '@mugan86/ng-made-with-love',
      },
    ];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log(
        'info',
        `✅️ Added "${dependency.name}" into ${dependency.type}`
      );
    });

    return host;
  };
}

/**
 * Install dependencies in project and depdencies in node_modules file
 * @returns 
 */
function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

/**
 * 
 * @param options Options to use in configuration to generate app.module import
 * @returns 
 */
function addModuleToImports(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);

    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0]
    );
    const moduleName = 'MadeWithLoveModule';

    addModuleImportToRootModule(
      host,
      moduleName,
      '@mugan86/ng-made-with-love',
      project
    );
    context.logger.log('info', `✅️ "${moduleName}" is imported`);

    return host;
  };
}

export default function (options: any): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
    options && options.skipPackageJson
      ? noop()
      : installPackageJsonDependencies(),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
  ]);
}
