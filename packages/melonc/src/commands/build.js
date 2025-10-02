import fs from 'fs/promises';
import path from 'path';
import { compile } from '@melon-lang/core';
import { logger } from '../utils/logger.js';
import ora from 'ora';

/**
 * Build command - compile .mln file to .cmp
 */
export async function buildCommand(file, options) {
  const spinner = ora();
  const startTime = Date.now();

  try {
    // Read source file
    const source = await fs.readFile(file, 'utf-8');
    const baseDir = path.dirname(path.resolve(file));

    // Compile
    spinner.start('Compiling...');
    
    const result = await compile(source, baseDir, {
      filename: file,
      optimizationLevel: parseInt(options.optimize || 3),
      checksum: options.checksum
    });

    if (!result.success) {
      spinner.fail('Compilation failed');
      
      // Display errors
      for (const error of result.errors) {
        logger.errorWithLocation(error);
      }
      
      process.exit(1);
    }

    spinner.succeed('Compilation successful');

    // Display warnings if any
    if (result.warnings && result.warnings.length > 0) {
      logger.warnings(result.warnings);
    }

    // Write output
    const outputPath = options.output || file.replace('.mln', '.cmp');
    await fs.writeFile(outputPath, result.output, 'utf-8');

    const elapsed = Date.now() - startTime;

    // Display statistics
    logger.stats(outputPath, elapsed, result.stats);

  } catch (error) {
    spinner.fail('Build failed');
    logger.error(error.message);
    if (error.stack && options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
