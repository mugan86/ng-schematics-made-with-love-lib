import {
  apply,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
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
import { Schema } from './schema';

/**
 * Add dependencies in package.json file
 * @returns
 */
export function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      {
        type: NodeDependencyType.Default,
        version: '~3.0.0',
        name: 'apollo-angular',
      },
      {
        type: NodeDependencyType.Default,
        version: '~3.5.10',
        name: '@apollo/client',
      },
      {
        type: NodeDependencyType.Default,
        version: '~16.3.0',
        name: 'graphql',
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
export const installPackageJsonDependencies = (): Rule => {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
};

/**
 *
 * @param options Options to use in configuration to generate app.module import
 * @returns
 */
export const addModuleToImports = (options: any): Rule => {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);

    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0]
    );
    const moduleName = 'GraphQLModule';

    addModuleImportToRootModule(host, moduleName, './@graphql', project);
    context.logger.log('info', `✅️ "${moduleName}" is imported`);

    return host;
  };
};

// Esta es una función "factory" del esquema que ddevuelve una regla (función)
export const createFiles = (_options: Schema): Rule => {
  // Regla del esquema
  return (_tree: Tree, _context: SchematicContext) => {
    // Obtenemos los directorios y ficheros de nuestro template
    const sourceTemplates = url('./files');

    const workspace = getWorkspace(_tree);

    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      _options.project
        ? _options.project
        : Object.keys(workspace['projects'])[0]
    );

    // Especificamos en que directorio se guardará teniendo en cuenta
    // el directorio de la app principal "src/app"
    // Si en "path" no ponemos nada, se añade en "src/app"
    // Si añadimos "@graphql" se copia todo de "files" en @graphql
    // Teniendo en cuenta lo que hay en "files" en este caso
    // sería "src/app/@graphql/graphql/..."
    const addInDirectory = `${project.sourceRoot}/app${
      _options.path ? `/${_options.path}` : ``
    }`;
    
    // parametrizamos nuestro recurso del template
    // apply acepta la fuente y el array de reglas del "template"
    // procesa los templates.
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      // Pasamos las opciones que introducimos como "name"
      // con la función "helper" de los strings como "dasherize", "classify"...
      // y parametrizamos dentro de la fuente del template
      template({
        ..._options,
        // replaceText
        // ...strings,
        // addInterrogation
        // Añadimos está función para que añadamos un "?" cuando
        // llamemos a la función desde el template
      }),
      move(addInDirectory || ''),
    ]);
    // Mezclamos nuestro template en el "tree"
    return mergeWith(sourceParametrizedTemplates)(_tree, _context);
  };
};
