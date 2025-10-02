import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  TextDocumentSyncKind,
  InitializeParams,
  InitializeResult
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { provideDiagnostics } from './capabilities/diagnostics';
import { provideCompletion } from './capabilities/completion';
import { provideHover } from './capabilities/hover';

/**
 * Melon Language Server
 */

// Create connection
const connection = createConnection(ProposedFeatures.all);

// Create text document manager
const documents = new TextDocuments(TextDocument);

// Initialize handler
connection.onInitialize((params: InitializeParams): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', ':']
      },
      hoverProvider: true
    }
  };
});

// Document change handler - provide diagnostics
documents.onDidChangeContent(change => {
  provideDiagnostics(change.document, connection);
});

// Completion handler
connection.onCompletion(params => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];
  return provideCompletion(document, params.position);
});

// Hover handler
connection.onHover(params => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;
  return provideHover(document, params.position);
});

// Make the text document manager listen on the connection
documents.listen(connection);

// Listen on the connection
connection.listen();
