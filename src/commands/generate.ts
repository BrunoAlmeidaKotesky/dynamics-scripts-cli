// src/commands/generate.ts
import { Command, Flags } from '@oclif/core';
import inquirer from 'inquirer';
import chalk from 'chalk';
import path, { dirname } from 'path';
import fs from 'fs-extra';
import nodePlop from 'node-plop';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class Generate extends Command {
  static description = 'Gera os arquivos e diretórios necessários para um projeto Dynamics 365';

  static examples = [
    `$ dynamics-scripts-cli generate`,
  ];

  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  async run() {
    try {
      this.log(chalk.blue('Iniciando geração do projeto...'));

      // Prompt para determinar se deve usar uma subpasta
      const { useSubfolder } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useSubfolder',
          message: 'Deseja criar em uma subpasta?',
          default: false,
        },
      ]);

      let targetDir = process.cwd();

      if (useSubfolder) {
        const { subfolderName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'subfolderName',
            message: 'Nome da subpasta:',
            validate: (input: string) => input ? true : 'Nome da subpasta é obrigatório.',
          },
        ]);
        targetDir = path.join(targetDir, subfolderName);
      }

      // Garantir que o diretório de destino existe
      await fs.ensureDir(targetDir);

      // Prompt para obter o nome do projeto e se inclui models
      const { projectName, includeModels } = await inquirer.prompt([
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
      ]);

      this.log(chalk.green('Dados coletados:', { targetDir, projectName, includeModels }));

      // Inicializar node-plop com o plop-setup.js
      const projectRoot = path.join(__dirname, '..', '..');
      const plopFilePath = path.join(projectRoot, 'plopfile.cjs');
      const plop = await nodePlop(plopFilePath);
      // Executar o gerador 'project'
      const generator = plop.getGenerator('project');
      if (!generator) {
        throw new Error('Gerador de projeto não encontrado.');
      }

      // Executar as ações do gerador com os dados coletados
      await generator.runActions({ targetDir, projectName, includeModels });

      // Mensagem de sucesso
      this.log(chalk.green(`Projeto gerado com sucesso em ${targetDir}`));
    } catch (error: any) {
      this.error(`Erro ao gerar o projeto: ${error.message}`);
    }
  }
}
