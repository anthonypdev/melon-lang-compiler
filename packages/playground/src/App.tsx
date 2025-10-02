import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { compile, CompilationResult } from '@melon-lang/core';
import './styles/App.css';

export default function App() {
  const [mlnCode, setMlnCode] = useState(DEFAULT_MLN);
  const [ontologyCode, setOntologyCode] = useState(DEFAULT_ONTOLOGY);
  const [cmpOutput, setCmpOutput] = useState<string>('');
  const [issues, setIssues] = useState<Array<{ type: 'error' | 'warning'; message: string; line?: number; hint?: string }>>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    setIssues([]);

    try {
      // Parse ontology JSON
      let ontology;
      try {
        ontology = JSON.parse(ontologyCode);
      } catch (e) {
        setIssues([{ type: 'error', message: 'Invalid JSON in ontology file' }]);
        setIsCompiling(false);
        return;
      }

      // Create temporary ontology file content
      const result: CompilationResult = await compile(mlnCode, '/tmp', {
        filename: 'playground.mln',
        optimizationLevel: 3
      });

      if (result.success) {
        setCmpOutput(result.output || '');
        setIssues(result.warnings?.map((w: any) => ({ 
          type: 'warning', 
          message: w.message,
          line: w.location?.line 
        })) || []);
      } else {
        setCmpOutput('');
        setIssues(result.errors?.map((e: any) => ({ 
          type: 'error', 
          message: e.message,
          line: e.location?.line,
          hint: e.hint 
        })) || []);
      }
    } catch (error: any) {
      setIssues([{ type: 'error', message: error.message }]);
    }

    setIsCompiling(false);
  };

  // Auto-compile on code change (debounced)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleCompile();
    }, 1000);
    return () => clearTimeout(timer);
  }, [mlnCode, ontologyCode]);

  return (
    <div className="app">
      <header className="header">
        <h1>🍈 Melon Playground</h1>
        <div className="header-actions">
          <button onClick={handleCompile} disabled={isCompiling}>
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
        </div>
      </header>

      <div className="editor-container">
        <div className="editor-panel">
          <div className="panel-header">.mln (Logic)</div>
          <Editor
            height="100%"
            language="plaintext"
            value={mlnCode}
            onChange={(value) => setMlnCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false
            }}
          />
        </div>

        <div className="editor-panel">
          <div className="panel-header">ontology.json (Content)</div>
          <Editor
            height="100%"
            language="json"
            value={ontologyCode}
            onChange={(value) => setOntologyCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false
            }}
          />
        </div>

        <div className="editor-panel">
          <div className="panel-header">
            .cmp (Compiled Output)
            {cmpOutput && (
              <button 
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(cmpOutput)}
              >
                Copy
              </button>
            )}
          </div>
          <Editor
            height="100%"
            language="plaintext"
            value={cmpOutput}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'off',
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
      </div>

      <div className="issues-panel">
        <div className="panel-header">
          Issues {issues.length > 0 && `(${issues.length})`}
        </div>
        <div className="issues-content">
          {issues.length === 0 ? (
            <div className="no-issues">✓ No issues</div>
          ) : (
            issues.map((issue, idx) => (
              <div key={idx} className={`issue issue-${issue.type}`}>
                <span className="issue-icon">
                  {issue.type === 'error' ? '✗' : '⚠'}
                </span>
                <div className="issue-content">
                  <div className="issue-message">{issue.message}</div>
                  {issue.line && <div className="issue-location">Line {issue.line}</div>}
                  {issue.hint && <div className="issue-hint">Hint: {issue.hint}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_MLN = `import ontology from "./ontology.json"

prompt "hello:v1.0|mode:strict" {
    schema Output {
        greeting: string,
        confidence: float,
    }
    
    persona {
        axiom: ontology.axioms.identity as Pointer,
        traits {
            helpfulness: 0.9,
            professionalism: 0.8,
        }
    }
    
    proc {
        S0(init) -> S1(process) -> S2(format: Output)
    }
}`;

const DEFAULT_ONTOLOGY = `{
  "axioms": {
    "identity": "You are a helpful AI assistant."
  }
}`;
