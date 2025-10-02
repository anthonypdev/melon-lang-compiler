import { CompletionItem, CompletionItemKind, InsertTextFormat, Position } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

/**
 * Provide completion suggestions
 */
export function provideCompletion(
  document: TextDocument,
  position: Position
): CompletionItem[] {
  const items: CompletionItem[] = [];

  // Get current line text
  const line = document.getText({
    start: { line: position.line, character: 0 },
    end: position
  });

  // Keyword completions
  items.push(
    {
      label: 'schema',
      kind: CompletionItemKind.Keyword,
      insertText: 'schema ${1:Name} {\n    $0\n}',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Define an output schema'
    },
    {
      label: 'persona',
      kind: CompletionItemKind.Keyword,
      insertText: 'persona {\n    axiom: ${1:ontology.path} as Pointer,\n    traits {\n        $0\n    }\n}',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Define agent persona'
    },
    {
      label: 'proc',
      kind: CompletionItemKind.Keyword,
      insertText: 'proc {\n    S0(${1:init}) -> S1(${2:process}) -> S2(format: ${3:Output})\n}',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Define procedural flow'
    },
    {
      label: 'tools',
      kind: CompletionItemKind.Keyword,
      insertText: 'tools {\n    $0\n}',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Define available tools'
    },
    {
      label: 'tool',
      kind: CompletionItemKind.Keyword,
      insertText: 'tool ${1:name}(${2:param}: ${3:string}) -> ${4:json} {\n    purpose: ${5:ontology.path} as Pointer,\n}',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Define a tool'
    },
    {
      label: 'meta',
      kind: CompletionItemKind.Keyword,
      insertText: 'meta {\n    checksum: ${1:true},\n}',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Define meta directives'
    }
  );

  // Type completions
  items.push(
    { label: 'string', kind: CompletionItemKind.Class, documentation: 'String type' },
    { label: 'int', kind: CompletionItemKind.Class, documentation: 'Integer type' },
    { label: 'float', kind: CompletionItemKind.Class, documentation: 'Float type' },
    { label: 'bool', kind: CompletionItemKind.Class, documentation: 'Boolean type' },
    { label: 'json', kind: CompletionItemKind.Class, documentation: 'JSON type' },
    {
      label: 'array',
      kind: CompletionItemKind.Class,
      insertText: 'array(${1:string})',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Array type'
    },
    {
      label: 'enum',
      kind: CompletionItemKind.Class,
      insertText: 'enum(${1:value1}, ${2:value2})',
      insertTextFormat: InsertTextFormat.Snippet,
      documentation: 'Enum type'
    }
  );

  // Common trait names
  if (line.includes('traits')) {
    items.push(
      { label: 'verbosity', kind: CompletionItemKind.Property, insertText: 'verbosity: ${1:0.5},' },
      { label: 'professionalism', kind: CompletionItemKind.Property, insertText: 'professionalism: ${1:0.9},' },
      { label: 'creativity', kind: CompletionItemKind.Property, insertText: 'creativity: ${1:0.5},' },
      { label: 'empathy', kind: CompletionItemKind.Property, insertText: 'empathy: ${1:0.7},' },
      { label: 'technical_depth', kind: CompletionItemKind.Property, insertText: 'technical_depth: ${1:0.8},' }
    );
  }

  return items;
}
