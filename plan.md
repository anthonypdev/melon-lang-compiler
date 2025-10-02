# **Melon Language Compiler - Technical Implementation Plan**

**Actionable Technical Specification for AI Implementation**

---

## **Overview**

This plan provides concrete technical specifications for building the Melon language ecosystem. Each component is designed to be built independently with clear dependencies, file structures, and implementation details.

---

## **Component 1: Core Compiler Library (@melon-lang/core)**

### **Purpose**
Shared compiler core used by all other components. This must be built first as everything else depends on it.

### **Project Structure**
```
packages/core/
├── src/
│   ├── lexer/
│   │   ├── index.js
│   │   ├── tokens.js
│   │   └── lexer.js
│   ├── parser/
│   │   ├── index.js
│   │   ├── parser.js
│   │   └── ast.js
│   ├── analyzer/
│   │   ├── index.js
│   │   ├── type-checker.js
│   │   ├── semantic-analyzer.js
│   │   └── validator.js
│   ├── resolver/
│   │   ├── index.js
│   │   ├── pointer-resolver.js
│   │   └── import-resolver.js
│   ├── optimizer/
│   │   ├── index.js
│   │   └── optimizer.js
│   ├── codegen/
│   │   ├── index.js
│   │   ├── generator.js
│   │   └── compressor.js
│   ├── errors/
│   │   ├── index.js
│   │   └── error-types.js
│   └── index.js
├── tests/
│   ├── lexer.test.js
│   ├── parser.test.js
│   ├── analyzer.test.js
│   ├── resolver.test.js
│   └── codegen.test.js
└── package.json
```

### **Implementation Details**

**tokens.js** - Define all token types:
```javascript
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
```

**lexer.js** - Tokenization:
```javascript
export class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }
  
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
      if (this.isDigit(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }
      
      // Identifiers and keywords
      if (this.isAlpha(char) || char === '_') {
        this.tokens.push(this.readIdentifier());
        continue;
      }
      
      // Operators
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
      
      throw this.error(`Unexpected character: ${char}`);
    }
    
    this.tokens.push(this.makeToken(TokenType.EOF, ''));
    return this.tokens;
  }
  
  // Helper methods...
}
```

**ast.js** - AST node definitions:
```javascript
export class ASTNode {
  constructor(type, location) {
    this.type = type;
    this.location = location;
  }
}

export class PromptNode extends ASTNode {
  constructor(name, version, mode, blocks, location) {
    super('Prompt', location);
    this.name = name;
    this.version = version;
    this.mode = mode;
    this.blocks = blocks; // meta, schemas, persona, proc, tools
  }
}

export class SchemaNode extends ASTNode {
  constructor(name, fields, location) {
    super('Schema', location);
    this.name = name;
    this.fields = fields;
  }
}

export class PersonaNode extends ASTNode {
  constructor(axiom, traits, examples, location) {
    super('Persona', location);
    this.axiom = axiom;
    this.traits = traits;
    this.examples = examples;
  }
}

// ... more node types
```

**parser.js** - Recursive descent parser:
```javascript
export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }
  
  parse() {
    const imports = this.parseImports();
    const prompt = this.parsePrompt();
    return new ProgramNode(imports, prompt);
  }
  
  parseImports() {
    const imports = [];
    while (this.match(TokenType.IMPORT)) {
      imports.push(this.parseImport());
    }
    return imports;
  }
  
  parseImport() {
    this.consume(TokenType.IDENTIFIER, 'Expected import name');
    const name = this.previous().value;
    this.consume(TokenType.FROM, 'Expected "from"');
    this.consume(TokenType.STRING_LITERAL, 'Expected path string');
    const path = this.previous().value;
    return new ImportNode(name, path);
  }
  
  parsePrompt() {
    this.consume(TokenType.PROMPT, 'Expected "prompt"');
    this.consume(TokenType.STRING_LITERAL, 'Expected prompt header');
    const header = this.parsePromptHeader(this.previous().value);
    
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
    
    return new PromptNode(
      header.name,
      header.version,
      header.mode,
      blocks,
      this.previous().location
    );
  }
  
  parseSchemaBlock() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected schema name').value;
    this.consume(TokenType.LBRACE, 'Expected "{"');
    
    const fields = [];
    while (!this.check(TokenType.RBRACE)) {
      const fieldName = this.consume(TokenType.IDENTIFIER, 'Expected field name').value;
      this.consume(TokenType.COLON, 'Expected ":"');
      const fieldType = this.parseType();
      this.consume(TokenType.COMMA, 'Expected ","');
      
      fields.push(new FieldNode(fieldName, fieldType));
    }
    
    this.consume(TokenType.RBRACE, 'Expected "}"');
    return new SchemaNode(name, fields);
  }
  
  parseType() {
    if (this.match(TokenType.STRING)) return new TypeNode('string');
    if (this.match(TokenType.INT)) return new TypeNode('int');
    if (this.match(TokenType.FLOAT)) return new TypeNode('float');
    if (this.match(TokenType.BOOL)) return new TypeNode('bool');
    if (this.match(TokenType.JSON)) return new TypeNode('json');
    
    if (this.match(TokenType.ARRAY)) {
      this.consume(TokenType.LPAREN, 'Expected "("');
      const elementType = this.parseType();
      this.consume(TokenType.RPAREN, 'Expected ")"');
      return new ArrayTypeNode(elementType);
    }
    
    if (this.match(TokenType.ENUM)) {
      this.consume(TokenType.LPAREN, 'Expected "("');
      const values = [];
      do {
        values.push(this.consume(TokenType.IDENTIFIER, 'Expected enum value').value);
      } while (this.match(TokenType.COMMA));
      this.consume(TokenType.RPAREN, 'Expected ")"');
      return new EnumTypeNode(values);
    }
    
    // Schema reference
    if (this.check(TokenType.IDENTIFIER)) {
      return new SchemaRefNode(this.advance().value);
    }
    
    throw this.error('Expected type');
  }
  
  // More parsing methods...
}
```

**type-checker.js** - Type validation:
```javascript
export class TypeChecker {
  constructor(ast) {
    this.ast = ast;
    this.schemas = new Map();
    this.errors = [];
  }
  
  check() {
    // Collect all schema definitions
    for (const schema of this.ast.prompt.blocks.schemas) {
      this.schemas.set(schema.name, schema);
    }
    
    // Validate schema field types
    for (const schema of this.schemas.values()) {
      this.validateSchema(schema);
    }
    
    // Validate proc format references
    if (this.ast.prompt.blocks.proc) {
      this.validateProc(this.ast.prompt.blocks.proc);
    }
    
    // Validate tool signatures
    if (this.ast.prompt.blocks.tools) {
      this.validateTools(this.ast.prompt.blocks.tools);
    }
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors
    };
  }
  
  validateSchema(schema) {
    for (const field of schema.fields) {
      if (!this.isValidType(field.type)) {
        this.errors.push({
          type: 'TypeError',
          message: `Invalid type for field "${field.name}"`,
          location: field.location
        });
      }
    }
  }
  
  isValidType(type) {
    if (type.kind === 'primitive') return true;
    if (type.kind === 'array') return this.isValidType(type.elementType);
    if (type.kind === 'enum') return type.values.length > 0;
    if (type.kind === 'schema-ref') return this.schemas.has(type.name);
    return false;
  }
  
  // More validation methods...
}
```

**pointer-resolver.js** - Resolve pointers to ontology content:
```javascript
import fs from 'fs/promises';
import path from 'path';

export class PointerResolver {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.ontologies = new Map();
  }
  
  async resolve(ast) {
    // Load all imported ontology files
    for (const importNode of ast.imports) {
      const fullPath = path.resolve(this.baseDir, importNode.path);
      const content = await fs.readFile(fullPath, 'utf-8');
      const ontology = JSON.parse(content);
      this.ontologies.set(importNode.name, ontology);
    }
    
    // Traverse AST and resolve all pointers
    return this.traverseAndResolve(ast);
  }
  
  traverseAndResolve(node) {
    if (node.type === 'Pointer') {
      return this.resolvePointer(node);
    }
    
    // Recursively traverse all properties
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        if (Array.isArray(node[key])) {
          node[key] = node[key].map(item => this.traverseAndResolve(item));
        } else {
          node[key] = this.traverseAndResolve(node[key]);
        }
      }
    }
    
    return node;
  }
  
  resolvePointer(pointerNode) {
    const parts = pointerNode.path.split('.');
    const ontologyName = parts[0];
    const pathParts = parts.slice(1);
    
    if (!this.ontologies.has(ontologyName)) {
      throw new Error(`Unknown ontology: ${ontologyName}`);
    }
    
    let value = this.ontologies.get(ontologyName);
    for (const part of pathParts) {
      if (!(part in value)) {
        throw new Error(`Path not found: ${pointerNode.path}`);
      }
      value = value[part];
    }
    
    if (typeof value !== 'string') {
      throw new Error(`Pointer must reference a string value: ${pointerNode.path}`);
    }
    
    return new ResolvedPointerNode(value, pointerNode.path);
  }
}
```

**generator.js** - Generate .cmp output:
```javascript
export class CodeGenerator {
  constructor(ast, options = {}) {
    this.ast = ast;
    this.options = {
      optimizationLevel: 3,
      ...options
    };
  }
  
  generate() {
    const sections = [];
    
    // Generate header
    sections.push(this.generateHeader());
    
    // Generate persona
    if (this.ast.prompt.blocks.persona) {
      sections.push(this.generatePersona());
    }
    
    // Generate proc
    if (this.ast.prompt.blocks.proc) {
      sections.push(this.generateProc());
    }
    
    // Generate tools
    if (this.ast.prompt.blocks.tools) {
      sections.push(this.generateTools());
    }
    
    // Generate schemas
    if (this.ast.prompt.blocks.schemas.length > 0) {
      sections.push(this.generateSchemas());
    }
    
    // Join with section delimiter
    return sections.join('§');
  }
  
  generateHeader() {
    const parts = [
      `v:${this.compressVersion(this.ast.prompt.version)}`,
      `m:${this.compressMode(this.ast.prompt.mode)}`
    ];
    
    if (this.options.checksum) {
      const checksum = this.calculateChecksum();
      parts.push(`c:${checksum.substring(0, 8)}`);
    }
    
    return `HDR|${parts.join('^')}`;
  }
  
  generatePersona() {
    const parts = [];
    
    // Axiom
    if (this.ast.prompt.blocks.persona.axiom) {
      parts.push(`AX:${this.ast.prompt.blocks.persona.axiom.value}`);
    }
    
    // Traits
    if (this.ast.prompt.blocks.persona.traits) {
      const traitParts = Object.entries(this.ast.prompt.blocks.persona.traits)
        .map(([name, value]) => {
          const compressed = this.compressTraitName(name);
          const quantized = this.quantizeValue(value);
          return `${compressed}=${quantized}`;
        });
      parts.push(`T:${traitParts.join(',')}`);
    }
    
    // Examples
    for (const example of this.ast.prompt.blocks.persona.examples || []) {
      const polarity = example.polarity === 'positive' ? '+' : '-';
      const trait = this.compressTraitName(example.trait);
      parts.push(`EX:${polarity}${trait}(${example.if.value}|${example.then.value})`);
    }
    
    return `PER|${parts.join('^')}`;
  }
  
  generateProc() {
    const states = this.ast.prompt.blocks.proc.states
      .map(state => this.compressState(state))
      .join('>');
    
    return `PRC|${states}`;
  }
  
  generateTools() {
    const tools = this.ast.prompt.blocks.tools.tools
      .map(tool => this.compressTool(tool))
      .join('^');
    
    return `TLS|${tools}`;
  }
  
  generateSchemas() {
    const schemas = this.ast.prompt.blocks.schemas
      .map(schema => this.compressSchema(schema))
      .join('^');
    
    return `SCH|${schemas}`;
  }
  
  compressTraitName(name) {
    const map = {
      'verbosity': 've',
      'professionalism': 'pr',
      'formality': 'fo',
      'creativity': 'cr',
      'empathy': 'em',
      'technical_depth': 'td',
      'cautiousness': 'ca',
      'thoroughness': 'th',
      'proactivity': 'pa'
    };
    return map[name] || name.substring(0, 2);
  }
  
  quantizeValue(floatValue) {
    return Math.round(floatValue * 10);
  }
  
  compressState(state) {
    let compressed = `S${state.id}`;
    if (state.label) compressed += `(${state.label})`;
    if (state.tool) compressed += `(exec:${state.tool})`;
    if (state.format) compressed += `(format:${state.format})`;
    return compressed;
  }
  
  compressSchema(schema) {
    const fields = schema.fields
      .map(f => `${f.name.substring(0, 2)}:${this.compressType(f.type)}`)
      .join('^');
    return `${schema.name.substring(0, 2)}{${fields}}`;
  }
  
  compressType(type) {
    const map = {
      'string': 's',
      'int': 'i',
      'float': 'f',
      'bool': 'b',
      'json': 'j'
    };
    if (type.kind === 'primitive') return map[type.name];
    if (type.kind === 'array') return `a(${this.compressType(type.elementType)})`;
    if (type.kind === 'schema-ref') return type.name.substring(0, 2);
    return 'u'; // unknown
  }
}
```

### **Testing**

**lexer.test.js**:
```javascript
import { Lexer, TokenType } from '../src/lexer/index.js';

describe('Lexer', () => {
  test('tokenizes keywords', () => {
    const source = 'import prompt schema persona';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.IMPORT);
    expect(tokens[1].type).toBe(TokenType.PROMPT);
    expect(tokens[2].type).toBe(TokenType.SCHEMA);
    expect(tokens[3].type).toBe(TokenType.PERSONA);
  });
  
  test('tokenizes string literals', () => {
    const source = '"hello world"';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
    expect(tokens[0].value).toBe('hello world');
  });
  
  test('tokenizes operators', () => {
    const source = '-> | ^ : ,';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.ARROW);
    expect(tokens[1].type).toBe(TokenType.PIPE);
    expect(tokens[2].type).toBe(TokenType.CARET);
  });
});
```

---

## **Component 2: CLI Compiler (melonc)**

### **Project Structure**
```
packages/melonc/
├── bin/
│   └── melonc.js
├── src/
│   ├── cli.js
│   ├── commands/
│   │   ├── build.js
│   │   ├── validate.js
│   │   ├── init.js
│   │   └── watch.js
│   └── utils/
│       ├── logger.js
│       └── config.js
├── templates/
│   ├── basic/
│   │   ├── agent.mln
│   │   └── ontology.json
│   └── advanced/
│       ├── agent.mln
│       └── ontology.json
└── package.json
```

### **Implementation**

**bin/melonc.js**:
```javascript
#!/usr/bin/env node
import { program } from 'commander';
import { buildCommand } from '../src/commands/build.js';
import { validateCommand } from '../src/commands/validate.js';
import { initCommand } from '../src/commands/init.js';

program
  .name('melonc')
  .description('Melon language compiler')
  .version('1.0.0');

program
  .command('build <file>')
  .description('Compile .mln file to .cmp')
  .option('-o, --output <file>', 'Output file')
  .option('-O, --optimize <level>', 'Optimization level (1-3)', '3')
  .option('--no-validate', 'Skip validation')
  .action(buildCommand);

program
  .command('validate <file>')
  .description('Validate .mln file without compiling')
  .action(validateCommand);

program
  .command('init [directory]')
  .description('Initialize new Melon project')
  .option('-t, --template <name>', 'Template to use', 'basic')
  .action(initCommand);

// Shorthand: melonc file.mln
program
  .argument('[file]', '.mln file to compile')
  .action((file) => {
    if (file) buildCommand(file, {});
  });

program.parse();
```

**src/commands/build.js**:
```javascript
import fs from 'fs/promises';
import path from 'path';
import { Lexer } from '@melon-lang/core/lexer';
import { Parser } from '@melon-lang/core/parser';
import { TypeChecker } from '@melon-lang/core/analyzer';
import { PointerResolver } from '@melon-lang/core/resolver';
import { CodeGenerator } from '@melon-lang/core/codegen';
import { logger } from '../utils/logger.js';
import ora from 'ora';

export async function buildCommand(file, options) {
  const spinner = ora();
  const startTime = Date.now();
  
  try {
    // Read source file
    const source = await fs.readFile(file, 'utf-8');
    const baseDir = path.dirname(file);
    
    // Lexical analysis
    spinner.start('Lexical analysis');
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    spinner.succeed(`Lexical analysis complete`);
    
    // Parsing
    spinner.start('Parsing');
    const parser = new Parser(tokens);
    const ast = parser.parse();
    spinner.succeed('Parsing complete');
    
    // Type checking & validation
    if (options.validate !== false) {
      spinner.start('Static analysis');
      const checker = new TypeChecker(ast);
      const result = checker.check();
      
      if (!result.valid) {
        spinner.fail('Static analysis failed');
        for (const error of result.errors) {
          logger.error(error.message, error.location);
        }
        process.exit(1);
      }
      spinner.succeed('Static analysis complete');
    }
    
    // Pointer resolution
    spinner.start('Pointer resolution');
    const resolver = new PointerResolver(baseDir);
    const resolvedAst = await resolver.resolve(ast);
    spinner.succeed('Pointer resolution complete');
    
    // Code generation
    spinner.start('Code generation');
    const generator = new CodeGenerator(resolvedAst, {
      optimizationLevel: parseInt(options.optimize || 3)
    });
    const cmpOutput = generator.generate();
    spinner.succeed('Code generation complete');
    
    // Write output
    const outputPath = options.output || file.replace('.mln', '.cmp');
    await fs.writeFile(outputPath, cmpOutput, 'utf-8');
    
    const elapsed = Date.now() - startTime;
    
    logger.success(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Compiled: ${outputPath}
  Build time: ${elapsed}ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
  } catch (error) {
    spinner.fail('Compilation failed');
    logger.error(error.message);
    if (error.location) {
      logger.errorWithLocation(error);
    }
    process.exit(1);
  }
}
```

**src/utils/logger.js**:
```javascript
import chalk from 'chalk';

export const logger = {
  error(message, location) {
    console.error(chalk.red('✗'), message);
    if (location) {
      console.error(chalk.gray(`  → ${location.file}:${location.line}:${location.column}`));
    }
  },
  
  success(message) {
    console.log(chalk.green('✓'), message);
  },
  
  info(message) {
    console.log(chalk.blue('ℹ'), message);
  },
  
  errorWithLocation(error) {
    console.error(chalk.red(`\nError ${error.code}: ${error.message}`));
    console.error(chalk.gray(`  → ${error.location.file}:${error.location.line}:${error.location.column}\n`));
    
    if (error.hint) {
      console.error(chalk.yellow(`Hint: ${error.hint}\n`));
    }
  }
};
```

---

## **Component 3: Language Server**

### **Project Structure**
```
packages/language-server/
├── src/
│   ├── server.ts
│   ├── capabilities/
│   │   ├── completion.ts
│   │   ├── hover.ts
│   │   ├── diagnostics.ts
│   │   └── definition.ts
│   └── utils/
│       └── ast-utils.ts
├── client/
│   └── vscode/
│       ├── src/
│       │   ├── extension.ts
│       │   └── client.ts
│       ├── syntaxes/
│       │   └── melon.tmLanguage.json
│       └── package.json
└── package.json
```

### **Implementation**

**server.ts**:
```typescript
import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  TextDocumentSyncKind
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { provideDiagnostics } from './capabilities/diagnostics.js';
import { provideCompletion } from './capabilities/completion.js';
import { provideHover } from './capabilities/hover.js';
import { provideDefinition } from './capabilities/definition.js';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', ':']
      },
      hoverProvider: true,
      definitionProvider: true,
      diagnosticProvider: {
        interFileDependencies: true,
        workspaceDiagnostics: false
      }
    }
