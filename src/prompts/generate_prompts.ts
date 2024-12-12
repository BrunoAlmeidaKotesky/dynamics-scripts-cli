import { DistinctQuestion } from 'inquirer';

export function getBasePrompts() {
    const prompts: DistinctQuestion<{ useSubfolder: boolean, subfolderName: string, projectName: string, includeModels: boolean, wantSamples: boolean }>[] = [
        {
            type: 'confirm',
            name: 'useSubfolder',
            message: 'Would you like to create the project in a subfolder?',
            default: false,
        },
        {
            type: 'input',
            name: 'subfolderName',
            message: 'Subfolder name:',
            validate: (input: string) => input ? true : 'Subfolder name is required.',
            when: (answers) => answers.useSubfolder === true,
        },
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            validate: (input: string) => input ? true : 'Project name is required.',
        },
        {
            type: 'confirm',
            name: 'includeModels',
            message: 'Would you like to include the models folder with .d.ts files?',
            default: false,
        },
        {
            type: 'confirm',
            name: 'wantSamples',
            message: 'Would you like to generate sample TS files in the "ts/samples" folder?',
            default: true
        }
    ];

    return prompts;
}