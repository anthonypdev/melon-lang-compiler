import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';
import ora from 'ora';

/**
 * Init command - create a new Melon project
 */
export async function initCommand(directory, options) {
  const spinner = ora();
  const targetDir = directory || '.';
  const template = options.template || 'basic';

  try {
    spinner.start(`Initializing new Melon project in ${targetDir}...`);

    // Create directory if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });

    // Determine which template to use
    const templates = {
      basic: getBasicTemplate(),
      advanced: getAdvancedTemplate()
    };

    const templateData = templates[template];
    if (!templateData) {
      throw new Error(`Unknown template: ${template}`);
    }

    // Write files
    await fs.writeFile(
      path.join(targetDir, 'agent.mln'),
      templateData.mln,
      'utf-8'
    );

    await fs.writeFile(
      path.join(targetDir, 'ontology.json'),
      JSON.stringify(templateData.ontology, null, 2),
      'utf-8'
    );

    await fs.writeFile(
      path.join(targetDir, 'README.md'),
      templateData.readme,
      'utf-8'
    );

    spinner.succeed('Project initialized successfully');

    logger.info('\nCreated files:');
    logger.info('  - agent.mln');
    logger.info('  - ontology.json');
    logger.info('  - README.md');

    logger.info('\nNext steps:');
    if (directory) {
      logger.info(`  cd ${directory}`);
    }
    logger.info('  melonc build agent.mln');
    logger.info('');

  } catch (error) {
    spinner.fail('Initialization failed');
    logger.error(error.message);
    process.exit(1);
  }
}

/**
 * Basic template
 */
function getBasicTemplate() {
  return {
    mln: `import ontology from "./ontology.json"

prompt "my_agent:v1.0|mode:strict" {
    schema Output {
        response: string,
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
}
`,
    ontology: {
      axioms: {
        identity: "You are a helpful AI assistant. You provide clear, accurate, and professional responses."
      }
    },
    readme: `# My Melon Agent

A basic Melon prompt programming language project.

## Building

\`\`\`bash
melonc build agent.mln
\`\`\`

This will generate \`agent.cmp\` which can be sent to an LLM.

## Validating

\`\`\`bash
melonc validate agent.mln
\`\`\`

## Learn More

- [Melon Documentation](https://github.com/anthonypdev/melon-lang-compiler)
- [Language Guide](../Melon-Guide.md)
`
  };
}

/**
 * Advanced template with tools
 */
function getAdvancedTemplate() {
  return {
    mln: `import ontology from "./ontology.json"

prompt "analyst:v1.0|mode:strict" {
    meta {
        checksum: true,
        confidence_token: true,
    }
    
    schema Analysis {
        summary: string,
        key_findings: array(string),
        confidence: float,
    }
    
    persona {
        axiom: ontology.axioms.analyst as Pointer,
        traits {
            professionalism: 1.0,
            analytical: 0.95,
            verbosity: 0.4,
        }
        example(positive, on: professionalism) {
            if: ontology.examples.prof_good.if as Pointer,
            then: ontology.examples.prof_good.then as Pointer,
        }
    }
    
    proc {
        S0(init) -> S1(gather_data) -> S2(exec: tools.analyze_data) 
        -> S3(synthesize) -> S4(format: Analysis)
    }
    
    tools {
        tool analyze_data(data: json, depth: int) -> json {
            purpose: ontology.tools.analyze.purpose as Pointer,
            behavior: ontology.tools.analyze.behavior as Pointer,
        }
    }
}
`,
    ontology: {
      axioms: {
        analyst: "You are a professional data analyst. You provide objective, data-driven analysis with clear insights."
      },
      examples: {
        prof_good: {
          if: "User provides unclear or incomplete data.",
          then: "To provide the most accurate analysis, could you please clarify the following aspects of your data: [specific questions]"
        }
      },
      tools: {
        analyze: {
          purpose: "Performs statistical analysis on the provided dataset.",
          behavior: "Analyzes data using appropriate statistical methods and returns structured insights."
        }
      }
    },
    readme: `# Advanced Melon Agent

An advanced Melon project demonstrating tools, examples, and sophisticated prompting.

## Features

- Typed tool definitions
- Few-shot examples
- Multi-stage reasoning flow
- Checksum validation

## Building

\`\`\`bash
melonc build agent.mln
\`\`\`

## Learn More

- [Melon Documentation](https://github.com/anthonypdev/melon-lang-compiler)
- [Language Guide](../Melon-Guide.md)
`
  };
}
