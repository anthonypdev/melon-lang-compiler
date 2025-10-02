import crypto from 'crypto';

/**
 * Code generator for Melon
 * Generates optimized .cmp files from resolved AST
 */
export class CodeGenerator {
  constructor(ast, options = {}) {
    this.ast = ast;
    this.options = {
      optimizationLevel: 3,
      checksum: false,
      ...options
    };
  }

  /**
   * Generate .cmp output
   */
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

    // Join with section delimiter §
    return sections.join('§');
  }

  /**
   * Generate header section
   * Format: HDR|v:version^m:mode^c:checksum
   */
  generateHeader() {
    const parts = [
      `v:${this.compressVersion(this.ast.prompt.version)}`,
      `m:${this.compressMode(this.ast.prompt.mode)}`
    ];

    // Add checksum if enabled
    if (this.options.checksum || this.ast.prompt.blocks.meta?.directives?.checksum) {
      const checksum = this.calculateChecksum();
      parts.push(`c:${checksum.substring(0, 8)}`);
    }

    return `HDR|${parts.join('^')}`;
  }

  /**
   * Generate persona section
   * Format: PER|AX:axiom^T:trait1=val1,trait2=val2^EX:+trait(if|then)
   */
  generatePersona() {
    const parts = [];

    // Axiom
    if (this.ast.prompt.blocks.persona.axiom) {
      const axiom = this.ast.prompt.blocks.persona.axiom;
      // Extract value robustly from resolved pointer
      let axiomText;
      if (typeof axiom === 'string') {
        axiomText = axiom;
      } else if (axiom && typeof axiom === 'object') {
        axiomText = axiom.value || axiom.text || JSON.stringify(axiom);
      } else {
        axiomText = String(axiom);
      }
      parts.push(`AX:${axiomText}`);
    }

    // Traits
    if (this.ast.prompt.blocks.persona.traits && Object.keys(this.ast.prompt.blocks.persona.traits).length > 0) {
      const traitParts = Object.entries(this.ast.prompt.blocks.persona.traits)
        .map(([name, value]) => {
          const compressed = this.compressTraitName(name);
          const quantized = this.quantizeValue(value);
          return `${compressed}=${quantized}`;
        });
      parts.push(`T:${traitParts.join(',')}`);
    }

    // Examples
    if (this.ast.prompt.blocks.persona.examples && this.ast.prompt.blocks.persona.examples.length > 0) {
      for (const example of this.ast.prompt.blocks.persona.examples) {
        const polarity = example.polarity === 'positive' ? '+' : '-';
        const trait = this.compressTraitName(example.trait);
        const ifText = (typeof example.if === 'object' && example.if.value) ? example.if.value : String(example.if);
        const thenText = (typeof example.then === 'object' && example.then.value) ? example.then.value : String(example.then);
        parts.push(`EX:${polarity}${trait}(${ifText}|${thenText})`);
      }
    }

    return `PER|${parts.join('^')}`;
  }

  /**
   * Generate proc section
   * Format: PRC|S0>S1(label)>S2(exec:tool)>S3(format:Schema)
   */
  generateProc() {
    const states = this.ast.prompt.blocks.proc.states
      .map(state => this.compressState(state))
      .join('>');

    return `PRC|${states}`;
  }

  /**
   * Generate tools section
   * Format: TLS|tool1(p1:t1,p2:t2)>rt{purpose:...}^tool2(...)
   */
  generateTools() {
    const tools = this.ast.prompt.blocks.tools.tools
      .map(tool => this.compressTool(tool))
      .join('^');

    return `TLS|${tools}`;
  }

  /**
   * Generate schemas section
   * Format: SCH|Sch1{f1:t1^f2:t2}^Sch2{...}
   */
  generateSchemas() {
    const schemas = this.ast.prompt.blocks.schemas
      .map(schema => this.compressSchema(schema))
      .join('^');

    return `SCH|${schemas}`;
  }

  /**
   * Compress version string
   */
  compressVersion(version) {
    // Remove 'v' prefix if present
    return version.replace(/^v/, '');
  }

  /**
   * Compress mode string
   */
  compressMode(mode) {
    const modeMap = {
      'strict': 'st',
      'permissive': 'pm',
      'debug': 'db'
    };
    return modeMap[mode] || mode.substring(0, 2);
  }

  /**
   * Compress trait name to 2-character abbreviation
   */
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
      'proactivity': 'pa',
      'helpfulness': 'he',
      'patience': 'pt',
      'accuracy': 'ac',
      'detail_oriented': 'do',
      'analytical': 'an'
    };
    return map[name] || name.substring(0, 2).toLowerCase();
  }

  /**
   * Quantize float value (0.0-1.0) to integer (0-10)
   */
  quantizeValue(floatValue) {
    return Math.round(floatValue * 10);
  }

  /**
   * Compress state definition
   */
  compressState(state) {
    let compressed = `S${state.id}`;

    if (state.label) {
      compressed += `(${state.label})`;
    } else if (state.tool) {
      compressed += `(exec:${state.tool})`;
    } else if (state.format) {
      compressed += `(format:${state.format})`;
    }

    return compressed;
  }

  /**
   * Compress tool definition
   */
  compressTool(tool) {
    // Parameters
    const params = tool.parameters
      .map(p => `${p.name}:${this.compressType(p.paramType)}`)
      .join(',');

    // Return type
    const returnType = this.compressType(tool.returnType);

    // Properties (resolved pointers)
    const props = Object.entries(tool.properties)
      .map(([key, pointer]) => {
        const value = (pointer.type === 'ResolvedPointer') ? pointer.value : pointer;
        return `${key}:${value}`;
      })
      .join('|');

    return `${tool.name}(${params})>${returnType}{${props}}`;
  }

  /**
   * Compress schema definition
   */
  compressSchema(schema) {
    const fields = schema.fields
      .map(f => `${f.name}:${this.compressType(f.fieldType)}`)
      .join('^');

    return `${schema.name}{${fields}}`;
  }

  /**
   * Compress type annotation
   */
  compressType(type) {
    const primitiveMap = {
      'string': 's',
      'int': 'i',
      'float': 'f',
      'bool': 'b',
      'json': 'j'
    };

    if (type.kind === 'primitive') {
      return primitiveMap[type.name] || type.name;
    }

    if (type.kind === 'array') {
      return `a(${this.compressType(type.elementType)})`;
    }

    if (type.kind === 'enum') {
      return `e(${type.values.join(',')})`;
    }

    if (type.kind === 'schema-ref') {
      return type.name;
    }

    return 'u'; // unknown
  }

  /**
   * Calculate SHA-256 checksum of the compiled content
   */
  calculateChecksum() {
    // Temporarily disable checksum to avoid infinite recursion
    const wasChecksum = this.options.checksum;
    this.options.checksum = false;
    
    const content = this.generate();
    
    // Restore original setting
    this.options.checksum = wasChecksum;

    // Calculate hash
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Get compilation statistics
   */
  getStats() {
    const output = this.generate();
    
    return {
      outputLength: output.length,
      outputTokens: this.estimateTokens(output),
      sections: {
        header: this.generateHeader().length,
        persona: this.ast.prompt.blocks.persona ? this.generatePersona().length : 0,
        proc: this.ast.prompt.blocks.proc ? this.generateProc().length : 0,
        tools: this.ast.prompt.blocks.tools ? this.generateTools().length : 0,
        schemas: this.ast.prompt.blocks.schemas.length > 0 ? this.generateSchemas().length : 0
      }
    };
  }

  /**
   * Estimate token count (rough approximation)
   */
  estimateTokens(text) {
    // Rough estimate: 1 token per 4 characters on average
    return Math.ceil(text.length / 4);
  }
}
