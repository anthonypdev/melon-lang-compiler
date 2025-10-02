import { TypeError, ValidationError } from '../errors/error-types.js';

/**
 * Type checker for Melon AST
 * Validates type consistency and schema definitions
 */
export class TypeChecker {
  constructor(ast) {
    this.ast = ast;
    this.schemas = new Map();
    this.tools = new Map();
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Perform type checking on the AST
   */
  check() {
    // Collect all schema definitions
    for (const schema of this.ast.prompt.blocks.schemas) {
      if (this.schemas.has(schema.name)) {
        this.errors.push(new TypeError(
          `Duplicate schema definition: ${schema.name}`,
          schema.location,
          'Each schema must have a unique name'
        ));
      }
      this.schemas.set(schema.name, schema);
    }

    // Collect all tool definitions BEFORE validating proc
    if (this.ast.prompt.blocks.tools) {
      for (const tool of this.ast.prompt.blocks.tools.tools) {
        if (this.tools.has(tool.name)) {
          this.errors.push(new ValidationError(
            `Duplicate tool definition: ${tool.name}`,
            tool.location,
            'Each tool must have a unique name'
          ));
        } else {
          this.tools.set(tool.name, tool);
        }
      }
    }

    // Validate schema field types
    for (const schema of this.schemas.values()) {
      this.validateSchema(schema);
    }

    // Validate proc format references (tools are now collected)
    if (this.ast.prompt.blocks.proc) {
      this.validateProc(this.ast.prompt.blocks.proc);
    }

    // Validate tool signatures
    if (this.ast.prompt.blocks.tools) {
      this.validateTools(this.ast.prompt.blocks.tools);
    }

    // Validate persona traits
    if (this.ast.prompt.blocks.persona) {
      this.validatePersona(this.ast.prompt.blocks.persona);
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Validate schema definition
   */
  validateSchema(schema) {
    const fieldNames = new Set();

    for (const field of schema.fields) {
      // Check for duplicate field names
      if (fieldNames.has(field.name)) {
        this.errors.push(new TypeError(
          `Duplicate field name '${field.name}' in schema '${schema.name}'`,
          field.location,
          'Each field in a schema must have a unique name'
        ));
      }
      fieldNames.add(field.name);

      // Validate field type
      if (!this.isValidType(field.fieldType)) {
        this.errors.push(new TypeError(
          `Invalid type for field '${field.name}' in schema '${schema.name}'`,
          field.location,
          'Type must be a primitive, array, enum, or reference to another schema'
        ));
      }
    }

    // Warn if schema is empty
    if (schema.fields.length === 0) {
      this.warnings.push({
        message: `Schema '${schema.name}' has no fields`,
        location: schema.location
      });
    }
  }

  /**
   * Check if a type is valid
   */
  isValidType(type) {
    if (!type) return false;

    switch (type.kind) {
      case 'primitive':
        return ['string', 'int', 'float', 'bool', 'json'].includes(type.name);
      
      case 'array':
        return this.isValidType(type.elementType);
      
      case 'enum':
        if (type.values.length === 0) {
          return false;
        }
        // Check for duplicate enum values
        const uniqueValues = new Set(type.values);
        return uniqueValues.size === type.values.length;
      
      case 'schema-ref':
        return this.schemas.has(type.name);
      
      default:
        return false;
    }
  }

  /**
   * Validate proc block
   */
  validateProc(proc) {
    const seenStates = new Set();

    for (const state of proc.states) {
      // Check for duplicate state IDs
      if (seenStates.has(state.id)) {
        this.errors.push(new ValidationError(
          `Duplicate state ID: S${state.id}`,
          state.location,
          'Each state must have a unique sequential ID'
        ));
      }
      seenStates.add(state.id);

      // Validate tool references
      if (state.tool) {
        if (!this.tools.has(state.tool)) {
          this.errors.push(new ValidationError(
            `Unknown tool reference: ${state.tool}`,
            state.location,
            `Tool '${state.tool}' must be defined in the tools block`
          ));
        }
      }

      // Validate format references
      if (state.format) {
        if (!this.schemas.has(state.format)) {
          this.errors.push(new ValidationError(
            `Unknown schema reference: ${state.format}`,
            state.location,
            `Schema '${state.format}' must be defined`
          ));
        }
      }
    }

    // Validate that last state has format directive
    const lastState = proc.states[proc.states.length - 1];
    if (!lastState.format) {
      this.errors.push(new ValidationError(
        'Final state must have a format directive',
        lastState.location,
        'The last state in proc must specify an output schema with format: SchemaName'
      ));
    }
  }

  /**
   * Validate tools block
   */
  validateTools(toolsBlock) {
    // Tools are already collected in check(), just validate them
    for (const tool of toolsBlock.tools) {
      // Validate parameter names are unique
      const paramNames = new Set();
      for (const param of tool.parameters) {
        if (paramNames.has(param.name)) {
          this.errors.push(new TypeError(
            `Duplicate parameter name '${param.name}' in tool '${tool.name}'`,
            param.location,
            'Each parameter in a tool must have a unique name'
          ));
        }
        paramNames.add(param.name);

        // Validate parameter type
        if (!this.isValidType(param.paramType)) {
          this.errors.push(new TypeError(
            `Invalid type for parameter '${param.name}' in tool '${tool.name}'`,
            param.location
          ));
        }
      }

      // Validate return type
      if (!this.isValidType(tool.returnType)) {
        this.errors.push(new TypeError(
          `Invalid return type for tool '${tool.name}'`,
          tool.location
        ));
      }

      // Check that tool has at least a purpose property
      if (!tool.properties.purpose) {
        this.warnings.push({
          message: `Tool '${tool.name}' should have a purpose property for documentation`,
          location: tool.location
        });
      }
    }
  }

  /**
   * Validate persona block
   */
  validatePersona(persona) {
    // Validate trait values are between 0.0 and 1.0
    for (const [traitName, traitValue] of Object.entries(persona.traits)) {
      if (typeof traitValue !== 'number' || traitValue < 0.0 || traitValue > 1.0) {
        this.errors.push(new ValidationError(
          `Invalid trait value for '${traitName}': ${traitValue}`,
          persona.location,
          'Trait values must be numbers between 0.0 and 1.0'
        ));
      }
    }

    // Validate examples reference valid traits
    for (const example of persona.examples) {
      if (!persona.traits.hasOwnProperty(example.trait)) {
        this.errors.push(new ValidationError(
          `Example references undefined trait: ${example.trait}`,
          example.location,
          `Trait '${example.trait}' must be defined in the traits block`
        ));
      }
    }

    // Warn if persona has no axiom
    if (!persona.axiom) {
      this.warnings.push({
        message: 'Persona should have an axiom defining core identity',
        location: persona.location
      });
    }
  }
}
