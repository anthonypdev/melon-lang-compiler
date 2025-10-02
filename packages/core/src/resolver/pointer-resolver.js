import fs from 'fs/promises';
import path from 'path';
import { PointerError } from '../errors/error-types.js';
import { ResolvedPointerNode } from '../parser/ast.js';

/**
 * Pointer resolver - resolves pointers to ontology content
 * Traverses AST and replaces Pointer nodes with actual content
 */
export class PointerResolver {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.ontologies = new Map();
  }

  /**
   * Resolve all pointers in the AST
   */
  async resolve(ast) {
    // Load all imported ontology files
    for (const importNode of ast.imports) {
      try {
        const fullPath = path.resolve(this.baseDir, importNode.path);
        const content = await fs.readFile(fullPath, 'utf-8');
        const ontology = JSON.parse(content);
        this.ontologies.set(importNode.name, ontology);
      } catch (error) {
        throw new PointerError(
          `Failed to load ontology file: ${importNode.path}`,
          importNode.location,
          error.message
        );
      }
    }

    // Resolve pointers in specific known locations
    const prompt = ast.prompt;

    // Resolve persona pointers
    if (prompt.blocks.persona) {
      if (prompt.blocks.persona.axiom && prompt.blocks.persona.axiom.type === 'Pointer') {
        prompt.blocks.persona.axiom = this.resolvePointer(prompt.blocks.persona.axiom);
      }

      // Resolve example pointers
      if (prompt.blocks.persona.examples) {
        for (const example of prompt.blocks.persona.examples) {
          if (example.if && example.if.type === 'Pointer') {
            example.if = this.resolvePointer(example.if);
          }
          if (example.then && example.then.type === 'Pointer') {
            example.then = this.resolvePointer(example.then);
          }
        }
      }
    }

    // Resolve tool property pointers
    if (prompt.blocks.tools) {
      for (const tool of prompt.blocks.tools.tools) {
        for (const propKey in tool.properties) {
          if (tool.properties[propKey] && tool.properties[propKey].type === 'Pointer') {
            tool.properties[propKey] = this.resolvePointer(tool.properties[propKey]);
          }
        }
      }
    }

    return ast;
  }

  /**
   * Resolve a single pointer
   */
  resolvePointer(pointerNode) {
    const parts = pointerNode.path.split('.');
    const ontologyName = parts[0];
    const pathParts = parts.slice(1);

    // Check if ontology exists
    if (!this.ontologies.has(ontologyName)) {
      throw new PointerError(
        `Unknown ontology: ${ontologyName}`,
        pointerNode.location,
        `Ontology '${ontologyName}' was not imported. Check your import statements.`
      );
    }

    // Navigate through the JSON path
    let value = this.ontologies.get(ontologyName);
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (!(part in value)) {
        const currentPath = [ontologyName, ...pathParts.slice(0, i + 1)].join('.');
        throw new PointerError(
          `Path not found: ${currentPath}`,
          pointerNode.location,
          this.suggestAlternatives(value, part, [ontologyName, ...pathParts.slice(0, i)].join('.'))
        );
      }
      value = value[part];
    }

    // Validate that the pointer references a string
    if (typeof value !== 'string') {
      throw new PointerError(
        `Pointer must reference a string value: ${pointerNode.path}`,
        pointerNode.location,
        `Found ${typeof value} instead. Pointers can only reference string values in the ontology.`
      );
    }

    return new ResolvedPointerNode(value, pointerNode.path, pointerNode.location);
  }

  /**
   * Suggest alternative paths when a pointer path is not found
   */
  suggestAlternatives(obj, searchKey, currentPath) {
    const keys = Object.keys(obj);
    const suggestions = keys
      .filter(key => this.levenshteinDistance(key.toLowerCase(), searchKey.toLowerCase()) <= 2)
      .slice(0, 3);

    if (suggestions.length > 0) {
      return `Did you mean one of these?\n${suggestions.map(s => `  - ${currentPath}.${s}`).join('\n')}`;
    }

    return `Available keys at ${currentPath}: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? ', ...' : ''}`;
  }

  /**
   * Calculate Levenshtein distance for typo suggestions
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}
