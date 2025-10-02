// Type definitions for @melon-lang/core

export interface Token {
  type: string;
  value: string;
  line: number;
  column: number;
}

export interface CompilerError {
  message: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
  code: string;
  hint?: string;
}

export interface CompilationResult {
  success: boolean;
  output: string | null;
  errors: CompilerError[];
  warnings: Array<{
    message: string;
    location: {
      file: string;
      line: number;
      column: number;
    };
  }>;
}

export class Lexer {
  constructor(source: string, filename?: string);
  tokenize(): Token[];
}

export class Parser {
  constructor(tokens: Token[]);
  parse(): any; // AST node
}

export class TypeChecker {
  constructor(ast: any);
  check(): CompilationResult;
}

export declare function compile(
  source: string,
  baseDir?: string,
  options?: { filename?: string; optimizationLevel?: number }
): Promise<CompilationResult>;

export declare function validate(
  source: string,
  baseDir?: string,
  options?: { filename?: string }
): Promise<CompilationResult>;
