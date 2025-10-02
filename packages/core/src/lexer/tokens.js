/**
 * Token types for the Melon language lexer
 */
export const TokenType = {
  // Keywords
  IMPORT: 'IMPORT',
  FROM: 'FROM',
  AS: 'AS',
  PROMPT: 'PROMPT',
  META: 'META',
  SCHEMA: 'SCHEMA',
  PERSONA: 'PERSONA',
  AXIOM: 'AXIOM',
  TRAITS: 'TRAITS',
  EXAMPLE: 'EXAMPLE',
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
  ON: 'ON',
  PROC: 'PROC',
  TOOLS: 'TOOLS',
  TOOL: 'TOOL',
  CHECKSUM: 'CHECKSUM',
  CONFIDENCE_TOKEN: 'CONFIDENCE_TOKEN',
  
  // Types
  STRING: 'STRING',
  INT: 'INT',
  FLOAT: 'FLOAT',
  BOOL: 'BOOL',
  JSON: 'JSON',
  ARRAY: 'ARRAY',
  ENUM: 'ENUM',
  POINTER: 'POINTER',
  
  // Literals
  STRING_LITERAL: 'STRING_LITERAL',
  NUMBER_LITERAL: 'NUMBER_LITERAL',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  
  // Identifiers
  IDENTIFIER: 'IDENTIFIER',
  
  // Operators & Delimiters
  ARROW: 'ARROW',           // ->
  PIPE: 'PIPE',             // |
  CARET: 'CARET',           // ^
  SECTION: 'SECTION',       // §
  COLON: 'COLON',           // :
  COMMA: 'COMMA',           // ,
  DOT: 'DOT',               // .
  EQUALS: 'EQUALS',         // =
  
  // Brackets
  LPAREN: 'LPAREN',         // (
  RPAREN: 'RPAREN',         // )
  LBRACE: 'LBRACE',         // {
  RBRACE: 'RBRACE',         // }
  
  // Special
  NEWLINE: 'NEWLINE',
  EOF: 'EOF',
  COMMENT: 'COMMENT',
};

/**
 * Keywords map for quick lookup
 */
export const KEYWORDS = {
  'import': TokenType.IMPORT,
  'from': TokenType.FROM,
  'as': TokenType.AS,
  'prompt': TokenType.PROMPT,
  'meta': TokenType.META,
  'schema': TokenType.SCHEMA,
  'persona': TokenType.PERSONA,
  'axiom': TokenType.AXIOM,
  'traits': TokenType.TRAITS,
  'example': TokenType.EXAMPLE,
  'positive': TokenType.POSITIVE,
  'negative': TokenType.NEGATIVE,
  'on': TokenType.ON,
  'proc': TokenType.PROC,
  'tools': TokenType.TOOLS,
  'tool': TokenType.TOOL,
  'checksum': TokenType.CHECKSUM,
  'confidence_token': TokenType.CONFIDENCE_TOKEN,
  'string': TokenType.STRING,
  'int': TokenType.INT,
  'float': TokenType.FLOAT,
  'bool': TokenType.BOOL,
  'json': TokenType.JSON,
  'array': TokenType.ARRAY,
  'enum': TokenType.ENUM,
  'Pointer': TokenType.POINTER,
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
};

/**
 * Token class representing a single lexical token
 */
export class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.location = { line, column };
  }
  
  toString() {
    return `Token(${this.type}, '${this.value}', ${this.location.line}:${this.location.column})`;
  }
}
