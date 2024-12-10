// src/plop-setup.ts
import { NodePlopAPI } from 'node-plop';
import path from 'path';

export default function (plop: NodePlopAPI) {
    plop.setGenerator('project', {
        description: 'Gera os arquivos e diretórios necessários para um projeto Dynamics 365',

        prompts: [
            {
                type: 'input',
                name: 'projectName',
                message: 'Nome do projeto:',
                validate: (input: string) => input ? true : 'Nome do projeto é obrigatório.',
            },
            {
                type: 'confirm',
                name: 'includeModels',
                message: 'Deseja incluir a pasta models com arquivos .d.ts?',
                default: false,
            },
        ],

        actions: (data: any) => {
            const actions = [];
            const { targetDir, projectName, includeModels } = data;

            // Definir os caminhos dos arquivos
            const files = [
                { template: 'tsconfig.json.hbs', destination: path.join(targetDir, 'tsconfig.json') },
                { template: 'tsconfig.buildscripts.json.hbs', destination: path.join(targetDir, 'tsconfig.buildscripts.json') },
                { template: 'rollup.config.js.hbs', destination: path.join(targetDir, 'rollup.config.js') },
                { template: 'popupGen.ts.hbs', destination: path.join(targetDir, 'popupGen.ts') },
                { template: 'package.json.hbs', destination: path.join(targetDir, 'package.json') },
                { template: 'files-with-imports.json.hbs', destination: path.join(targetDir, 'files-with-imports.json') },
                { template: 'buildAll.ts.hbs', destination: path.join(targetDir, 'buildAll.ts') },
            ];

            files.forEach(file => {
                actions.push({
                    type: 'add',
                    path: file.destination,
                    templateFile: path.join('src', 'templates', file.template),
                    force: true, // Sobrescrever se já existir
                });
            });

            // Criar diretórios 'ts' e 'js' com arquivos .gitkeep para versionamento
            actions.push({
                type: 'add',
                path: path.join(targetDir, 'ts', '.gitkeep'),
                template: '',
            });

            actions.push({
                type: 'add',
                path: path.join(targetDir, 'js', '.gitkeep'),
                template: '',
            });

            // Condicional: Criar diretório 'models' se solicitado
            if (includeModels) {
                actions.push({
                    type: 'add',
                    path: path.join(targetDir, 'models', 'index.d.ts'),
                    templateFile: path.join('src', 'templates', 'models.d.ts.hbs'),
                });
            }

            return actions;
        },
    });
}
