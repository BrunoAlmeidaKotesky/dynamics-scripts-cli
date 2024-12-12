"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var path_1 = __importDefault(require("path"));
function default_1(plop) {
    var plopBase = plop.getPlopfilePath();
    plop.setGenerator('project', {
        description: 'Gera os arquivos e diretórios necessários para um projeto Dynamics 365',
        actions: function (data) {
            var actions = [];
            var _a = data, targetDir = _a.targetDir, projectName = _a.projectName, includeModels = _a.includeModels, wantSamples = _a.wantSamples;
            var baseTemplatePath = path_1.default.join(plopBase, 'src', 'templates');
            var files = [
                { template: 'tsconfig.json.hbs', destination: path_1.default.join(targetDir, 'tsconfig.json') },
                { template: 'tsconfig.buildscripts.json.hbs', destination: path_1.default.join(targetDir, 'tsconfig.buildscripts.json') },
                { template: 'rollup.config.js.hbs', destination: path_1.default.join(targetDir, 'rollup.config.js') },
                { template: 'package.json.hbs', destination: path_1.default.join(targetDir, 'package.json') },
                { template: 'files-with-imports-schema.json.hbs', destination: path_1.default.join(targetDir, 'files-with-imports-schema.json') },
                { template: 'buildAll.ts.hbs', destination: path_1.default.join(targetDir, 'buildAll.ts') },
                { template: '.gitignore.hbs', destination: path_1.default.join(targetDir, '.gitignore') },
            ];
            files.forEach(function (file) {
                var templateFullPath = path_1.default.join(baseTemplatePath, file.template);
                actions.push({
                    type: 'add',
                    path: file.destination,
                    templateFile: templateFullPath,
                    force: true,
                    abortOnFail: true,
                    data: file.template === 'package.json.hbs' ? { projectName: projectName } : undefined
                });
            });
            actions.push({
                type: 'add',
                path: path_1.default.join(targetDir, 'js', '.gitkeep'),
                template: '',
                abortOnFail: true,
            });
            if (includeModels) {
                actions.push({
                    type: 'add',
                    path: path_1.default.join(targetDir, 'models', 'index.d.ts'),
                    force: false,
                    abortOnFail: true
                });
            }
            if (wantSamples) {
                var samplesTemplatePath_1 = path_1.default.join(baseTemplatePath, 'ts', 'samples');
                var sampleFiles = [
                    { template: 'helpers/Sample.ts.hbs', destination: path_1.default.join(targetDir, 'ts', 'samples', 'helpers', 'Sample.ts') },
                    { template: 'Dependencies.ts.hbs', destination: path_1.default.join(targetDir, 'ts', 'samples', 'Dependencies.ts') },
                    { template: 'FormContext.ts.hbs', destination: path_1.default.join(targetDir, 'ts', 'samples', 'FormContext.ts') },
                    { template: 'Ribbon.ts.hbs', destination: path_1.default.join(targetDir, 'ts', 'samples', 'Ribbon.ts') },
                ];
                sampleFiles.forEach(function (file) {
                    var sampleTemplateFullPath = path_1.default.join(samplesTemplatePath_1, file.template);
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
                    path: path_1.default.join(targetDir, 'files-with-imports.json'),
                    template: '',
                    force: true,
                    abortOnFail: true,
                    transform: function () {
                        var json = {
                            $schema: "./files-with-imports-schema.json",
                            imports: [
                                { "input": "./ts/samples/helpers/Sample.ts", "output": "./js/helpers/Sample.js", "name": "Sample" },
                                { "input": "./ts/samples/Dependencies.ts", "output": "./js/Dependencies.js", "name": "Dependencies" }
                            ]
                        };
                        return JSON.stringify(json, null, 2);
                    }
                });
            }
            else {
                actions.push({
                    type: 'add',
                    path: path_1.default.join(targetDir, 'ts', '.gitkeep'),
                    template: '',
                    abortOnFail: false,
                });
                actions.push({
                    type: 'add',
                    path: path_1.default.join(targetDir, 'files-with-imports.json'),
                    templateFile: path_1.default.join(baseTemplatePath, 'files-with-imports.json.empty.hbs'),
                    force: true,
                    abortOnFail: false,
                });
            }
            return actions;
        },
    });
}
