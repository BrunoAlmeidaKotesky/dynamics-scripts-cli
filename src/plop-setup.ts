import { Actions, NodePlopAPI } from 'node-plop';
import path from 'path';

export default function (plop: NodePlopAPI) {
    const plopBase = plop.getPlopfilePath();

    plop.setGenerator('project', {
        description: 'Gera os arquivos e diretórios necessários para um projeto Dynamics 365',

        actions: (data) => {
            const actions: Actions = [];
            const { targetDir, projectName, includeModels, wantSamples } = data!;
            const baseTemplatePath = path.join(plopBase, 'src', 'templates');
            const files = [
                { template: 'tsconfig.json.hbs', destination: path.join(targetDir, 'tsconfig.json') },
                { template: 'tsconfig.buildscripts.json.hbs', destination: path.join(targetDir, 'tsconfig.buildscripts.json') },
                { template: 'rollup.config.js.hbs', destination: path.join(targetDir, 'rollup.config.js') },
                { template: 'package.json.hbs', destination: path.join(targetDir, 'package.json') },
                { template: 'files-with-imports-schema.json.hbs', destination: path.join(targetDir, 'files-with-imports-schema.json') },
                { template: 'buildAll.ts.hbs', destination: path.join(targetDir, 'buildAll.ts') },
                { template: '.gitignore.hbs', destination: path.join(targetDir, '.gitignore') },
            ];

            files.forEach(file => {
                const templateFullPath = path.join(baseTemplatePath, file.template);
                actions.push({
                    type: 'add',
                    path: file.destination,
                    templateFile: templateFullPath,
                    force: true,
                    abortOnFail: true,
                    data: file.template === 'package.json.hbs' ? { projectName } : undefined
                });
            });

            actions.push({
                type: 'add',
                path: path.join(targetDir, 'js', '.gitkeep'),
                template: '',
                abortOnFail: true,
            });

            if (includeModels) {
                actions.push({
                    type: 'add',
                    path: path.join(targetDir, 'models', 'index.d.ts'),
                    force: false,
                    abortOnFail: true
                });
            }

            if (wantSamples) {
                const samplesTemplatePath = path.join(baseTemplatePath, 'ts', 'samples');
                const sampleFiles = [
                    { template: 'helpers/Sample.ts.hbs', destination: path.join(targetDir, 'ts', 'samples', 'helpers', 'Sample.ts') },
                    { template: 'Dependencies.ts.hbs', destination: path.join(targetDir, 'ts', 'samples', 'Dependencies.ts') },
                    { template: 'FormContext.ts.hbs', destination: path.join(targetDir, 'ts', 'samples', 'FormContext.ts') },
                    { template: 'Ribbon.ts.hbs', destination: path.join(targetDir, 'ts', 'samples', 'Ribbon.ts') },
                ];

                sampleFiles.forEach(file => {
                    const sampleTemplateFullPath = path.join(samplesTemplatePath, file.template);
                    console.log(`[actions][samples] Adicionando sample: ${file.destination}, template: ${sampleTemplateFullPath}`);
                    actions.push({
                        type: 'add',
                        path: file.destination,
                        templateFile: sampleTemplateFullPath,
                        force: true,
                        abortOnFail: true,
                        skipIfExists: false
                    });
                });
                actions.push({
                    type: 'add',
                    path: path.join(targetDir, 'files-with-imports.json'),
                    template: '',
                    force: true,
                    abortOnFail: true,
                    transform: () => {
                        const json = {
                            $schema: "./files-with-imports-schema.json",
                            imports: [
                                { "input": "./ts/samples/helpers/Sample.ts", "output": "./js/helpers/Sample.js", "name": "Sample" },
                                { "input": "./ts/samples/Dependencies.ts", "output": "./js/Dependencies.js", "name": "Dependencies" }
                            ]
                        };
                        return JSON.stringify(json, null, 2);
                    }
                });

            } else {
                actions.push({
                    type: 'add',
                    path: path.join(targetDir, 'ts', '.gitkeep'),
                    template: '',
                    abortOnFail: false,
                });

                actions.push({
                    type: 'add',
                    path: path.join(targetDir, 'files-with-imports.json'),
                    templateFile: path.join(baseTemplatePath, 'files-with-imports.json.empty.hbs'),
                    force: true,
                    abortOnFail: false,
                });
            }
            return actions;
        },
    });
}