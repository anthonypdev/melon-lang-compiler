import { TokenType } from '../lexer/tokens.js';
import { SyntaxError } from '../errors/error-types.js';
import {
  ProgramNode, ImportNode, PromptNode, MetaNode,
  SchemaNode, FieldNode, TypeNode, ArrayTypeNode, EnumTypeNode, SchemaRefNode,
  PersonaNode, TraitNode, ExampleNode, PointerNode,
  ProcNode, StateNode, ToolsNode, ToolNode, ParameterNode
} from './ast.js';

/**
 * Recursive descent parser for Melon language
 */
export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  /**
   * Parse the entire program
   */
  parse() {
    const imports = this.parseImports();
    const prompt = this.parsePrompt();
    return new ProgramNode(imports, prompt, this.peek().location);
  }

  /**
   * Parse import statements
   */
  parseImports() {
    const imports = [];
    while (this.match(TokenType.IMPORT)) {
      imports.push(this.parseImport());
    }
    return imports;
  }

  /**
   * Parse single import: import ontology from "./path.json"
   */
  parseImport() {
    const location = this.previous().location;
    const name = this.consume(TokenType.IDENTIFIER, 'Expected import name').value;
    this.consume(TokenType.FROM, 'Expected "from"');
    const path = this.consume(TokenType.STRING_LITERAL, 'Expected path string').value;
    return new ImportNode(name, path, location);
  }

  /**
   * Parse prompt declaration
   */
  parsePrompt() {
    const location = this.consume(TokenType.PROMPT, 'Expected "prompt"').location;
    const headerStr = this.consume(TokenType.STRING_LITERAL, 'Expected prompt header').value;
    const header = this.parsePromptHeader(headerStr);
    
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    const blocks = {
      meta: null,
      schemas: [],
      persona: null,
      proc: null,
      tools: null
    };
    
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.META)) {
        blocks.meta = this.parseMetaBlock();
      } else if (this.match(TokenType.SCHEMA)) {
        blocks.schemas.push(this.parseSchemaBlock());
      } else if (this.match(TokenType.PERSONA)) {
        blocks.persona = this.parsePersonaBlock();
      } else if (this.match(TokenType.PROC)) {
        blocks.proc = this.parseProcBlock();
      } else if (this.match(TokenType.TOOLS)) {
        blocks.tools = this.parseToolsBlock();
      } else {
        throw this.error('Unexpected token in prompt body');
      }
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    
    // Validate proc block is present
    if (!blocks.proc) {
      throw this.error('Prompt must contain a proc block');
    }
    
    return new PromptNode(
      header.name,
      header.version,
      header.mode,
      blocks,
      location
    );
  }

  /**
   * Parse prompt header string: "name:version|mode:value"
   */
  parsePromptHeader(headerStr) {
    const parts = headerStr.split('|');
    if (parts.length !== 2) {
      throw this.error('Invalid prompt header format. Expected "name:version|mode:value"');
    }
    
    const [nameVersion, modeValue] = parts;
    const nvParts = nameVersion.split(':');
    if (nvParts.length !== 2) {
      throw this.error('Invalid name:version format');
    }
    
    const mvParts = modeValue.split(':');
    if (mvParts.length !== 2 || mvParts[0] !== 'mode') {
      throw this.error('Invalid mode format. Expected "mode:value"');
    }
    
    return {
      name: nvParts[0],
      version: nvParts[1],
      mode: mvParts[1]
    };
  }

  /**
   * Parse meta block
   */
  parseMetaBlock() {
    const location = this.previous().location;
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    const directives = {};
    
    while (!this.check(TokenType.RBRACE)) {
      // Allow keywords as directive names (checksum, confidence_token, etc.)
      let name;
      if (this.check(TokenType.IDENTIFIER)) {
        name = this.advance().value;
      } else if (this.check(TokenType.CHECKSUM)) {
        name = 'checksum';
        this.advance();
      } else if (this.check(TokenType.CONFIDENCE_TOKEN)) {
        name = 'confidence_token';
        this.advance();
      } else {
        throw this.error('Expected directive name');
      }
      
      this.consume(TokenType.COLON, 'Expected ":"');
      
      // Parse value (true/false for now)
      if (this.match(TokenType.TRUE)) {
        directives[name] = true;
      } else if (this.match(TokenType.FALSE)) {
        directives[name] = false;
      } else {
        throw this.error('Expected true or false');
      }
      
      this.consume(TokenType.COMMA, 'Expected ","');
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    return new MetaNode(directives, location);
  }

  /**
   * Parse schema block
   */
  parseSchemaBlock() {
    const location = this.previous().location;
    const name = this.consume(TokenType.IDENTIFIER, 'Expected schema name').value;
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    const fields = [];
    while (!this.check(TokenType.RBRACE)) {
      const fieldLocation = this.peek().location;
      const fieldName = this.consume(TokenType.IDENTIFIER, 'Expected field name').value;
      this.consume(TokenType.COLON, 'Expected ":"');
      const fieldType = this.parseType();
      this.consume(TokenType.COMMA, 'Expected ","');
      
      fields.push(new FieldNode(fieldName, fieldType, fieldLocation));
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    return new SchemaNode(name, fields, location);
  }

  /**
   * Parse type annotation
   */
  parseType() {
    const location = this.peek().location;
    
    // Primitive types
    if (this.match(TokenType.STRING)) return new TypeNode('string', location);
    if (this.match(TokenType.INT)) return new TypeNode('int', location);
    if (this.match(TokenType.FLOAT)) return new TypeNode('float', location);
    if (this.match(TokenType.BOOL)) return new TypeNode('bool', location);
    if (this.match(TokenType.JSON)) return new TypeNode('json', location);
    
    // Array type
    if (this.match(TokenType.ARRAY)) {
      this.consume(TokenType.LPAREN, 'Expected "("');
      const elementType = this.parseType();
      this.consume(TokenType.RPAREN, 'Expected ")"');
      return new ArrayTypeNode(elementType, location);
    }
    
    // Enum type
    if (this.match(TokenType.ENUM)) {
      this.consume(TokenType.LPAREN, 'Expected "("');
      const values = [];
      do {
        values.push(this.consume(TokenType.IDENTIFIER, 'Expected enum value').value);
      } while (this.match(TokenType.COMMA));
      this.consume(TokenType.RPAREN, 'Expected ")"');
      return new EnumTypeNode(values, location);
    }
    
    // Schema reference
    if (this.check(TokenType.IDENTIFIER)) {
      return new SchemaRefNode(this.advance().value, location);
    }
    
    throw this.error('Expected type');
  }

  /**
   * Parse persona block
   */
  parsePersonaBlock() {
    const location = this.previous().location;
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    let axiom = null;
    const traits = {};
    const examples = [];
    
    while (!this.check(TokenType.RBRACE)) {
      if (this.match(TokenType.AXIOM)) {
        this.consume(TokenType.COLON, 'Expected ":"');
        axiom = this.parsePointer();
        this.consume(TokenType.COMMA, 'Expected ","');
      } else if (this.match(TokenType.TRAITS)) {
        this.consume(TokenType.LBRACE, 'Expected "{"');
        while (!this.check(TokenType.RBRACE)) {
          const traitName = this.consume(TokenType.IDENTIFIER, 'Expected trait name').value;
          this.consume(TokenType.COLON, 'Expected ":"');
          const value = parseFloat(this.consume(TokenType.NUMBER_LITERAL, 'Expected number').value);
          traits[traitName] = value;
          this.consume(TokenType.COMMA, 'Expected ","');
        }
        this.consume(TokenType.RBRACE, 'Expected "}"');
      } else if (this.match(TokenType.EXAMPLE)) {
        examples.push(this.parseExample());
      } else {
        throw this.error('Unexpected token in persona block');
      }
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    return new PersonaNode(axiom, traits, examples, location);
  }

  /**
   * Parse example directive
   */
  parseExample() {
    const location = this.previous().location;
    this.consume(TokenType.LPAREN, 'Expected "("');
    
    // Parse polarity (positive/negative)
    let polarity;
    if (this.match(TokenType.POSITIVE)) {
      polarity = 'positive';
    } else if (this.match(TokenType.NEGATIVE)) {
      polarity = 'negative';
    } else {
      throw this.error('Expected "positive" or "negative"');
    }
    
    this.consume(TokenType.COMMA, 'Expected ","');
    this.consume(TokenType.ON, 'Expected "on"');
    this.consume(TokenType.COLON, 'Expected ":"');
    
    const trait = this.consume(TokenType.IDENTIFIER, 'Expected trait name').value;
    this.consume(TokenType.RPAREN, 'Expected ")"');
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    // Parse if/then pointers
    this.consume(TokenType.IDENTIFIER, 'Expected "if"');
    this.consume(TokenType.COLON, 'Expected ":"');
    const ifPointer = this.parsePointer();
    this.consume(TokenType.COMMA, 'Expected ","');
    
    this.consume(TokenType.IDENTIFIER, 'Expected "then"');
    this.consume(TokenType.COLON, 'Expected ":"');
    const thenPointer = this.parsePointer();
    this.consume(TokenType.COMMA, 'Expected ","');
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    
    return new ExampleNode(polarity, trait, ifPointer, thenPointer, location);
  }

  /**
   * Parse pointer: ontology.path.to.value as Pointer
   */
  parsePointer() {
    const location = this.peek().location;
    
    // Parse path (identifier.identifier...)
    // First part must be identifier
    let path = this.consume(TokenType.IDENTIFIER, 'Expected pointer path').value;
    
    // Subsequent parts can be identifiers or keywords
    while (this.match(TokenType.DOT)) {
      path += '.';
      // Accept identifier or keyword
      const nextToken = this.peek();
      if (this.check(TokenType.IDENTIFIER)) {
        path += this.advance().value;
      } else {
        // Accept keywords as path components (tools, axioms, examples, etc.)
        path += this.advance().value.toLowerCase();
      }
    }
    
    this.consume(TokenType.AS, 'Expected "as"');
    this.consume(TokenType.POINTER, 'Expected "Pointer"');
    
    return new PointerNode(path, location);
  }

  /**
   * Parse proc block
   */
  parseProcBlock() {
    const location = this.previous().location;
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    const states = [];
    let stateId = 0;
    
    // Parse first state
    states.push(this.parseState(stateId++));
    
    // Parse remaining states connected by arrows
    while (this.match(TokenType.ARROW)) {
      states.push(this.parseState(stateId++));
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    return new ProcNode(states, location);
  }

  /**
   * Parse state: S0(label) or S1(exec: tool) or S2(format: Schema)
   */
  parseState(expectedId) {
    const location = this.peek().location;
    
    // Parse S0, S1, etc.
    const idToken = this.consume(TokenType.IDENTIFIER, 'Expected state identifier').value;
    if (!idToken.startsWith('S') || parseInt(idToken.substring(1)) !== expectedId) {
      throw this.error(`Expected state S${expectedId}, got ${idToken}`);
    }
    
    this.consume(TokenType.LPAREN, 'Expected "("');
    
    let label = null;
    let tool = null;
    let format = null;
    
    // Check for exec: or format: or just a label
    if (this.check(TokenType.IDENTIFIER)) {
      const firstId = this.peek().value;
      if (firstId === 'exec') {
        this.advance(); // consume 'exec'
        this.consume(TokenType.COLON, 'Expected ":"');
        // Parse tool reference: tools.tool_name
        // Accept either TOOLS keyword or "tools" identifier
        if (this.check(TokenType.TOOLS)) {
          this.advance();
        } else {
          this.consume(TokenType.IDENTIFIER, 'Expected "tools"');
        }
        this.consume(TokenType.DOT, 'Expected "."');
        tool = this.consume(TokenType.IDENTIFIER, 'Expected tool name').value;
      } else if (firstId === 'format') {
        this.advance(); // consume 'format'
        this.consume(TokenType.COLON, 'Expected ":"');
        format = this.consume(TokenType.IDENTIFIER, 'Expected schema name').value;
      } else {
        // Just a label
        label = this.advance().value;
      }
    }
    
    this.consume(TokenType.RPAREN, 'Expected ")"');
    
    return new StateNode(expectedId, label, tool, format, location);
  }

  /**
   * Parse tools block
   */
  parseToolsBlock() {
    const location = this.previous().location;
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    const tools = [];
    while (!this.check(TokenType.RBRACE)) {
      tools.push(this.parseTool());
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    return new ToolsNode(tools, location);
  }

  /**
   * Parse tool definition
   */
  parseTool() {
    const location = this.consume(TokenType.TOOL, 'Expected "tool"').location;
    const name = this.consume(TokenType.IDENTIFIER, 'Expected tool name').value;
    
    // Parse parameters
    this.consume(TokenType.LPAREN, 'Expected "("');
    const parameters = [];
    
    if (!this.check(TokenType.RPAREN)) {
      do {
        const paramLocation = this.peek().location;
        const paramName = this.consume(TokenType.IDENTIFIER, 'Expected parameter name').value;
        this.consume(TokenType.COLON, 'Expected ":"');
        const paramType = this.parseType();
        parameters.push(new ParameterNode(paramName, paramType, paramLocation));
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RPAREN, 'Expected ")"');
    this.consume(TokenType.ARROW, 'Expected "->"');
    
    // Parse return type
    const returnType = this.parseType();
    
    // Parse properties block
    this.consume(TokenType.LBRACE, 'Expected "{"');
    const properties = {};
    
    while (!this.check(TokenType.RBRACE)) {
      const propName = this.consume(TokenType.IDENTIFIER, 'Expected property name').value;
      this.consume(TokenType.COLON, 'Expected ":"');
      properties[propName] = this.parsePointer();
      this.consume(TokenType.COMMA, 'Expected ","');
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    
    return new ToolNode(name, parameters, returnType, properties, location);
  }

  /**
   * Helper methods
   */
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw this.error(message);
  }

  error(message) {
    const token = this.peek();
    return new SyntaxError(
      message,
      token.location,
      `Got ${token.type}`
    );
  }
}
