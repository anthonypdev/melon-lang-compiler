/**
 * Base compiler error class
 */
export class CompilerError extends Error {
  constructor(message, location, code = 'E000', hint = null) {
    super(message);
    this.name = 'CompilerError';
    this.location = location; // { file, line, column }
    this.code = code;
    this.hint = hint;
  }

  toString() {
    let str = `Error ${this.code}: ${this.message}\n`;
    if (this.location) {
      str += `  → ${this.location.file}:${this.location.line}:${this.location.column}\n`;
    }
    if (this.hint) {
      str += `\nHint: ${this.hint}\n`;
    }
    return str;
  }
}

/**
 * Syntax error during parsing
 */
export class SyntaxError extends CompilerError {
  constructor(message, location, hint = null) {
    super(message, location, 'E100', hint);
    this.name = 'SyntaxError';
  }
}

/**
 * Type error during semantic analysis
 */
export class TypeError extends CompilerError {
  constructor(message, location, hint = null) {
    super(message, location, 'E200', hint);
    this.name = 'TypeError';
  }
}

/**
 * Pointer resolution error
 */
export class PointerError extends CompilerError {
  constructor(message, location, hint = null) {
    super(message, location, 'E300', hint);
    this.name = 'PointerError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends CompilerError {
  constructor(message, location, hint = null) {
    super(message, location, 'E400', hint);
    this.name = 'ValidationError';
  }
}
