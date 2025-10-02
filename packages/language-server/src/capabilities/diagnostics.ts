import { Diagnostic, DiagnosticSeverity, Connection } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Lexer, Parser, TypeChecker } from '@melon-lang/core';

/**
 * Provide diagnostics for a document
 */
export async function provideDiagnostics(
  document: TextDocument,
  connection: Connection
): Promise<void> {
  const diagnostics: Diagnostic[] = [];

  try {
    const source = document.getText();

    // Lexical analysis
    const lexer = new Lexer(source, document.uri);
    const tokens = lexer.tokenize();

    // Parsing
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Type checking
    const typeChecker = new TypeChecker(ast);
    const result = typeChecker.check();

    // Convert errors to diagnostics
    for (const error of result.errors) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: error.location.line - 1,
            character: error.location.column
          },
          end: {
            line: error.location.line - 1,
            character: error.location.column + 10
          }
        },
        message: error.message,
        source: 'melon',
        code: error.code
      });
    }

    // Convert warnings to diagnostics
    for (const warning of result.warnings) {
      diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range: {
          start: {
            line: warning.location.line - 1,
            character: warning.location.column
          },
          end: {
            line: warning.location.line - 1,
            character: warning.location.column + 10
          }
        },
        message: warning.message,
        source: 'melon'
      });
    }

  } catch (error: any) {
    // Catch-all for parsing errors
    if (error.location) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: error.location.line - 1,
            character: error.location.column
          },
          end: {
            line: error.location.line - 1,
            character: error.location.column + 10
          }
        },
        message: error.message,
        source: 'melon',
        code: error.code
      });
    }
  }

  // Send diagnostics
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}
