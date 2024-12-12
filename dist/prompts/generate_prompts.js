export function getBasePrompts() {
    const prompts = [
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
            validate: (input) => input ? true : 'Subfolder name is required.',
            when: (answers) => answers.useSubfolder === true,
        },
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            validate: (input) => input ? true : 'Project name is required.',
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
