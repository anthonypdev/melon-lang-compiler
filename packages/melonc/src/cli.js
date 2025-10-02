import { program } from 'commander';
import { buildCommand } from './commands/build.js';
import { validateCommand } from './commands/validate.js';
import { initCommand } from './commands/init.js';

/**
 * melonc CLI program
 */
program
  .name('melonc')
  .description('Melon language compiler - compile .mln files to optimized .cmp prompts')
  .version('1.0.0');

// Build command
program
  .command('build <file>')
  .description('Compile .mln file to .cmp')
  .option('-o, --output <file>', 'Output file path')
  .option('-O, --optimize <level>', 'Optimization level (1-3)', '3')
  .option('--checksum', 'Include checksum in output')
  .option('--verbose', 'Verbose output')
  .action(buildCommand);

// Validate command
program
  .command('validate <file>')
  .description('Validate .mln file without compiling')
  .option('--no-check-pointers', 'Skip pointer resolution check')
  .option('--verbose', 'Verbose output')
  .action(validateCommand);

// Init command
program
  .command('init [directory]')
  .description('Initialize new Melon project')
  .option('-t, --template <name>', 'Template to use (basic|advanced)', 'basic')
  .action(initCommand);

// Shorthand: melonc file.mln (defaults to build)
program
  .argument('[file]', '.mln file to compile')
  .action((file) => {
    if (file && file.endsWith('.mln')) {
      buildCommand(file, { optimize: '3' });
    } else if (file) {
      console.error('Error: File must have .mln extension');
      process.exit(1);
    }
  });

program.parse();
