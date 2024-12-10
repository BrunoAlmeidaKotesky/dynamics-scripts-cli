"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var path_1 = __importDefault(require("path"));
function default_1(plop) {
    plop.setGenerator('project', {
        description: 'Gera os arquivos e diretórios necessários para um projeto Dynamics 365',
        prompts: [
            {
                type: 'input',
                name: 'projectName',
                message: 'Nome do projeto:',
                validate: function (input) { return input ? true : 'Nome do projeto é obrigatório.'; },
            },
            {
                type: 'confirm',
                name: 'includeModels',
                message: 'Deseja incluir a pasta models com arquivos .d.ts?',
                default: false,
            },
        ],
        actions: function (data) {
            var actions = [];
            var targetDir = data.targetDir, projectName = data.projectName, includeModels = data.includeModels;
            // Definir os caminhos dos arquivos
            var files = [
                { template: 'tsconfig.json.hbs', destination: path_1.default.join(targetDir, 'tsconfig.json') },
                { template: 'tsconfig.buildscripts.json.hbs', destination: path_1.default.join(targetDir, 'tsconfig.buildscripts.json') },
                { template: 'rollup.config.js.hbs', destination: path_1.default.join(targetDir, 'rollup.config.js') },
                { template: 'popupGen.ts.hbs', destination: path_1.default.join(targetDir, 'popupGen.ts') },
                { template: 'package.json.hbs', destination: path_1.default.join(targetDir, 'package.json') },
                { template: 'files-with-imports.json.hbs', destination: path_1.default.join(targetDir, 'files-with-imports.json') },
                { template: 'buildAll.ts.hbs', destination: path_1.default.join(targetDir, 'buildAll.ts') },
            ];
            files.forEach(function (file) {
                actions.push({
                    type: 'add',
                    path: file.destination,
                    templateFile: path_1.default.join('src', 'templates', file.template),
                    force: true, // Sobrescrever se já existir
                });
            });
            // Criar diretórios 'ts' e 'js' com arquivos .gitkeep para versionamento
            actions.push({
                type: 'add',
                path: path_1.default.join(targetDir, 'ts', '.gitkeep'),
                template: '',
            });
            actions.push({
                type: 'add',
                path: path_1.default.join(targetDir, 'js', '.gitkeep'),
                template: '',
            });
            // Condicional: Criar diretório 'models' se solicitado
            if (includeModels) {
                actions.push({
                    type: 'add',
                    path: path_1.default.join(targetDir, 'models', 'index.d.ts'),
                    templateFile: path_1.default.join('src', 'templates', 'models.d.ts.hbs'),
                });
            }
            return actions;
        },
    });
}
