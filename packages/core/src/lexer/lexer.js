import { Token, TokenType, KEYWORDS } from './tokens.js';
import { CompilerError } from '../errors/error-types.js';

/**
 * Lexer for the Melon language
 * Converts source code into a stream of tokens
 */
export class Lexer {
  constructor(source, filename = '<input>') {
    this.source = source;
    this.filename = filename;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  /**
   * Main tokenization method
   * @returns {Token[]} Array of tokens
   */
  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();
      if (this.pos >= this.source.length) break;

      const char = this.peek();

      // Skip comments
      if (char === '/' && this.peekNext() === '/') {
        this.skipLineComment();
        continue;
      }

      if (char === '/' && this.peekNext() === '*') {
        this.skipBlockComment();
        continue;
      }

      // String literals
      if (char === '"') {
        this.tokens.push(this.readString());
        continue;
      }

      // Numbers
      if (this.isDigit(char) || (char === '-' && this.isDigit(this.peekNext()))) {
        this.tokens.push(this.readNumber());
        continue;
      }

      // Identifiers and keywords
      if (this.isAlpha(char) || char === '_') {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      // Two-character operators
      if (char === '-' && this.peekNext() === '>') {
        this.tokens.push(this.makeToken(TokenType.ARROW, '->'));
        this.advance(2);
        continue;
      }

      // Single character tokens
      const single = this.readSingleChar();
      if (single) {
        this.tokens.push(single);
        continue;
      }

      throw this.error(`Unexpected character: '${char}'`);
    }

    this.tokens.push(this.makeToken(TokenType.EOF, ''));
    return this.tokens;
  }

  /**
   * Read a string literal
   */
  readString() {
    const startLine = this.line;
    const startColumn = this.column;
    this.advance(); // Skip opening quote

    let value = '';
    while (this.pos < this.source.length && this.peek() !== '"') {
      if (this.peek() === '\\') {
        this.advance();
        const escaped = this.peek();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          default: value += escaped;
        }
        this.advance();
      } else {
        value += this.peek();
        this.advance();
      }
    }

    if (this.peek() !== '"') {
      throw this.error('Unterminated string literal');
    }

    this.advance(); // Skip closing quote
    return new Token(TokenType.STRING_LITERAL, value, startLine, startColumn);
  }

  /**
   * Read a number literal
   */
  readNumber() {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    // Handle negative sign
    if (this.peek() === '-') {
      value += this.peek();
      this.advance();
    }

    // Read integer part
    while (this.isDigit(this.peek())) {
      value += this.peek();
      this.advance();
    }

    // Read decimal part if present
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      value += this.peek();
      this.advance();
      while (this.isDigit(this.peek())) {
        value += this.peek();
        this.advance();
      }
    }

    return new Token(TokenType.NUMBER_LITERAL, value, startLine, startColumn);
  }

  /**
   * Read an identifier or keyword
   */
  readIdentifier() {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    while (this.isAlphaNumeric(this.peek()) || this.peek() === '_') {
      value += this.peek();
      this.advance();
    }

    const type = KEYWORDS[value] || TokenType.IDENTIFIER;
    return new Token(type, value, startLine, startColumn);
  }

  /**
   * Read single character token
   */
  readSingleChar() {
    const char = this.peek();
    const startLine = this.line;
    const startColumn = this.column;

    let type = null;
    switch (char) {
      case '|': type = TokenType.PIPE; break;
      case '^': type = TokenType.CARET; break;
      case '§': type = TokenType.SECTION; break;
      case ':': type = TokenType.COLON; break;
      case ',': type = TokenType.COMMA; break;
      case '.': type = TokenType.DOT; break;
      case '=': type = TokenType.EQUALS; break;
      case '(': type = TokenType.LPAREN; break;
      case ')': type = TokenType.RPAREN; break;
      case '{': type = TokenType.LBRACE; break;
      case '}': type = TokenType.RBRACE; break;
      default: return null;
    }

    this.advance();
    return new Token(type, char, startLine, startColumn);
  }

  /**
   * Skip whitespace characters
   */
  skipWhitespace() {
    while (this.pos < this.source.length) {
      const char = this.peek();
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
      } else if (char === '\n') {
        this.advance();
        this.line++;
        this.column = 1;
      } else {
        break;
      }
    }
  }

  /**
   * Skip line comment starting with //
   */
  skipLineComment() {
    while (this.pos < this.source.length && this.peek() !== '\n') {
      this.advance();
    }
  }

  /**
   * Skip block comment delimited by slash-star and star-slash
   */
  skipBlockComment() {
    this.advance(2); // Skip /*
    
    while (this.pos < this.source.length) {
      if (this.peek() === '*' && this.peekNext() === '/') {
        this.advance(2); // Skip */
        return;
      }
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    throw this.error('Unterminated block comment');
  }

  /**
   * Helper methods
   */
  peek(offset = 0) {
    const pos = this.pos + offset;
    return pos < this.source.length ? this.source[pos] : '\0';
  }

  peekNext() {
    return this.peek(1);
  }

  advance(count = 1) {
    for (let i = 0; i < count; i++) {
      if (this.pos < this.source.length) {
        this.pos++;
        this.column++;
      }
    }
  }

  isDigit(char) {
    return char >= '0' && char <= '9';
  }

  isAlpha(char) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }

  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  makeToken(type, value) {
    return new Token(type, value, this.line, this.column);
  }

  error(message) {
    return new CompilerError(
      message,
      { file: this.filename, line: this.line, column: this.column },
      'E001'
    );
  }
}
