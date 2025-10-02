/**
 * Abstract Syntax Tree node definitions for Melon
 */

/**
 * Base AST Node class
 */
export class ASTNode {
  constructor(type, location) {
    this.type = type;
    this.location = location;
  }
}

/**
 * Program node - root of AST
 */
export class ProgramNode extends ASTNode {
  constructor(imports, prompt, location) {
    super('Program', location);
    this.imports = imports;
    this.prompt = prompt;
  }
}

/**
 * Import statement node
 */
export class ImportNode extends ASTNode {
  constructor(name, path, location) {
    super('Import', location);
    this.name = name;
    this.path = path;
  }
}

/**
 * Prompt declaration node
 */
export class PromptNode extends ASTNode {
  constructor(name, version, mode, blocks, location) {
    super('Prompt', location);
    this.name = name;
    this.version = version;
    this.mode = mode;
    this.blocks = blocks; // { meta, schemas, persona, proc, tools }
  }
}

/**
 * Meta block node
 */
export class MetaNode extends ASTNode {
  constructor(directives, location) {
    super('Meta', location);
    this.directives = directives; // { checksum, confidence_token, etc }
  }
}

/**
 * Schema definition node
 */
export class SchemaNode extends ASTNode {
  constructor(name, fields, location) {
    super('Schema', location);
    this.name = name;
    this.fields = fields;
  }
}

/**
 * Schema field node
 */
export class FieldNode extends ASTNode {
  constructor(name, fieldType, location) {
    super('Field', location);
    this.name = name;
    this.fieldType = fieldType;
  }
}

/**
 * Type node
 */
export class TypeNode extends ASTNode {
  constructor(typeName, location) {
    super('Type', location);
    this.kind = 'primitive';
    this.name = typeName;
  }
}

/**
 * Array type node
 */
export class ArrayTypeNode extends ASTNode {
  constructor(elementType, location) {
    super('ArrayType', location);
    this.kind = 'array';
    this.elementType = elementType;
  }
}

/**
 * Enum type node
 */
export class EnumTypeNode extends ASTNode {
  constructor(values, location) {
    super('EnumType', location);
    this.kind = 'enum';
    this.values = values;
  }
}

/**
 * Schema reference type node
 */
export class SchemaRefNode extends ASTNode {
  constructor(schemaName, location) {
    super('SchemaRef', location);
    this.kind = 'schema-ref';
    this.name = schemaName;
  }
}

/**
 * Persona block node
 */
export class PersonaNode extends ASTNode {
  constructor(axiom, traits, examples, location) {
    super('Persona', location);
    this.axiom = axiom;
    this.traits = traits;
    this.examples = examples;
  }
}

/**
 * Trait definition node
 */
export class TraitNode extends ASTNode {
  constructor(name, value, location) {
    super('Trait', location);
    this.name = name;
    this.value = value;
  }
}

/**
 * Example node
 */
export class ExampleNode extends ASTNode {
  constructor(polarity, trait, ifPointer, thenPointer, location) {
    super('Example', location);
    this.polarity = polarity; // 'positive' or 'negative'
    this.trait = trait;
    this.if = ifPointer;
    this.then = thenPointer;
  }
}

/**
 * Pointer node
 */
export class PointerNode extends ASTNode {
  constructor(path, location) {
    super('Pointer', location);
    this.path = path;
  }
}

/**
 * Resolved pointer node (after pointer resolution)
 */
export class ResolvedPointerNode extends ASTNode {
  constructor(value, originalPath, location) {
    super('ResolvedPointer', location);
    this.value = value;
    this.originalPath = originalPath;
  }
}

/**
 * Proc block node
 */
export class ProcNode extends ASTNode {
  constructor(states, location) {
    super('Proc', location);
    this.states = states;
  }
}

/**
 * State node
 */
export class StateNode extends ASTNode {
  constructor(id, label, tool, format, location) {
    super('State', location);
    this.id = id;
    this.label = label;
    this.tool = tool; // For exec states
    this.format = format; // For format states
  }
}

/**
 * Tools block node
 */
export class ToolsNode extends ASTNode {
  constructor(tools, location) {
    super('Tools', location);
    this.tools = tools;
  }
}

/**
 * Tool definition node
 */
export class ToolNode extends ASTNode {
  constructor(name, parameters, returnType, properties, location) {
    super('Tool', location);
    this.name = name;
    this.parameters = parameters;
    this.returnType = returnType;
    this.properties = properties; // purpose, behavior, etc (pointers)
  }
}

/**
 * Parameter node
 */
export class ParameterNode extends ASTNode {
  constructor(name, paramType, location) {
    super('Parameter', location);
    this.name = name;
    this.paramType = paramType;
  }
}
