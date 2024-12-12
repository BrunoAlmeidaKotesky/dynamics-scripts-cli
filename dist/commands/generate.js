import { Command, Flags } from '@oclif/core';
import inquirer from 'inquirer';
import chalk from 'chalk';
import path, { dirname } from 'path';
import fs from 'fs-extra';
import nodePlop from 'node-plop';
import { fileURLToPath } from 'url';
import { getBasePrompts } from '../prompts/generate_prompts.js';
import { spawnSync } from 'child_process';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
class Generate extends Command {
    async run() {
        try {
            const baseAnswers = await inquirer.prompt(getBasePrompts());
            let targetDir = process.cwd();
            if (baseAnswers.useSubfolder && baseAnswers.subfolderName) {
                targetDir = path.join(targetDir, baseAnswers.subfolderName);
            }
            await fs.ensureDir(targetDir);
            const { projectName, includeModels, wantSamples } = baseAnswers;
            const generator = await this.initializePlop('project');
            if (!generator)
                throw new Error("Generator 'project' not found.");
            await generator.runActions({ targetDir, projectName, includeModels, wantSamples }, ({
                onFailure: ({ path, error }) => this.error(chalk.red(`❌ Failed to generate file ${path}: ${error}`)),
                onSuccess: ({ path }) => this.log(chalk.blue(`✔️ File generated at ${path}`)),
                onComment: (msg) => this.log(chalk.blue(msg))
            }));
            this.log(chalk.green(`✅ Project successfully generated at ${targetDir}`));
            const { packageManager } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'packageManager',
                    message: 'Which package manager would you like to use?',
                    choices: [
                        { name: 'npm', value: 'npm' },
                        { name: 'yarn', value: 'yarn' },
                        { name: 'pnpm', value: 'pnpm' },
                        { name: 'Skip installation', value: 'skip' }
                    ],
                    default: 'npm'
                }
            ]);
            this.log(chalk.blue(`⌛ Running ${packageManager} install...`));
            const result = spawnSync(packageManager, ['install'], { cwd: targetDir, stdio: 'inherit', shell: true });
            if (result.error)
                this.error(chalk.red(`❌ Failed to run ${packageManager} install: ${result.error.message}`));
            else
                this.log(chalk.green('✅ Dependencies installed successfully!'));
        }
        catch (error) {
            this.error(`❌ Error generating project: ${error.message}`);
        }
    }
    async initializePlop(generatorName) {
        const projectRoot = path.join(__dirname, '..', '..');
        const plopFilePath = path.join(projectRoot, 'plopfile.cjs');
        const plop = await nodePlop(plopFilePath);
        return plop.getGenerator(generatorName);
    }
}
Generate.description = 'Generate an easy to use project structure for Dynamics 365 scripts.';
Generate.examples = [
    `$ dynamics-scripts-cli generate`,
];
Generate.flags = {
    help: Flags.help({ char: 'h' }),
};
export default Generate;
