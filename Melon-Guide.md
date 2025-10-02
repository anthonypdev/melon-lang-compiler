# **The Complete Melon Language Reference Guide**

## **A Comprehensive, Hyper-Detailed Manual for Architecting Production-Grade LLM Instructions**

**Version 1.0 | Official Reference Documentation**

---

## **Table of Contents**

### **Part I: Foundations**

1. [Introduction: The Melon Philosophy](#1-introduction-the-melon-philosophy)
2. [Understanding the Problem Space](#2-understanding-the-problem-space)
3. [Core Concepts and Mental Models](#3-core-concepts-and-mental-models)
4. [The Two-File Architecture](#4-the-two-file-architecture)
5. [Setting Up Your Development Environment](#5-setting-up-your-development-environment)

### **Part II: Language Specification**

6. [Complete Syntax Reference](#6-complete-syntax-reference)
7. [Type System Deep Dive](#7-type-system-deep-dive)
8. [The Pointer System Explained](#8-the-pointer-system-explained)
9. [Schema Definitions and Output Constraints](#9-schema-definitions-and-output-constraints)
10. [Persona Block: Quantitative Agent Identity](#10-persona-block-quantitative-agent-identity)
11. [Procedural Flow: State Machines in Detail](#11-procedural-flow-state-machines-in-detail)
12. [Tools Block: Function Definition and Tool Calling](#12-tools-block-function-definition-and-tool-calling)
13. [Meta Directives and Compiler Configuration](#13-meta-directives-and-compiler-configuration)

### **Part III: The Ontology System**

14. [Ontology File Structure and Organization](#14-ontology-file-structure-and-organization)
15. [Content Strategies for Ontologies](#15-content-strategies-for-ontologies)
16. [Modular Ontologies and Import Patterns](#16-modular-ontologies-and-import-patterns)
17. [Versioning and Content Management](#17-versioning-and-content-management)

### **Part IV: Compilation Process**

18. [The melonc Compiler: Complete Architecture](#18-the-melonc-compiler-complete-architecture)
19. [Stage 1: Parsing and AST Generation](#19-stage-1-parsing-and-ast-generation)
20. [Stage 2: Static Analysis and Type Checking](#20-stage-2-static-analysis-and-type-checking)
21. [Stage 3: Pointer Resolution and Content Injection](#21-stage-3-pointer-resolution-and-content-injection)
22. [Stage 4: Compression and Serialization](#22-stage-4-compression-and-serialization)
23. [The .cmp Format: Byte-Level Specification](#23-the-cmp-format-byte-level-specification)
24. [Error Messages and Debugging](#24-error-messages-and-debugging)

### **Part V: Advanced Prompt Engineering**

25. [Meta-Prompting Strategies](#25-meta-prompting-strategies)
26. [Chain-of-Thought Implementation](#26-chain-of-thought-implementation)
27. [Tree-of-Thoughts and Multi-Path Reasoning](#27-tree-of-thoughts-and-multi-path-reasoning)
28. [Self-Consistency and Ensemble Techniques](#28-self-consistency-and-ensemble-techniques)
29. [Few-Shot Learning Optimization](#29-few-shot-learning-optimization)
30. [Zero-Shot Chain-of-Thought](#30-zero-shot-chain-of-thought)
31. [Retrieval-Augmented Generation Patterns](#31-retrieval-augmented-generation-patterns)
32. [Constitutional AI and Value Alignment](#32-constitutional-ai-and-value-alignment)
33. [Adversarial Prompt Resistance](#33-adversarial-prompt-resistance)
34. [Attention Mechanism Optimization](#34-attention-mechanism-optimization)

### **Part VI: Bleeding-Edge Techniques**

35. [Symbolic Reasoning and Logic Enforcement](#35-symbolic-reasoning-and-logic-enforcement)
36. [Multi-Agent Coordination Patterns](#36-multi-agent-coordination-patterns)
37. [Dynamic Context Window Management](#37-dynamic-context-window-management)
38. [Token Budget Optimization](#38-token-budget-optimization)
39. [Hallucination Prevention Strategies](#39-hallucination-prevention-strategies)
40. [Output Verification and Self-Critique](#40-output-verification-and-self-critique)
41. [Prompt Chaining and Orchestration](#41-prompt-chaining-and-orchestration)
42. [Iterative Refinement Loops](#42-iterative-refinement-loops)

### **Part VII: Practical Implementation**

43. [Complete Walkthrough: Building a Financial Analyst](#43-complete-walkthrough-building-a-financial-analyst)
44. [Complete Walkthrough: Code Generation Agent](#44-complete-walkthrough-code-generation-agent)
45. [Complete Walkthrough: Research Assistant](#45-complete-walkthrough-research-assistant)
46. [Complete Walkthrough: Multi-Tool Orchestrator](#46-complete-walkthrough-multi-tool-orchestrator)
47. [Testing and Validation Strategies](#47-testing-and-validation-strategies)
48. [Performance Optimization](#48-performance-optimization)
49. [Production Deployment Patterns](#49-production-deployment-patterns)
50. [Monitoring and Observability](#50-monitoring-and-observability)

---

# **PART I: FOUNDATIONS**

---

## **1. Introduction: The Melon Philosophy**

### **1.1 The Crisis in Modern Prompt Engineering**

Prompt engineering has evolved rapidly since the emergence of large language models, but it has remained fundamentally an art form rather than an engineering discipline. When developers craft prompts today, they typically write natural language instructions—prose that humans can read but which introduces numerous challenges:

**The Ambiguity Problem**: Natural language is inherently ambiguous. Words carry multiple meanings, cultural contexts, and implicit assumptions. When you write "be professional," different models may interpret this differently based on their training data. One model might associate professionalism with formal language, another with brevity, and yet another with comprehensive explanations. This ambiguity leads to drift—inconsistent behavior across model versions, fine-tuning runs, or even between identical API calls.

**The Token Inefficiency Problem**: LLMs process text as tokens, and every token consumed in the system prompt reduces the available context window for the actual task. A verbose natural language prompt might consume 2,000-3,000 tokens just to establish basic behavior. For models with limited context windows (4K, 8K, or even 16K tokens), this overhead is devastating. It means less room for task-specific information, fewer examples, and reduced capability to handle complex reasoning chains.

**The Verification Problem**: When you write a prompt in natural language, there's no way to verify its correctness before sending it to the model. Typos, broken references, logical contradictions, and structural errors all go undetected until runtime—when they manifest as confusing or incorrect model behavior. This is analogous to writing code without a compiler or linter.

**The Reproducibility Problem**: Natural language prompts are difficult to version, test, and reproduce. Small changes in wording can produce dramatically different outcomes, making A/B testing and iterative improvement challenging. Teams struggle to maintain consistent behavior across deployed agents.

### **1.2 The Melon Solution: Prompts as Code**

Melon fundamentally reconceptualizes what a prompt is. Instead of treating prompts as descriptive text, Melon treats them as **compilable source code** that defines the operational behavior of an AI agent. This paradigm shift brings several transformative benefits:

**Static Type Checking**: Just as TypeScript prevents runtime errors in JavaScript, Melon prevents runtime failures in LLM interactions. The compiler validates that all schemas are well-formed, all pointers reference existing ontology entries, all types match, and all control flows are logically sound. Errors are caught at compile-time, not in production.

**Aggressive Optimization**: The Melon compiler doesn't just validate your prompt—it optimizes it. Through keyword-to-symbol mapping, quantization, whitespace elimination, and structural flattening, it produces a .cmp file that typically uses 70-80% fewer tokens than the equivalent natural language prompt. This isn't lossy compression; the semantic content is preserved, but the syntactic overhead is eliminated.

**Separation of Concerns**: Melon enforces a clean separation between logic (the .mln file) and content (the .json ontology). Engineers focus on control flow, state machines, and type definitions. Content creators focus on natural language descriptions, examples, and documentation. This division enables parallel development, easier localization, and cleaner version control.

**Deterministic Behavior**: By making state machines and procedural flow first-class language constructs, Melon enables genuinely deterministic agent behavior. You don't hope the model follows a reasoning chain—you define it explicitly. The model must traverse your specified states in order, cannot skip steps, and cannot get lost in recursive loops.

### **1.3 Who Should Use Melon**

Melon is designed for teams and individuals who need production-grade reliability from their LLM deployments:

- **Enterprise AI Teams**: Organizations deploying customer-facing AI agents that must behave consistently and predictably
- **AI Application Developers**: Builders creating complex multi-agent systems where reliability is critical
- **Prompt Engineers**: Professionals who have outgrown natural language prompting and need industrial-strength tools
- **Research Teams**: Groups exploring advanced prompting techniques and needing reproducible experiments
- **Cost-Conscious Developers**: Anyone paying significant API costs who needs to optimize token usage

### **1.4 What This Guide Covers**

This guide is exhaustive. It is designed to be the single source of truth for everything Melon. You will learn:

- Every syntax element of the .mln language, with complete examples
- How to structure ontology files for maximum effectiveness
- The complete internal workings of the melonc compiler
- Advanced prompt engineering techniques implemented in Melon syntax
- Bleeding-edge patterns for state-of-the-art LLM control
- Step-by-step walkthroughs of building production agents
- Testing, deployment, and monitoring strategies

By the end of this guide, you will have complete mastery of Melon and be able to architect sophisticated, production-ready LLM applications.

---

## **2. Understanding the Problem Space**

### **2.1 How LLMs Process Prompts**

To understand why Melon's design choices matter, you must first understand how large language models process instructions. This section provides a technical deep dive into the tokenization, attention, and generation mechanisms that underpin LLM behavior.

**Tokenization and Token Budgets**:

When you send a prompt to an LLM, the first step is tokenization. The model doesn't see your text as characters or words—it sees it as a sequence of tokens. A token is typically 3-4 characters for English text, but can vary significantly:

- "Hello" = 1 token
- "Hello, world!" = 4 tokens (Hello, ",", "world", "!")
- "supercalifragilisticexpialidocious" = 7-8 tokens (broken into subwords)

Token overhead is particularly severe for formatting. JSON, XML, and Markdown all use significant structural characters:

```json
{
  "name": "value"
}
```

This simple JSON uses 7 tokens: `{`, `"name"`, `:`, `"value"`, `}`, plus whitespace and newlines. Multiply this across a complex prompt with multiple nested structures, and you quickly consume hundreds of tokens on formatting alone.

Melon's .cmp format eliminates this overhead by using minimal delimiters (`§`, `|`, `^`) that are 1 token each and carry semantic meaning without requiring parsing of nested structures.

**Attention Mechanisms**:

Modern transformers use attention mechanisms to decide which tokens to focus on when generating each output token. The attention mechanism creates a matrix where each token "attends" to every other token in the context with varying weights.

The problem: attention is quadratic in complexity (O(n²)). As your prompt grows longer, the computational cost grows exponentially. Worse, the attention weights get diluted across more tokens, reducing the model's ability to focus on critical instructions.

Melon addresses this through Signal Map prefixes (`PER|`, `PRC|`, etc.). These semantic anchors prime the attention mechanism, creating strong attentional signals that help the model allocate resources effectively.

**The Generation Loop**:

When generating output, the LLM operates token-by-token in an autoregressive loop:

1. Process all context tokens (your prompt + any previous output)
2. Compute probability distribution over vocabulary for next token
3. Sample next token based on distribution
4. Append token to context
5. Repeat from step 1

Each iteration reprocesses the entire context, meaning longer prompts slow down generation significantly. Token-efficient prompts mean faster response times and lower computational costs.

### **2.2 Common Failure Modes in Natural Language Prompting**

Understanding why natural language prompts fail helps motivate Melon's design:

**Failure Mode 1: Instruction Drift**

Consider this natural language instruction:

```
You are a helpful assistant. Always provide sources for factual claims.
Be concise but thorough. Use a professional tone.
```

Problems:

- "Helpful" is subjective and model-dependent
- "Always" is impossible to enforce—the model may forget mid-conversation
- "Concise but thorough" is contradictory
- "Professional tone" has no quantitative definition

Result: The model's behavior varies unpredictably, especially in long conversations.

Melon solution:

```melon
persona {
    axiom: ontology.axioms.assistant_identity as Pointer,
    traits {
        helpfulness: 0.9,
        verbosity: 0.4,  // Explicit: lower is more concise
        professionalism: 0.9,
    }
}
```

**Failure Mode 2: Tool Misuse**

Natural language tool descriptions often fail:

```
Use the search_database tool to find information in the corporate database.
Only use this when the user asks about company data.
```

Problems:

- "Company data" is vague—does it include public data? Historical data?
- The model may use the tool unnecessarily or fail to use it when needed
- No type safety on parameters

Result: Tools are called with wrong arguments, at wrong times, or not at all.

Melon solution:

```melon
tools {
    tool search_database(
        query: string,
        database_scope: enum(internal, public, archived)
    ) -> json {
        purpose: ontology.tools.search_db.purpose as Pointer,
        behavior: ontology.tools.search_db.behavior as Pointer,
        when_to_use: ontology.tools.search_db.usage_conditions as Pointer,
        example_call: ontology.tools.search_db.example as Pointer,
    }
}
```

**Failure Mode 3: Output Format Violations**

Natural language output instructions are frequently ignored:

```
Always respond in JSON format with fields: summary, details, confidence.
```

Problems:

- Model may generate markdown, plain text, or malformed JSON
- Field names might vary (Summary vs summary, detail vs details)
- No enforcement mechanism

Melon solution:

```melon
schema OutputFormat {
    summary: string,
    details: array(string),
    confidence: float,
}

proc {
    S0(init) -> S1(analyze) -> S2(format: OutputFormat)
}
```

The schema is enforced by the compiler and embedded as a constraint in the .cmp file.

### **2.3 Token Economics: The Hidden Cost of Verbose Prompts**

Let's analyze the real-world cost implications of token inefficiency:

**Scenario: Production Customer Service Agent**

Assume:

- 10,000 conversations per day
- Average 20 exchanges per conversation
- System prompt reprocessed each exchange
- Model: GPT-4 ($0.03 per 1K input tokens)

**Natural Language Prompt** (2,500 tokens):

- Tokens per exchange: 2,500
- Total daily tokens: 10,000 × 20 × 2,500 = 500,000,000 tokens
- Daily cost: $15,000
- Annual cost: $5,475,000

**Melon .cmp Prompt** (600 tokens, 76% reduction):

- Tokens per exchange: 600
- Total daily tokens: 10,000 × 20 × 600 = 120,000,000 tokens
- Daily cost: $3,600
- Annual cost: $1,314,000

**Savings: $4,161,000 per year**

This dramatic cost reduction makes Melon economically compelling for any production deployment.

---

## **3. Core Concepts and Mental Models**

### **3.1 The Compilation Mental Model**

Think of Melon compilation as analogous to traditional software compilation, but with a unique twist:

**Source Code (.mln)** ← You write this
↓ (Import)
**+ Content Database (.json)** ← Separate editing
↓ (Compile)
**= Machine Code (.cmp)** ← LLM consumes this

The .mln file is your high-level logic. The .json file is your data. The .cmp file is the optimized binary that the LLM executes.

This is similar to:

- **C/C++**: Source code + Header files → Compiled binary
- **Web Development**: JavaScript + HTML → Bundled assets
- **Databases**: Query logic + Data tables → Execution plan

### **3.2 Pointers: References, Not Copies**

A critical mental model for Melon is understanding pointers. In Melon, a Pointer is:

**NOT**: A string copy mechanism
**IS**: A compile-time reference that gets resolved and embedded

When you write:

```melon
axiom: ontology.axioms.core_identity as Pointer
```

You're not saying "copy this string at runtime." You're saying "resolve this reference during compilation and embed the content in the final .cmp file."

This is analogous to:

- **C preprocessor #include**: Resolves at compile-time
- **Database foreign keys**: References that get resolved during query execution
- **Import statements**: Bring content into current scope

The key insight: The .cmp file contains the FULL resolved content. The LLM never sees "ontology.axioms.core_identity"—it sees the actual text that was stored at that path in the JSON file.

### **3.3 Type Safety as Runtime Prevention**

Melon's type system prevents entire classes of runtime failures:

**Without Type Safety** (Natural Language):

```
Use the get_user_data tool with the user's ID and return their profile.
```

Potential failures:

- ID passed as string when tool expects integer
- Tool returns nested object but prompt expects flat structure
- Missing required fields in output

**With Type Safety** (Melon):

```melon
schema UserProfile {
    id: int,
    name: string,
    email: string,
    preferences: UserPreferences,
}

schema UserPreferences {
    theme: enum(light, dark),
    notifications: bool,
}

tools {
    tool get_user_data(user_id: int) -> UserProfile {
        // Typed return value
    }
}
```

The compiler ensures:

- `user_id` is passed as int
- Tool return type matches UserProfile schema
- All required fields are present
- Nested types are correctly defined

### **3.4 State Machines vs. Implicit Reasoning**

Traditional prompts rely on emergent reasoning:

```
Think step by step. First analyze the input, then gather data,
then form conclusions, and finally format your response.
```

This is *implicit*—you hope the model follows this sequence, but there's no guarantee.

Melon makes reasoning *explicit* through state machines:

```melon
proc {
    S0(init) -> S1(analyze_input) -> S2(gather_data) 
    -> S3(form_conclusions) -> S4(format: OutputSchema)
}
```

The model MUST traverse these states in sequence. It cannot skip S2 or loop back to S0. This determinism is crucial for production systems where predictable behavior is non-negotiable.

---

## **4. The Two-File Architecture**

### **4.1 Separation of Concerns: Why Two Files?**

The two-file architecture is not arbitrary—it solves real engineering problems:

**Problem 1: Logic Fragility**

When logic and content are mixed in natural language prompts, small content changes risk breaking the logic:

```
You are a helpful assistant specialized in financial analysis.
When the user asks about stocks, first retrieve the latest data,
then analyze trends, and finally make a recommendation.

Available tools:
- get_stock_data(ticker: string): Gets current stock price
- get_historical_data(ticker: string, days: int): Gets historical prices
```

If someone edits "helpful assistant" to "highly professional assistant," they might accidentally change the tool descriptions, breaking functionality.

**Melon Solution**:

**finance_agent.mln** (Logic - Sacred):

```melon
import ontology from "./finance_kb.json"

prompt "finance_agent:v1.0|mode:strict" {
    persona {
        axiom: ontology.persona.identity as Pointer,
    }
    
    proc {
        S0(init) -> S1(retrieve_data) -> S2(analyze) -> S3(recommend)
    }
    
    tools {
        tool get_stock_data(ticker: string) -> json {
            purpose: ontology.tools.stock_data.purpose as Pointer,
        }
    }
}
```

**finance_kb.json** (Content - Editable):

```json
{
    "persona": {
        "identity": "You are a highly professional financial analyst..."
    },
    "tools": {
        "stock_data": {
            "purpose": "Retrieves current stock price and basic metrics..."
        }
    }
}
```

Now content editors can modify "highly professional" without any risk of breaking the control flow or tool definitions.

**Problem 2: Localization**

Supporting multiple languages in natural language prompts requires duplicating the entire prompt:

```
// English version
You are a helpful assistant. Always be polite and professional...

// Spanish version
Eres un asistente útil. Siempre sé cortés y profesional...

// Japanese version
あなたは親切なアシスタントです。常に礼儀正しく、プロフェッショナルであってください...
```

Each version must be maintained separately, and bugs in the logic structure must be fixed in all versions.

**Melon Solution**:

**agent.mln** (Single logic file - Language agnostic):

```melon
import ontology from "./kb_${LANG}.json"  // Language selected at build time

prompt "agent:v1.0|mode:strict" {
    persona {
        axiom: ontology.persona.identity as Pointer,
    }
}
```

**kb_en.json** (English content):

```json
{
    "persona": {
        "identity": "You are a helpful assistant. Always be polite and professional..."
    }
}
```

**kb_es.json** (Spanish content):

```json
{
    "persona": {
        "identity": "Eres un asistente útil. Siempre sé cortés y profesional..."
    }
}
```

**kb_ja.json** (Japanese content):

```json
{
    "persona": {
        "identity": "あなたは親切なアシスタントです。常に礼儀正しく、プロフェッショナルであってください..."
    }
}
```

One logic file, multiple content files. Perfect for multi-language deployments.

### **4.2 The .mln File: Your Prompt's Source Code**

The .mln file is where you define the architecture of your agent. It contains:

1. **Import statements**: Links to ontology files
2. **Prompt declaration**: Metadata (name, version, mode)
3. **Meta directives**: Compiler configuration
4. **Schema definitions**: Type-safe output structures
5. **Persona block**: Agent identity and traits
6. **Procedural flow**: State machine definition
7. **Tools block**: Function signatures and descriptions

**Structural Template**:

```melon
// ============================================
// IMPORTS
// ============================================
import ontology from "./path/to/ontology.json"
import shared_schemas from "./schemas/common.json"

// ============================================
// PROMPT DECLARATION
// ============================================
prompt "agent_name:v1.0|mode:strict" {
    
    // ========================================
    // META DIRECTIVES
    // ========================================
    meta {
        checksum: true,
        confidence_token: true,
    }
    
    // ========================================
    // SCHEMA DEFINITIONS
    // ========================================
    schema OutputFormat {
        field1: string,
        field2: int,
    }
    
    // ========================================
    // PERSONA
    // ========================================
    persona {
        axiom: ontology.persona.core as Pointer,
        traits {
            trait1: 0.9,
            trait2: 0.5,
        }
    }
    
    // ========================================
    // PROCEDURAL FLOW
    // ========================================
    proc {
        S0(init) -> S1(step1) -> S2(step2) -> S3(format: OutputFormat)
    }
    
    // ========================================
    // TOOLS
    // ========================================
    tools {
        tool tool_name(param: string) -> json {
            purpose: ontology.tools.tool_name.purpose as Pointer,
        }
    }
}
```

### **4.3 The .json File: Your Content Database**

The ontology file is a structured JSON document containing all natural language content. It should be organized logically to mirror your .mln structure:

**Recommended Structure**:

```json
{
    "metadata": {
        "version": "1.0",
        "language": "en",
        "last_updated": "2024-01-15"
    },
    
    "persona": {
        "core_identity": "...",
        "behavioral_guidelines": "...",
        "constraints": "..."
    },
    
    "axioms": {
        "truth_seeking": "...",
        "helpfulness": "...",
        "safety": "..."
    },
    
    "examples": {
        "positive_example_1": {
            "if": "...",
            "then": "..."
        },
        "negative_example_1": {
            "if": "...",
            "then": "..."
        }
    },
    
    "tools": {
        "tool_1": {
            "purpose": "...",
            "behavior": "...",
            "usage_conditions": "...",
            "parameters": "...",
            "return_format": "...",
            "example_calls": "..."
        }
    },
    
    "reasoning_guidelines": {
        "step_1_instructions": "...",
        "step_2_instructions": "...",
        "step_3_instructions": "..."
    },
    
    "output_formatting": {
        "general_guidelines": "...",
        "error_handling": "...",
        "edge_cases": "..."
    }
}
```

### **4.4 File Organization Best Practices**

For small projects:

```
my-agent/
├── agent.mln
└── ontology.json
```

For medium projects:

```
my-agent/
├── agent.mln
├── ontologies/
│   ├── persona.json
│   ├── tools.json
│   └── examples.json
└── schemas/
    └── common_types.json
```

For large projects (multi-language, multi-agent):

```
project/
├── agents/
│   ├── customer_service/
│   │   ├── agent.mln
│   │   └── ontologies/
│   │       ├── en.json
│   │       ├── es.json
│   │       └── ja.json
│   ├── technical_support/
│   │   ├── agent.mln
│   │   └── ontologies/
│   │       └── en.json
│   └── sales/
│       ├── agent.mln
│       └── ontologies/
│           └── en.json
├── shared/
│   ├── schemas/
│   │   ├── user_types.json
│   │   └── response_types.json
│   └── common_tools.json
└── compiled/
    ├── customer_service_en.cmp
    ├── customer_service_es.cmp
    └── technical_support_en.cmp
```

---

## **5. Setting Up Your Development Environment**

### **5.1 Installing the Melon Compiler**

The Melon compiler (melonc) is distributed as an npm package:

**Prerequisites**:

- Node.js 16.x or higher
- npm 7.x or higher

**Global Installation** (Recommended for CLI usage):

```bash
npm install -g melon-compiler
```

**Project-Local Installation** (For CI/CD pipelines):

```bash
npm install --save-dev melon-compiler
```

**Verify Installation**:

```bash
melonc --version
# Output: melonc v1.0.0
```

### **5.2 IDE Setup and Syntax Highlighting**

**VS Code Extension**:

Install the official Melon extension for VS Code:

```bash
code --install-extension melon-lang.melon-vscode
```

Features:

- Syntax highlighting for .mln files
- IntelliSense for keywords and types
- Real-time error checking
- Pointer validation
- "Go to Definition" for ontology references
- Snippets for common patterns

**Configuration** (.vscode/settings.json):

```json
{
    "melon.linter.enabled": true,
    "melon.linter.onSave": true,
    "melon.ontology.validation": true,
    "melon.compiler.showOutputOnError": true
}
```

**Vim/Neovim**:

Install the vim-melon plugin:

```vim
Plug 'melon-lang/vim-melon'
```

**Sublime Text**:

Install via Package Control:

```
Package Control: Install Package → Melon Syntax
```

### **5.3 Project Initialization**

Create a new Melon project:

```bash
# Create project directory
mkdir my-melon-agent
cd my-melon-agent

# Initialize with template
melonc init

# This creates:
# - agent.mln (basic template)
# - ontology.json (example ontology)
# - .melonrc (compiler configuration)
# - README.md (project documentation)
```

**Alternative: Manual Setup**:

**agent.mln**:

```melon
import ontology from "./ontology.json"

prompt "my_agent:v0.1|mode:strict" {
    schema Output {
        response: string,
    }
    
    persona {
        axiom: ontology.axioms.identity as Pointer,
        traits {
            helpfulness: 0.9,
        }
    }
    
    proc {
        S0(init) -> S1(process) -> S2(format: Output)
    }
}
```

**ontology.json**:

```json
{
    "axioms": {
        "identity": "You are a helpful AI assistant."
    }
}
```

### **5.4 Compiler Configuration (.melonrc)**

The .melonrc file configures compiler behavior:

```json
{
    "version": "1.0",
    "compiler": {
        "strict_mode": true,
        "optimization_level": 3,
        "target_token_budget": 1000,
        "preserve_comments": false
    },
    "linter": {
        "check_pointer_validity": true,
        "check_type_safety": true,
        "check_state_machine_completeness": true,
        "warn_on_unused_ontology_entries": true
    },
    "output": {
        "format": "cmp",
        "output_directory": "./compiled",
        "filename_pattern": "{prompt_name}_{version}.cmp",
        "generate_source_map": true
    },
    "preprocessing": {
        "environment_variables": {
            "LANG": "en",
            "MODE": "production"
        }
    }
}
```

**Configuration Options Explained**:

- `strict_mode`: Enforces all type checking and validation rules
- `optimization_level`: 1-3, higher means more aggressive compression
- `target_token_budget`: Compiler warns if output exceeds this
- `preserve_comments`: Keep comments in .cmp (useful for debugging)
- `check_pointer_validity`: Ensures all pointers reference existing ontology entries
- `check_type_safety`: Validates all type annotations
- `check_state_machine_completeness`: Ensures proc flows are complete
- `generate_source_map`: Creates mapping file for debugging

### **5.5 Version Control Setup**

**.gitignore**:

```
# Compiled outputs
*.cmp
compiled/

# Build artifacts
.melon-cache/
.melon-build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Dependencies (if using local install)
node_modules/

# Logs
*.log
melon-compiler.log

# OS files
.DS_Store
Thumbs.db
```

**Recommended Git Structure**:

```
git add agent.mln
git add ontology.json
git add .melonrc
git add README.md
git commit -m "Initial Melon agent setup"
```

Only commit source files (.mln, .json), not compiled outputs (.cmp).

---

# **PART II: LANGUAGE SPECIFICATION**

---

## **6. Complete Syntax Reference**

### **6.1 Lexical Structure**

**Keywords** (Reserved words that cannot be used as identifiers):

```
import, from, as, prompt, meta, schema, persona, axiom, traits,
example, positive, negative, on, proc, tools, tool, enum, array,
string, int, float, bool, json, Pointer, checksum, confidence_token
```

**Identifiers**:

- Must start with letter or underscore
- Can contain letters, numbers, underscores
- Case-sensitive
- Cannot be keywords

Valid identifiers:

```
myAgent, my_agent, MyAgent, agent123, _privateAgent
```

Invalid identifiers:

```
123agent (starts with number)
my-agent (contains hyphen)
import (keyword)
```

**Comments**:

```melon
// Single-line comment

/*
    Multi-line
    comment
*/
```

Comments are stripped during compilation and do not appear in .cmp files (unless `preserve_comments: true` in .melonrc).

**Literals**:

String literals:

```melon
"hello world"
"line1\nline2"  // Escape sequences supported
"path/to/file"
```

Numeric literals:

```melon
42       // integer
3.14     // float
0.5      // float
1.0      // float
```

Boolean literals:

```melon
true
false
```

**Delimiters and Operators**:

```
{ } ( ) [ ] : , . -> | ^ § as
```

### **6.2 Import Statements**

**Basic Import**:

```melon
import ontology from "./ontology.json"
```

**Multiple Imports**:

```melon
import ontology from "./ontology.json"
import shared_types from "./schemas/common.json"
import tools_db from "./tools/definitions.json"
```

**Relative Paths**:

```melon
import ontology from "./ontology.json"           // Same directory
import ontology from "../shared/ontology.json"   // Parent directory
import ontology from "./kb/en/ontology.json"     // Subdirectory
```

**Environment Variable Interpolation**:

```melon
import ontology from "./kb/${LANG}/ontology.json"
// With LANG=en, resolves to "./kb/en/ontology.json"
// With LANG=es, resolves to "./kb/es/ontology.json"
```

**Import Semantics**:

- Imports are resolved at compile-time
- Circular imports are not allowed
- Missing files cause compilation errors
- JSON parsing errors in imported files cause compilation errors

### **6.3 Prompt Declaration**

**Syntax**:

```melon
prompt "name:version|mode:mode_value" {
    // prompt body
}
```

**Name Format**:

- Alphanumeric characters, underscores, hyphens
- Should be descriptive and unique

**Version Format**:

- Semantic versioning recommended: `v1.0.0`, `v2.1.3`
- Can be any string: `v1`, `beta`, `2024-01-15`

**Mode Values**:

- `strict`: Maximum type checking and validation
- `permissive`: Allows some flexibility (not recommended for production)
- `debug`: Includes debugging information in .cmp output

**Examples**:

```melon
prompt "customer_service:v1.0|mode:strict" { }
prompt "code_gen:v2.1.3|mode:strict" { }
prompt "experimental_agent:beta|mode:debug" { }
```

### **6.4 Block Structure**

A prompt body contains zero or more blocks in any order (though conventional order is recommended):

```melon
prompt "agent:v1.0|mode:strict" {
    meta { }         // Optional
    schema Name { }  // Zero or more
    persona { }      // Optional but recommended
    proc { }         // Required
    tools { }        // Optional
}
```

---

## **7. Type System Deep Dive**

### **7.1 Primitive Types**

**string**:

- UTF-8 encoded text
- Unbounded length
- Used for: Text content, descriptions, names

```melon
schema User {
    name: string,
    bio: string,
}
```

**int**:

- Signed integer
- Range: -2^53 to 2^53 (JavaScript number safe range)
- Used for: Counts, IDs, indices

```melon
schema Stats {
    count: int,
    user_id: int,
}
```

**float**:

- IEEE 754 double-precision floating-point
- Used for: Probabilities, scores, measurements

```melon
schema Analysis {
    confidence: float,
    score: float,
}
```

**bool**:

- Boolean value
- Values: `true`, `false`
- Used for: Flags, binary choices

```melon
schema Config {
    enabled: bool,
    verbose: bool,
}
```

**json**:

- Arbitrary JSON structure
- Used for: Tool return types, flexible data

```melon
tools {
    tool get_data() -> json {
        // Returns any valid JSON
    }
}
```

### **7.2 Composite Types**

**array(type)**:

- Homogeneous array of specified type
- Can nest: `array(array(string))`

```melon
schema Response {
    items: array(string),
    scores: array(float),
    nested: array(array(int)),
}
```

**enum(value1, value2, ...)**:

- Enumerated type with fixed set of values
- Values are identifiers (not quoted strings)

```melon
schema Analysis {
    sentiment: enum(positive, negative, neutral),
    priority: enum(low, medium, high, critical),
}
```

### **7.3 Schema Types**

Schemas define structured types:

```melon
schema Address {
    street: string,
    city: string,
    zipcode: string,
}

schema Person {
    name: string,
    age: int,
    address: Address,  // Nested schema
}
```

**Schema Nesting**:
Schemas can reference other schemas:

```melon
schema Item {
    id: int,
    name: string,
}

schema Order {
    order_id: int,
    items: array(Item),  // Array of schema type
}

schema ShippingInfo {
    destination: Address,  // Reference to Address schema
}
```

**Schema Composition**:
While Melon doesn't support inheritance, you can compose schemas:

```melon
schema BaseResponse {
    status: enum(success, error),
    message: string,
}

schema DataResponse {
    status: enum(success, error),
    message: string,
    data: json,  // Extends conceptually by adding field
}
```

### **7.4 The Pointer Type**

The Pointer type is unique to Melon and represents a compile-time reference to ontology content:

**Declaration**:

```melon
persona {
    axiom: ontology.axioms.identity as Pointer,
}
```

**Resolution**:
At compile-time, the compiler:

1. Parses `ontology.axioms.identity`
2. Looks up this path in imported ontology.json
3. Retrieves the string value
4. Embeds it in the .cmp file

**Type Safety**:
The compiler ensures:

- The ontology file exists
- The path is valid
- The target is a string value (not object or array)

**Example**:

**.mln**:

```melon
import ontology from "./kb.json"
prompt "agent:v1.0|mode:strict" {
    persona {
        axiom: ontology.core.identity as Pointer,
    }
}
```

**kb.json**:

```json
{
    "core": {
        "identity": "You are a helpful assistant."
    }
}
```

**Compiled .cmp** (simplified):

```
PER|AX:You are a helpful assistant.
```

The pointer is GONE—only the resolved content remains.

### **7.5 Type Checking Rules**

**Rule 1: Type Matching**

```melon
schema User {
    age: int,
}

// VALID: int assigned to int field
// INVALID: age: "25" (string) would cause compile error
```

**Rule 2: Array Homogeneity**

```melon
schema Data {
    values: array(int),
}

// VALID: [1, 2, 3]
// INVALID: [1, "2", 3] (mixed types)
```

**Rule 3: Enum Membership**

```melon
schema Status {
    state: enum(active, inactive, pending),
}

// VALID: state = active
// INVALID: state = running (not in enum)
```

**Rule 4: Schema Completeness**

```melon
schema Required {
    field1: string,
    field2: int,
}

// Compiled .cmp ensures LLM must provide both fields
// Missing fields cause runtime errors
```

---

## **8. The Pointer System Explained**

### **8.1 Pointer Syntax and Semantics**

A pointer in Melon is a dot-notation path that references a location in an imported JSON ontology:

**Syntax**:

```
<imported_name>.<path>.<to>.<value> as Pointer
```

**Components**:

1. `<imported_name>`: The identifier used in the import statement
2. `<path>.<to>.<value>`: JSON path to the target string
3. `as Pointer`: Type annotation marking this as a pointer

**Example Breakdown**:

```melon
import kb from "./knowledge.json"

persona {
    axiom: kb.persona.core_identity as Pointer,
          // ↑      ↑           ↑          ↑
          // import  JSON path  continues  type
}
```

### **8.2 Pointer Resolution Process**

**Step 1: Parse pointer syntax**

```melon
ontology.tools.search.purpose as Pointer
```

Compiler extracts:

- Import name: `ontology`
- Path: `tools.search.purpose`

**Step 2: Locate import**

```melon
import ontology from "./kb.json"
```

Compiler loads `./kb.json`

**Step 3: Navigate JSON path**

```json
{
    "tools": {
        "search": {
            "purpose": "Searches the database for relevant documents..."
        }
    }
}
```

Compiler navigates: root → tools → search → purpose

**Step 4: Extract value**
Value: `"Searches the database for relevant documents..."`

**Step 5: Validate type**
Must be a string. If it's an object, array, number, or boolean, compilation fails.

**Step 6: Embed in AST**
The pointer is replaced with the actual string in the Abstract Syntax Tree.

**Step 7: Compile to .cmp**
The string is embedded in the final .cmp output.

### **8.3 Pointer Validation**

The compiler performs rigorous validation:

**Validation 1: Import Exists**

```melon
persona {
    axiom: nonexistent.path as Pointer,  // ERROR: 'nonexistent' not imported
}
```

**Validation 2: Path Exists**

```json
{
    "persona": {
        "identity": "..."
    }
}
```

```melon
axiom: ontology.persona.nonexistent as Pointer,  // ERROR: path doesn't exist
```

**Validation 3: Value is String**

```json
{
    "data": {
        "count": 42  // Not a string
    }
}
```

```melon
axiom: ontology.data.count as Pointer,  // ERROR: target is number, not string
```

**Validation 4: No Circular References**
Ontology files cannot create circular import dependencies.

### **8.4 Advanced Pointer Patterns**

**Pattern 1: Conditional Pointers (via environment variables)**

**.mln**:

```melon
import ontology from "./kb_${ENV}.json"

persona {
    axiom: ontology.persona.identity as Pointer,
}
```

**kb_production.json**:

```json
{
    "persona": {
        "identity": "You are a production-grade financial analyst with strict compliance requirements..."
    }
}
```

**kb_development.json**:

```json
{
    "persona": {
        "identity": "You are a development assistant with verbose logging and debugging enabled..."
    }
}
```

Compile with:

```bash
ENV=production melonc build agent.mln
# or
ENV=development melonc build agent.mln
```

**Pattern 2: Shared Content Libraries**

Create reusable content components:

**common_axioms.json**:

```json
{
    "safety": "Never provide harmful, illegal, or unethical advice.",
    "accuracy": "Always strive for factual accuracy and cite sources when available.",
    "helpfulness": "Prioritize being helpful while respecting user autonomy."
}
```

**agent1.mln**:

```melon
import common from "../shared/common_axioms.json"
import specific from "./agent1_kb.json"

prompt "agent1:v1.0|mode:strict" {
    persona {
        axiom: common.safety as Pointer,
        // Additional agent-specific configuration
    }
}
```

**Pattern 3: Template-Based Content**

For dynamic content generation, use template markers in your ontology:

**kb.json**:

```json
{
    "greetings": {
        "formal": "Hello {{USER_NAME}}, I am your professional assistant.",
        "casual": "Hey {{USER_NAME}}, what can I help you with today?"
    }
}
```

Note: Template variable substitution happens at runtime in your application code, not during compilation.

---

## **9. Schema Definitions and Output Constraints**

### **9.1 Why Schemas Matter**

Schemas are the contract between your prompt and the LLM's output. They serve multiple critical purposes:

1. **Type Safety**: Ensures the LLM produces well-structured data
2. **Validation**: Enables automatic verification of outputs
3. **Token Efficiency**: Compressed schema representation in .cmp reduces prompt size
4. **Documentation**: Schemas self-document expected output format

**Without Schemas** (Natural Language):

```
Please respond with a JSON object containing:
- A summary (string)
- A list of key points (array of strings)
- A confidence score (number between 0 and 1)
```

Problems:

- Model may forget requirements mid-generation
- No enforcement of field names or types
- Verbose instruction consumes many tokens

**With Schemas** (Melon):

```melon
schema Response {
    summary: string,
    key_points: array(string),
    confidence: float,
}

proc {
    S0(init) -> S1(analyze) -> S2(format: Response)
}
```

The schema is embedded in the .cmp as a compact constraint that the LLM must satisfy.

### **9.2 Schema Declaration Syntax**

**Basic Schema**:

```melon
schema SchemaName {
    field_name: type,
    another_field: type,
}
```

**Field Naming Rules**:

- Must start with letter or underscore
- Can contain letters, numbers, underscores
- Case-sensitive (use consistent casing convention)
- snake_case recommended for consistency

**Type Annotations**:
Every field must have a type annotation. See Section 7 for complete type reference.

### **9.3 Complex Schema Examples**

**Example 1: Nested Analysis**

```melon
schema MarketAnalysis {
    ticker: string,
    current_price: float,
    analysis: DetailedAnalysis,
    recommendation: enum(buy, hold, sell),
}

schema DetailedAnalysis {
    trend: enum(bullish, bearish, neutral),
    support_level: float,
    resistance_level: float,
    key_factors: array(string),
}
```

**Example 2: Multi-Level Nesting**

```melon
schema Report {
    title: string,
    sections: array(Section),
    metadata: ReportMetadata,
}

schema Section {
    heading: string,
    content: string,
    subsections: array(Subsection),
}

schema Subsection {
    title: string,
    paragraphs: array(string),
}

schema ReportMetadata {
    author: string,
    created_date: string,
    version: string,
}
```

**Example 3: Optional Fields Pattern**

Melon doesn't have native optional field syntax, but you can use unions or sentinel values:

```melon
schema UserProfile {
    name: string,
    email: string,
    phone: string,  // Use empty string "" for "not provided"
    bio: string,    // Use empty string "" for "not provided"
}
```

Or use an enum to make optionality explicit:

```melon
schema Contact {
    email_status: enum(provided, not_provided),
    email: string,  // Empty if not_provided
}
```

### **9.4 Schema Usage in proc Block**

Schemas are referenced in the proc block to specify output formatting:

**Single Schema Output**:

```melon
schema Output {
    result: string,
}

proc {
    S0(init) -> S1(process) -> S2(format: Output)
}
```

The `format: Output` directive tells the compiler that S2 must produce output matching the Output schema.

**Multiple Possible Outputs**:

```melon
schema SuccessResponse {
    status: enum(success),
    data: json,
}

schema ErrorResponse {
    status: enum(error),
    error_message: string,
}

proc {
    S0(init) -> S1(process) -> S2(format: SuccessResponse | ErrorResponse)
}
```

Note: Union types in format directives are a proposed feature for Melon v2.0.

### **9.5 Schema Compilation**

When compiled to .cmp, schemas are heavily compressed:

**Source**:

```melon
schema Analysis {
    summary: string,
    confidence: float,
}
```

**Compiled** (conceptual representation):

```
SCH|An{s:s^c:f}
```

Breakdown:

- `SCH|` - Schema block signal
- `An` - Schema name compressed to 2 characters
- `{s:s^c:f}` - Fields: summary:string, confidence:float

This compression reduces token count while preserving complete structural information.

---

## **10. Persona Block: Quantitative Agent Identity**

### **10.1 The Persona Paradigm**

Traditional prompts define agent identity through prose:

```
You are a helpful, professional, and concise AI assistant.
You always strive for accuracy and cite your sources.
```

This approach has fatal flaws:

1. **Subjectivity**: "Professional" means different things to different models
2. **No Quantification**: Can't fine-tune behavior numerically
3. **Token Waste**: Verbose descriptions consume context window
4. **Inconsistency**: Behavior drifts during long conversations

Melon's persona block replaces prose with **quantitative parameters**:

```melon
persona {
    axiom: ontology.axioms.core_identity as Pointer,
    traits {
        professionalism: 0.9,
        verbosity: 0.3,
        creativity: 0.5,
    }
}
```

### **10.2 Persona Block Structure**

**Complete Syntax**:

```melon
persona {
    axiom: <pointer_to_core_identity>,
    traits {
        trait_name: float_value,  // 0.0 to 1.0
        another_trait: float_value,
    }
    example(positive, on: trait_name) {
        if: <pointer_to_input>,
        then: <pointer_to_desired_output>,
    }
    example(negative, on: trait_name) {
        if: <pointer_to_input>,
        then: <pointer_to_undesired_output>,
    }
}
```

### **10.3 The Axiom: Core Identity**

The axiom is a foundational statement that defines the agent's primary identity and purpose:

**Best Practices for Axioms**:

1. **Be Specific and Concrete**:

```json
// GOOD
"You are a financial analyst specializing in equity markets. Your primary function is to analyze publicly traded companies and provide data-driven investment insights."

// BAD (too vague)
"You are helpful and knowledgeable."
```

2. **Define Boundaries**:

```json
"You are a customer service agent for TechCorp. You handle product inquiries, troubleshooting, and billing questions. You do NOT provide technical support for competitor products, and you never share confidential company information."
```

3. **Establish Value Alignment**:

```json
"You are an AI research assistant. You prioritize factual accuracy above all else. When uncertain, you explicitly state your uncertainty and provide confidence levels. You never fabricate sources or data."
```

### **10.4 Traits: Quantitative Behavioral Parameters**

Traits define behavioral characteristics on a continuous scale from 0.0 to 1.0:

**Common Trait Patterns**:

```melon
traits {
    // Communication Style
    verbosity: 0.3,        // 0 = terse, 1 = verbose
    formality: 0.8,        // 0 = casual, 1 = formal
    technical_depth: 0.7,  // 0 = simple, 1 = technical
    
    // Behavioral Tendencies
    cautiousness: 0.9,     // 0 = bold, 1 = cautious
    creativity: 0.5,       // 0 = conservative, 1 = creative
    empathy: 0.8,          // 0 = analytical, 1 = empathetic
    
    // Task Approach
    thoroughness: 0.9,     // 0 = quick, 1 = thorough
    proactivity: 0.6,      // 0 = reactive, 1 = proactive
}
```

**Quantization in Compilation**:

Trait values are quantized during compilation:

- `0.0` → `0`
- `0.1-0.19` → `1`
- `0.2-0.29` → `2`
- ...
- `0.9-1.0` → `10`

This reduces each trait from 3-4 tokens to 1 token.

**Example Ontology Entry**:

```json
{
    "axioms": {
        "analyst_identity": "You are a senior financial analyst with 15+ years of experience in equity research. You provide objective, data-driven analysis of publicly traded companies. You never provide investment advice, only analytical insights."
    }
}
```

### **10.5 Examples: Few-Shot Learning with Context**

The example directive provides targeted few-shot learning tied to specific traits:

**Syntax**:

```melon
example(polarity, on: trait_name) {
    if: <pointer_to_scenario>,
    then: <pointer_to_response>,
}
```

**Polarity**: `positive` or `negative`

- **Positive**: This is HOW to embody the trait
- **Negative**: This is how NOT to behave (anti-pattern)

**Example: Professionalism Training**

**.mln**:

```melon
persona {
    axiom: ontology.axioms.support_agent as Pointer,
    traits {
        professionalism: 0.9,
    }
    example(positive, on: professionalism) {
        if: ontology.examples.prof_good.if as Pointer,
        then: ontology.examples.prof_good.then as Pointer,
    }
    example(negative, on: professionalism) {
        if: ontology.examples.prof_bad.if as Pointer,
        then: ontology.examples.prof_bad.then as Pointer,
    }
}
```

**ontology.json**:

```json
{
    "examples": {
        "prof_good": {
            "if": "User: This product is garbage! I want a refund NOW!",
            "then": "I understand your frustration, and I sincerely apologize for your negative experience. Let me help you process that refund immediately. Could you please provide your order number?"
        },
        "prof_bad": {
            "if": "User: This product is garbage! I want a refund NOW!",
            "then": "Whoa, calm down! No need to be rude. Fill out the refund form on our website."
        }
    }
}
```

**Why This Works**:

Research shows that few-shot examples tied to specific behavioral dimensions are significantly more effective than generic examples. By linking examples to traits, you:

1. Prime the model for specific behavioral patterns
2. Create clear contrasts between desired and undesired behaviors
3. Enable fine-grained control over multiple independent traits

### **10.6 Advanced Persona Patterns**

**Pattern 1: Multi-Trait Coordination**

Some traits naturally correlate:

```melon
persona {
    axiom: ontology.axioms.identity as Pointer,
    traits {
        technical_depth: 0.9,
        verbosity: 0.7,      // High tech depth usually needs more words
        formality: 0.8,      // Technical = formal
        creativity: 0.3,     // Technical = less creative, more precise
    }
}
```

**Pattern 2: Role-Based Trait Sets**

Define consistent trait patterns for different roles:

```melon
// CUSTOMER SERVICE AGENT
traits {
    empathy: 0.9,
    patience: 1.0,
    professionalism: 0.9,
    verbosity: 0.6,
    proactivity: 0.8,
}

// CODE REVIEWER
traits {
    technical_depth: 0.95,
    thoroughness: 0.9,
    constructiveness: 0.8,
    verbosity: 0.4,
    formality: 0.6,
}

// CREATIVE WRITER
traits {
    creativity: 0.95,
    verbosity: 0.7,
    formality: 0.3,
    empathy: 0.7,
    playfulness: 0.8,
}
```

**Pattern 3: Context-Adaptive Personas**

Use environment variables for context-dependent persona tuning:

```melon
import ontology from "./kb_${CONTEXT}.json"

persona {
    axiom: ontology.axioms.identity as Pointer,
    traits {
        formality: 0.9,  // Overridden by context
    }
}
```

**kb_executive.json**:

```json
{
    "axioms": {
        "identity": "You are an executive assistant serving C-level executives. Maximum formality and precision."
    }
}
```

**kb_intern.json**:

```json
{
    "axioms": {
        "identity": "You are a friendly mentor for interns. Be approachable and educational."
    }
}
```

---

## **11. Procedural Flow: State Machines in Detail**

### **11.1 Why Explicit State Machines?**

Traditional prompts rely on emergent reasoning:

```
First, carefully read the user's question.
Second, identify what information you need.
Third, gather that information using available tools.
Fourth, analyze the gathered data.
Finally, formulate a clear response.
```

Problems:

1. **No Enforcement**: Model may skip steps or reorder them
2. **Loop Risk**: Model might get stuck repeating steps
3. **No Checkpoints**: Can't verify completion of intermediate steps
4. **Debugging Difficulty**: Hard to identify where reasoning fails

Melon's proc block defines reasoning as an **explicit, deterministic state machine**:

```melon
proc {
    S0(init) -> S1(identify_needs) -> S2(gather_data) 
    -> S3(analyze) -> S4(formulate_response)
}
```

This is a **directed acyclic graph** (DAG) where:

- Each state represents a reasoning step
- Transitions (`->`) are deterministic and ordered
- No loops or cycles are allowed
- Terminal state must format output

### **11.2 State Definition Syntax**

**Basic State**:

```melon
S0(state_name)
```

**State with Tool Execution**:

```melon
S2(exec: tools.tool_name)
```

**Terminal State with Output Formatting**:

```melon
S4(format: SchemaName)
```

**State Naming Conventions**:

- Use descriptive, action-oriented names
- snake_case recommended
- Common patterns: `init`, `validate`, `process`, `analyze`, `format`

### **11.3 Complete proc Block Examples**

**Example 1: Simple Linear Flow**

```melon
proc {
    S0(init) -> S1(process) -> S2(format: Output)
}
```

Stages:

1. `S0`: Initialize, understand user request
2. `S1`: Process the request (main logic)
3. `S2`: Format output according to schema

**Example 2: Tool-Augmented Flow**

```melon
tools {
    tool fetch_data(query: string) -> json { }
    tool analyze_data(data: json) -> json { }
}

proc {
    S0(init) -> S1(validate_query) -> S2(exec: tools.fetch_data) 
    -> S3(exec: tools.analyze_data) -> S4(synthesize) -> S5(format: Report)
}
```

Stages:

1. `S0`: Understand user query
2. `S1`: Validate query is answerable
3. `S2`: Fetch data using tool
4. `S3`: Analyze fetched data using tool
5. `S4`: Synthesize insights
6. `S5`: Format final output

**Example 3: Complex Multi-Stage Analysis**

```melon
proc {
    S0(init) -> S1(parse_requirements) -> S2(decompose_problem) 
    -> S3(exec: tools.research_topic) -> S4(evaluate_sources) 
    -> S5(synthesize_findings) -> S6(identify_gaps) 
    -> S7(formulate_conclusions) -> S8(format: ResearchReport)
}
```

### **11.4 State Machine Semantics**

**Execution Semantics**:

1. **Sequential Execution**: States execute in the specified order
2. **No Backtracking**: Once a state completes, you cannot return to it
3. **No Conditionals**: State flow is fixed (no if/else branching)
4. **Single Path**: Exactly one path from S0 to terminal state

**Why No Conditionals?**

Melon intentionally avoids conditional branching to ensure determinism. If you need conditional logic, handle it at the application layer:

```javascript
// Application code
let compiledPrompt;
if (userNeedsDetailedAnalysis) {
    compiledPrompt = loadCmp("detailed_analyst.cmp");
} else {
    compiledPrompt = loadCmp("quick_analyst.cmp");
}
```

**Tool Execution States**:

When a state includes `exec: tools.tool_name`, the compiler:

1. Embeds the tool's full specification at that point in the state machine
2. Signals the LLM that tool calling is expected
3. Waits for tool execution before proceeding to next state

**Format States**:

The terminal state should include `format: SchemaName`:

```melon
S5(format: AnalysisOutput)
```

This:

1. Signals end of reasoning process
2. Enforces output must match schema
3. Enables automatic validation

### **11.5 State Machine Validation**

The compiler performs several validations:

**Validation 1: Completeness**

```melon
proc {
    S0(init) -> S1(process)
    // ERROR: No terminal state with format directive
}
```

**Validation 2: No Cycles**

```melon
proc {
    S0(init) -> S1(process) -> S0(init)
    // ERROR: Cycle detected
}
```

**Validation 3: Tool Exists**

```melon
proc {
    S1(exec: tools.nonexistent_tool)
    // ERROR: Tool not defined in tools block
}
```

**Validation 4: Schema Exists**

```melon
proc {
    S2(format: NonexistentSchema)
    // ERROR: Schema not defined
}
```

### **11.6 Advanced proc Patterns**

**Pattern 1: Research + Verification Flow**

```melon
proc {
    S0(init) -> S1(formulate_search_strategy) 
    -> S2(exec: tools.search_database) 
    -> S3(evaluate_source_reliability) 
    -> S4(cross_reference_facts) 
    -> S5(synthesize_verified_information) 
    -> S6(format: VerifiedReport)
}
```

**Pattern 2: Iterative Refinement (Simulated)**

While Melon doesn't support loops, you can simulate iterative refinement:

```melon
proc {
    S0(init) -> S1(draft_v1) -> S2(self_critique_v1) -> S3(draft_v2) 
    -> S4(self_critique_v2) -> S5(final_draft) -> S6(format: Output)
}
```

Each "version" is a distinct state, creating a fixed number of refinement cycles.

**Pattern 3: Parallel Consideration (Sequential Implementation)**

```melon
proc {
    S0(init) -> S1(consider_approach_a) -> S2(consider_approach_b) 
    -> S3(consider_approach_c) -> S4(compare_approaches) 
    -> S5(select_best) -> S6(format: Decision)
}
```

---

## **12. Tools Block: Function Definition and Tool Calling**

### **12.1 The Tool Calling Problem**

LLMs can call external functions, but tool calling is notoriously unreliable without proper specification:

**Common Failures**:

1. Wrong tool selected for task
2. Parameters passed in wrong format/type
3. Tool called at inappropriate time
4. Return value misinterpreted

Traditional approach (natural language):

```
Available tools:
- search_database(query): Searches our internal database
- send_email(to, subject, body): Sends an email
Use these tools when appropriate.
```

This is far too vague.

**Melon Solution**: Typed, richly-documented tool definitions with explicit parameter specifications and usage guidelines.

### **12.2 Tool Definition Syntax**

**Complete Syntax**:

```melon
tools {
    tool tool_name(param1: type1, param2: type2) -> return_type {
        purpose: <pointer>,
        behavior: <pointer>,
        when_to_use: <pointer>,
        parameters_guide: <pointer>,
        return_format: <pointer>,
        example_call: <pointer>,
        edge_cases: <pointer>,
    }
}
```

**Required Fields**:

- Tool name
- Parameters with types
- Return type
- At minimum: `purpose` field

**Recommended Fields**:

- `behavior`: Detailed description of what the tool does
- `when_to_use`: Conditions for tool usage
- `example_call`: Concrete example with real parameters

### **12.3 Parameter Type Specifications**

**All Primitive Types Supported**:

```melon
tool example_tool(
    text_param: string,
    count_param: int,
    score_param: float,
    flag_param: bool
) -> json { }
```

**Enum Parameters for Constrained Inputs**:

```melon
tool search_database(
    query: string,
    scope: enum(internal, public, archived),
    priority: enum(low, normal, high)
) -> json { }
```

This ensures the LLM can only pass valid enum values.

**Array Parameters**:

```melon
tool batch_process(
    items: array(string),
    weights: array(float)
) -> json { }
```

### **12.4 Return Type Specifications**

**json Return Type** (Most Common):

```melon
tool get_user_data(user_id: int) -> json {
    purpose: ontology.tools.get_user.purpose as Pointer,
}
```

Use `json` when:

- Return structure is complex or variable
- You don't need strict output validation for the tool itself
- Tool is maintained externally and return format may evolve

**Typed Return with Schema**:

```melon
schema UserData {
    id: int,
    name: string,
    email: string,
}

tool get_user_data(user_id: int) -> UserData {
    purpose: ontology.tools.get_user.purpose as Pointer,
}
```

Use typed returns when:

- You need compile-time validation of tool outputs
- Return structure is stable and well-defined
- You want schema enforcement end-to-end

### **12.5 Rich Tool Documentation Pattern**

**Comprehensive Tool Definition**:

**.mln**:

```melon
tools {
    tool query_financial_database(
        company_ticker: string,
        data_type: enum(earnings, balance_sheet, cash_flow, ratios),
        quarters: int
    ) -> json {
        purpose: ontology.tools.fin_db.purpose as Pointer,
        behavior: ontology.tools.fin_db.behavior as Pointer,
        when_to_use: ontology.tools.fin_db.when as Pointer,
        parameters: ontology.tools.fin_db.params as Pointer,
        return_format: ontology.tools.fin_db.returns as Pointer,
        example_call: ontology.tools.fin_db.example as Pointer,
        error_handling: ontology.tools.fin_db.errors as Pointer,
    }
}
```

**ontology.json**:

```json
{
    "tools": {
        "fin_db": {
            "purpose": "Retrieves historical financial data for publicly traded companies from our proprietary financial database.",
            
            "behavior": "This tool connects to the internal FIN-DB system and executes a structured query. It returns raw financial metrics in JSON format. The tool ONLY accesses publicly disclosed information from SEC filings and does not contain any proprietary or insider information.",
            
            "when": "Use this tool when: (1) The user explicitly requests financial metrics (revenue, profit, EPS, etc.), (2) You need historical trend data spanning multiple quarters, (3) The user mentions a specific company ticker symbol. DO NOT use this tool for: (1) General market commentary, (2) Real-time stock prices (use market_data tool instead), (3) Private companies or non-US companies.",
            
            "params": "company_ticker: The stock ticker symbol (e.g., 'AAPL', 'GOOGL'). Must be uppercase. data_type: The category of financial data to retrieve. quarters: Number of quarters of historical data to fetch (1-20). More quarters = more data but slower response.",
            
            "returns": "Returns a JSON object with structure: { \"ticker\": string, \"data_type\": string, \"periods\": [ { \"quarter\": string, \"metrics\": {...} } ] }. If ticker not found or data unavailable, returns {\"error\": \"description\"}.",
            
            "example": "To get 4 quarters of earnings data for Apple: query_financial_database(company_ticker: 'AAPL', data_type: earnings, quarters: 4)",
            
            "errors": "Common errors: (1) Invalid ticker (returns error), (2) quarters > 20 (returns error), (3) data_type not available for ticker (returns empty periods array), (4) Database timeout (returns error after 10s)."
        }
    }
}
```

This level of detail dramatically improves tool calling accuracy.

### **12.6 Tool Calling in proc Block**

**Explicit Tool Execution State**:

```melon
proc {
    S0(init) -> S1(determine_data_needs) 
    -> S2(exec: tools.query_financial_database) 
    -> S3(analyze_retrieved_data) -> S4(format: Output)
}
```

At S2, the LLM:

1. Receives signal that tool calling is expected
2. Has full access to tool documentation
3. Formulates tool call with appropriate parameters
4. Executes tool and receives results
5. Proceeds to S3 with tool output

**Multiple Tool States**:

```melon
proc {
    S0(init) -> S1(exec: tools.tool_a) -> S2(exec: tools.tool_b) 
    -> S3(synthesize) -> S4(format: Output)
}
```

Tools execute sequentially. Output of tool_a is available when calling tool_b.

### **12.7 Tool Calling Best Practices**

**Practice 1: One Tool Per Capability**

Don't create Swiss Army knife tools:

```melon
// BAD
tool do_everything(action: string, params: json) -> json { }

// GOOD
tool get_user(user_id: int) -> json { }
tool update_user(user_id: int, data: json) -> json { }
tool delete_user(user_id: int) -> bool { }
```

**Practice 2: Enum Parameters for Constrained Choices**

Instead of:

```melon
tool search(query: string, type: string) -> json {
    // type could be anything - error-prone
}
```

Use:

```melon
tool search(
    query: string,
    type: enum(user, product, document, transaction)
) -> json {
    // type is constrained - safer
}
```

**Practice 3: Verbose Documentation**

Research shows that verbose, explicit tool documentation significantly improves tool selection
