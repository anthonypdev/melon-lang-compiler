import chalk from 'chalk';

/**
 * Logger utility for pretty terminal output
 */
export const logger = {
  /**
   * Log error message
   */
  error(message, location) {
    console.error(chalk.red('✗'), message);
    if (location) {
      console.error(chalk.gray(`  → ${location.file}:${location.line}:${location.column}`));
    }
  },

  /**
   * Log success message
   */
  success(message) {
    console.log(chalk.green('✓'), message);
  },

  /**
   * Log info message
   */
  info(message) {
    console.log(chalk.blue('ℹ'), message);
  },

  /**
   * Log warning message
   */
  warn(message) {
    console.log(chalk.yellow('⚠'), message);
  },

  /**
   * Log detailed error with location and hint
   */
  errorWithLocation(error) {
    console.error(chalk.red(`\nError ${error.code || 'E000'}: ${error.message}`));
    
    if (error.location) {
      console.error(chalk.gray(`  → ${error.location.file}:${error.location.line}:${error.location.column}\n`));
    }

    if (error.hint) {
      console.error(chalk.yellow(`Hint: ${error.hint}\n`));
    }
  },

  /**
   * Log compilation statistics
   */
  stats(outputPath, elapsed, stats) {
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.green('  Compiled:'), chalk.white(outputPath));
    if (stats) {
      console.log(chalk.green('  Output size:'), chalk.white(`${stats.outputLength} chars (~${stats.outputTokens} tokens)`));
    }
    console.log(chalk.green('  Build time:'), chalk.white(`${elapsed}ms`));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  },

  /**
   * Log warnings
   */
  warnings(warnings) {
    if (warnings.length === 0) return;

    console.log(chalk.yellow('\n⚠  Warnings:\n'));
    for (const warning of warnings) {
      console.log(chalk.yellow('  •'), warning.message);
      if (warning.location) {
        console.log(chalk.gray(`    → Line ${warning.location.line}`));
      }
    }
    console.log();
  }
};
