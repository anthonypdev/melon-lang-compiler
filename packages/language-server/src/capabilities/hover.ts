import { Hover, MarkupKind, Position } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

/**
 * Provide hover information
 */
export function provideHover(
  document: TextDocument,
  position: Position
): Hover | null {
  const wordRange = getWordRangeAtPosition(document, position);
  if (!wordRange) return null;

  const word = document.getText(wordRange);

  // Keyword hover info
  const keywordDocs: Record<string, string> = {
    'schema': 'Defines a structured output type that the LLM must conform to.',
    'persona': 'Defines the agent\'s identity, behavioral traits, and few-shot examples.',
    'proc': 'Defines the reasoning flow as an explicit state machine.',
    'tools': 'Defines external functions available to the agent.',
    'tool': 'Defines a single tool with typed parameters and return value.',
    'meta': 'Compiler directives and configuration options.',
    'axiom': 'Core identity statement for the agent.',
    'traits': 'Quantitative behavioral parameters (0.0 to 1.0).',
    'Pointer': 'References content from the imported ontology file.',
    'string': 'UTF-8 text type.',
    'int': 'Integer number type.',
    'float': 'Floating-point number type.',
    'bool': 'Boolean true/false type.',
    'json': 'Arbitrary JSON structure type.',
    'array': 'Homogeneous array type: array(elementType)',
    'enum': 'Enumerated type with fixed values: enum(val1, val2, ...)'
  };

  if (keywordDocs[word]) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${word}**\n\n${keywordDocs[word]}`
      }
    };
  }

  // Common traits hover info
  const traitDocs: Record<string, string> = {
    'verbosity': 'Controls response length. 0.0 = terse, 1.0 = verbose',
    'professionalism': 'Controls formality and tone. 0.0 = casual, 1.0 = highly professional',
    'creativity': 'Controls creative vs conservative responses. 0.0 = conservative, 1.0 = creative',
    'empathy': 'Controls emotional vs analytical tone. 0.0 = analytical, 1.0 = empathetic',
    'technical_depth': 'Controls technical detail level. 0.0 = simple, 1.0 = technical',
    'cautiousness': 'Controls risk-taking in responses. 0.0 = bold, 1.0 = cautious',
    'thoroughness': 'Controls completeness of responses. 0.0 = quick, 1.0 = thorough'
  };

  if (traitDocs[word]) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${word}** (trait)\n\n${traitDocs[word]}\n\nValue range: 0.0 - 1.0`
      }
    };
  }

  return null;
}

/**
 * Get word range at position
 */
function getWordRangeAtPosition(document: TextDocument, position: Position) {
  const text = document.getText();
  const offset = document.offsetAt(position);

  let start = offset;
  let end = offset;

  // Find start of word
  while (start > 0 && /[a-zA-Z0-9_]/.test(text[start - 1])) {
    start--;
  }

  // Find end of word
  while (end < text.length && /[a-zA-Z0-9_]/.test(text[end])) {
    end++;
  }

  if (start === end) return null;

  return {
    start: document.positionAt(start),
    end: document.positionAt(end)
  };
}
