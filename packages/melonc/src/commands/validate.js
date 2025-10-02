import fs from 'fs/promises';
import path from 'path';
import { validate } from '@melon-lang/core';
import { logger } from '../utils/logger.js';
import ora from 'ora';

/**
 * Validate command - check .mln file without compiling
 */
export async function validateCommand(file, options) {
  const spinner = ora();

  try {
    // Read source file
    const source = await fs.readFile(file, 'utf-8');
    const baseDir = path.dirname(path.resolve(file));

    // Validate
    spinner.start('Validating...');
    
    const result = await validate(source, baseDir, {
      filename: file,
      checkPointers: options.checkPointers !== false
    });

    if (!result.valid) {
      spinner.fail('Validation failed');
      
      // Display errors
      for (const error of result.errors) {
        logger.errorWithLocation(error);
      }
      
      process.exit(1);
    }

    spinner.succeed('Validation successful');

    // Display warnings if any
    if (result.warnings && result.warnings.length > 0) {
      logger.warnings(result.warnings);
    } else {
      logger.success('No errors or warnings found');
    }

  } catch (error) {
    spinner.fail('Validation failed');
    logger.error(error.message);
    if (error.stack && options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
