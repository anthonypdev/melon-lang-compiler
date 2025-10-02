/**
 * Main exports for @melon-lang/core
 * The core compiler library for Melon language
 */

import { Lexer } from './lexer/index.js';
import { Parser } from './parser/index.js';
import { TypeChecker } from './analyzer/index.js';
import { PointerResolver } from './resolver/index.js';
import { CodeGenerator } from './codegen/index.js';

// Re-export modules
export * from './lexer/index.js';
export * from './parser/index.js';
export * from './analyzer/index.js';
export * from './resolver/index.js';
export * from './codegen/index.js';
export * from './errors/index.js';

/**
 * High-level compile function
 * @param {string} source - The .mln source code
 * @param {string} baseDir - Base directory for resolving imports
 * @param {object} options - Compilation options
 * @returns {Promise<object>} Compilation result
 */
export async function compile(source, baseDir, options = {}) {
  const result = {
    success: false,
    output: null,
    errors: [],
    warnings: [],
    stats: null
  };

  try {
    // Lexical analysis
    const lexer = new Lexer(source, options.filename || '<input>');
    const tokens = lexer.tokenize();

    // Parsing
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Type checking
    const typeChecker = new TypeChecker(ast);
    const typeCheckResult = typeChecker.check();

    result.warnings = typeCheckResult.warnings;

    if (!typeCheckResult.valid) {
      result.errors = typeCheckResult.errors;
      return result;
    }

    // Pointer resolution
    const resolver = new PointerResolver(baseDir);
    const resolvedAst = await resolver.resolve(ast);

    // Code generation
    const generator = new CodeGenerator(resolvedAst, options);
    const cmpOutput = generator.generate();

    result.success = true;
    result.output = cmpOutput;
    result.stats = generator.getStats();

    return result;

  } catch (error) {
    result.errors = [error];
    return result;
  }
}

/**
 * Validate without compiling
 * @param {string} source - The .mln source code
 * @param {string} baseDir - Base directory for resolving imports
 * @returns {Promise<object>} Validation result
 */
export async function validate(source, baseDir, options = {}) {
  const result = {
    valid: false,
    errors: [],
    warnings: []
  };

  try {
    // Lexical analysis
    const lexer = new Lexer(source, options.filename || '<input>');
    const tokens = lexer.tokenize();

    // Parsing
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Type checking
    const typeChecker = new TypeChecker(ast);
    const typeCheckResult = typeChecker.check();

    result.warnings = typeCheckResult.warnings;
    result.valid = typeCheckResult.valid;
    result.errors = typeCheckResult.errors;

    // Optionally check pointer validity
    if (options.checkPointers && result.valid) {
      try {
        const resolver = new PointerResolver(baseDir);
        await resolver.resolve(ast);
      } catch (error) {
        result.valid = false;
        result.errors.push(error);
      }
    }

    return result;

  } catch (error) {
    result.errors = [error];
    return result;
  }
}
