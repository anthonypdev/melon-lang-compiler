# **Melon Prompt Language (Melon)**

Melon: Melon is ErLang inspired Object Notation.

## **Official Documentation (v1.0)**

### **Overview**

Melon is a **prompt-oriented programming language** for architecting high-reliability, production-grade instructions for Large Language Models (LLMs). It represents a paradigm shift away from traditional natural language and markup-based prompting, advocating instead for a statically-typed, compilable language that yields hyper-efficient, machine-native instruction sets. This approach is born from the necessity to move beyond crafting prompts as an art form and into the engineering discipline of building predictable, verifiable systems.

Melon is engineered to solve the core challenges of deploying LLMs at scale: **predictability, cost-efficiency, and semantic integrity.** It achieves this by treating system prompts not as descriptive text, but as low-level operational code. In traditional prompting, an LLM expends valuable computational resources interpreting ambiguous prose, which can lead to inconsistent behavior (drift), factual inaccuracies (hallucination), and vulnerability to adversarial inputs. Melon mitigates these risks by providing instructions in a format that is already aligned with the model's internal processing logic.

The developer writes in a clear, modern syntax within a .mln (Melon Language Notation) file, focusing on logic and structure. The Melon compiler then transforms this source into a dense, non-human-legible .cmp (Compiled Melon Prompt) file. This compiled artifact is a single, continuous line of bytecode-like instructions, optimized to minimize token count and reduce the cognitive load on the LLM's tokenizer and attention mechanisms.

**Key Features:**

* **Verifiable & Type-Safe:** Melon's compiler statically analyzes your prompt's structure, catching errors such as broken pointers, schema mismatches, or logical inconsistencies before they ever reach the model. This eliminates entire classes of runtime failures and ensures that the instructions sent to the LLM are always syntactically correct and structurally sound, which is critical for mission-critical applications.  
* **Extreme Token Efficiency:** The compiler performs aggressive serialization and symbolic compression. By replacing verbose keywords with minimal symbols, quantizing numerical values, and eliminating all non-essential characters, it typically reduces token counts by **70-80%** compared to an equivalent prose-based prompt. This directly lowers API costs and frees up the context window for more dynamic, task-relevant information.  
* **Guaranteed Semantic Integrity:** The core challenge of using symbolic pointers is ensuring they don't lose their meaning. Melon's two-file system—separating prompt logic (.mln) from its verbose content (an external ontology.json)—solves this. The compiler resolves and embeds the content during a build step, guaranteeing that the meaning of a pointer is locked in and immutable, preventing "pointer decay" or misinterpretation.  
* **Predictable by Design:** Melon makes advanced control structures first-class citizens of the language. Abstract concepts like state machines, meta-prompting, and attention control, which are difficult to implement reliably in natural language, are expressed with explicit syntax. This allows developers to build complex and deterministic agentic systems whose behavior can be audited and predicted.

This document details the design rationale, syntax, compiler behavior, and best practices for Melon.

### **Table of Contents**

1. Design Principles (The "Why")  
2. The Melon Ecosystem: .mln and .json  
3. Language Syntax: Writing .mln  
4. The Ontology File: Managing Content  
5. The Compiler: From .mln to .cmp  
6. The .cmp Format Explained  
7. Best Practices & Advanced Patterns  
8. Worked Example: Full Compilation  
9. CLI Usage & Validation  
10. Glossary

## **1\. Design Principles**

Melon's architecture is a direct implementation of modern research into machine-parsable LLM control. Its design is grounded in the following engineering principles:

* **Configuration as Code, Not Prose:** All model behavior—persona, reasoning, tool usage—is defined with explicit, typed syntax. This forces clarity of thought and eliminates the ambiguity, implicit bias, and cultural context laden in natural language instructions. The result is a system that behaves consistently across different model versions and fine-tuning runs.  
* **Pointers Over Words:** To achieve maximum token compression and reduce the LLM's parsing burden, verbose instructions and descriptions are stored in an external ontology.json file. These are referenced in the prompt logic via Pointer types. The compiler resolves these at build time, allowing the LLM to operate on compact, pre-processed symbols while preserving the rich semantic context required for complex tasks. This is analogous to how modern software uses variables and constants instead of hardcoding values.  
* **Separation of Logic and Content:** The .mln file contains the *how* (the operational logic, control flow, and structure), while the .json ontology contains the *what* (the natural language data, examples, and descriptions). This separation is crucial for team-based development, allowing engineers to focus on the prompt's architecture while content experts or localization teams can manage the text in the ontology without risk of breaking the core logic.  
* **Explicit State and Procedure:** Agentic reasoning is too fragile to be left to implicit interpretation. While techniques like Chain-of-Thought are powerful, they are emergent and not guaranteed. Melon requires the developer to define the agent's execution flow as an explicit **State Machine** in the proc block. This makes the reasoning path deterministic, auditable, and less prone to derailment from unexpected user inputs.  
* **Compilation as an Integrity Check:** The Melon compiler (melonc) is not just a compressor; it's a linter and type-checker for your prompt. It enforces a strict contract between your logic, your ontology, and the language specification. It guarantees that the compiled .cmp artifact is structurally sound and semantically coherent, giving you confidence that what you send to the model is precisely what you intended.

## **2\. The Melon Ecosystem**

A Melon project consists of two core files working in tandem to create a single, powerful instruction set. This separation is fundamental to Melon's philosophy of maintainability and clarity.

1. **The Logic File (.mln):** The human-readable source file where you define the prompt's architecture, logic, types, and procedures using Melon's clear, declarative programming syntax. This file is the single source of truth for the agent's behavior and should be kept under version control like any other critical source code.  
2. **The Ontology File (.json):** A simple, structured key-value store containing all the verbose, natural-language strings—such as detailed descriptions, few-shot examples, axiomatic statements, and tool usage guidelines—that the .mln file will reference. This file is designed to be easily editable, even by non-programmers.

This two-file system ensures that the operational code in the .mln file remains clean, symbolic, and focused on control flow, while the bulky, language-dependent content in the .json file is managed separately. This modularity is essential for building complex, multi-language, or multi-persona agents.

## **3\. Language Syntax: Writing .mln**

A .mln file is structured like a modern source code file, using clear keywords and typed declarations to ensure robustness and readability for the developer.

### **3.1. Header and Imports**

Every .mln file begins with an import statement to link to its ontology and a prompt declaration to define metadata. This header provides essential context for both the compiler and for version tracking.

// Import the knowledge base for this agent. The path is relative to the .mln file.  
import ontology from "./agent\_kb.json"

// Define the prompt's name, version, and operational mode.  
// This is compiled into the .cmp header for traceability and debugging.  
prompt "financial\_analyst:v3.2|mode:strict" {  
    // ... prompt blocks go here  
}

### **3.2. meta Block**

The optional meta block configures compiler behavior and injects integrity checks into the compiled output. These directives enhance the reliability and observability of the LLM's operation.

meta {  
    // Instructs the compiler to generate and embed a SHA-256 checksum of the  
    // resolved prompt content. This allows for runtime verification.  
    checksum: true,

    // Instructs the model to append a quantitative confidence score to its output,  
    // enabling programmatic assessment of the response's reliability.  
    confidence\_token: true,  
}

### **3.3. schema Declarations**

Melon is statically typed. You **must** declare the expected output structure using one or more schema blocks. The compiler uses this to generate a hyper-compressed output constraint in the .cmp file, which drastically reduces the likelihood of the LLM returning malformed or incomplete data.

// A schema for a single stock analysis entry.  
schema StockAnalysis {  
    ticker: string,  
    recommendation: enum(Buy, Hold, Sell),  
    price\_target: float,  
}

// A more complex schema that uses the one above.  
schema AnalysisOutput {  
    summary: string,  
    key\_findings: array(string),  
    analysis\_breakdown: array(StockAnalysis), // Nesting schemas is supported.  
    confidence\_score: float,  
}

Supported types include string, int, float, bool, array(type), and enum(value1, value2).

### **3.4. persona Block**

This block defines the agent's identity and behavioral traits quantitatively, replacing vague prose with precise, machine-readable parameters.

persona {  
    // A pointer to a core axiomatic statement in the ontology.  
    axiom: ontology.axioms.analyst\_identity as Pointer,

    // Traits are defined as key-value pairs with float values from 0.0 to 1.0.  
    // The compiler quantizes these to single integers (0-9) for efficiency.  
    // This allows for fine-grained, reproducible control over the agent's tone.  
    traits {  
        candor: 1.0,  
        professionalism: 0.9,  
        verbosity: 0.3,  
    }

    // Few-shot examples are explicitly linked to a specific trait for conditioning.  
    // This is more effective than providing generic, untargeted examples.  
    example(positive, on: professionalism) {  
        if: ontology.examples.prof\_p1.if as Pointer,  
        then: ontology.examples.prof\_p1.then as Pointer,  
    }  
    example(negative, on: professionalism) {  
        if: ontology.examples.prof\_n1.if as Pointer,  
        then: ontology.examples.prof\_n1.then as Pointer,  
    }  
}

### **3.5. proc Block (Procedural Flow)**

This required block defines the agent's reasoning process as an explicit state machine. This is a direct implementation of Meta-Prompting, ensuring the LLM follows a consistent, auditable, and predictable logical sequence. It prevents the model from "wandering" or getting stuck in loops.

proc {  
    // Defines the "grammar" of the thought process from start to finish.  
    // Each state can optionally be tied to a tool or output schema, acting as a checkpoint.  
    S0(init) \-\> S1(validate\_query) \-\> S2(exec: tools.fetch\_quarterly\_data) \-\> S3(analyze\_data) \-\> S4(format: AnalysisOutput)  
}

### **3.6. tools Block**

This block defines the functions available to the agent. The syntax is clear, typed, and includes pointers for rich, descriptive context that aids the model in correct tool selection.

tools {  
    // A tool is defined like a function signature with typed parameters and a return type.  
    tool fetch\_quarterly\_data(company\_ticker: string, quarter: string) \-\> json {  
        // Pointers link to verbose, natural-language descriptions in the ontology.  
        // Research shows that verbose, clear descriptions significantly improve tool selection accuracy.  
        purpose: ontology.tools.q\_data.purpose as Pointer,  
        behavior: ontology.tools.q\_data.behavior as Pointer,  
        // It's good practice to include an example of how to call the tool.  
        example\_call: ontology.tools.q\_data.example as Pointer,  
    }  
}

## **4\. The Ontology File (.json)**

The ontology is a simple JSON file that decouples content from logic. It's where you store all the text that the .mln file references. This design is critical for maintainability and collaboration.

**Example agent\_kb.json:**

{  
  "axioms": {  
    "analyst\_identity": "You are a world-class financial analyst. Your responses are objective, data-driven, and concise. You never provide financial advice, only data-backed analysis."  
  },  
  "examples": {  
    "prof\_p1": {  
      "if": "The user asks a vague question about market trends.",  
      "then": "To provide the most accurate analysis, could you please specify the market sector and time frame you are interested in?"  
    },  
    "prof\_n1": {  
      "if": "The user asks a vague question about market trends.",  
      "then": "I don't know, be more specific."  
    }  
  },  
  "tools": {  
    "q\_data": {  
      "purpose": "Retrieves official quarterly earnings data for a publicly traded company from a secure, internal financial database.",  
      "usage": "Use this tool ONLY when the user explicitly asks for financial figures, revenue, profit, EPS, or other specific metrics from a quarterly report for a specific company and quarter.",  
      "behavior": "Returns a JSON object containing the requested financial data. If the data for the specified ticker or quarter does not exist, it will return a \`null\` value.",  
      "example": "To get data for Apple's Q4 2024, the call would be \`fetch\_quarterly\_data(company\_ticker: 'AAPL', quarter: 'Q4-2024')\`."  
    }  
  }  
}

## **5\. The Compiler: From .mln to .cmp**

The melonc compiler is a sophisticated tool that performs a multi-stage transformation to create the final .cmp artifact.

1. **Parsing & Static Analysis:** It first parses the .mln file into an Abstract Syntax Tree (AST) and performs rigorous type-checking and validation. It will throw a compile-time error if pointers are broken, schemas are misused, types are mismatched, or if the procedural flow is illogical (e.g., states with no path).  
2. **Pointer Resolution:** It reads the imported ontology.json and strategically injects the content into the AST. The original Pointer references are replaced with the actual string values, effectively "inlining" the content into the logical structure.  
3. **Assembly & Compression:** It traverses the final, resolved AST and generates the .cmp file. This is the "lossy" compression step where human readability is sacrificed for machine efficiency. It performs:  
   * **Keyword-to-Symbol Mapping:** persona \-\> PER, proc \-\> PRC, candor \-\> ca. Every language keyword is mapped to a 2 or 3 character symbol.  
   * **Quantization:** Trait values 0.9 \-\> 9\. This converts floating-point numbers into single integers.  
   * **Whitespace & Syntax Annihilation:** All non-essential characters, including spaces, newlines, and comments, are stripped away.  
   * **Structure Serialization:** The entire prompt is flattened into a single line with specialized, non-natural delimiters to create an unambiguous, easy-to-parse instruction sequence.

## **6\. The .cmp Format Explained**

The .cmp file is a single-line string of machine code for the LLM. It is not meant to be read or edited by humans. Its structure is rigid, predictable, and optimized for fast parsing.

Example .cmp output:  
HDR|v:3.2^m:strict^c:a1b2§PER|AX:You are...^T:ca=10,pr=9,ve=3^EX:+pr(if...|then...)^EX:-pr(if...|then...)§PRC|S0\>S1\>S2\>S3§TLS|fqd(ct:s,q:s)\>j§SCH|AO{s:s^kf:a(s)^cs:f}

* **Delimiters (§, |, ^):** These are carefully chosen, token-efficient characters that are rarely used in natural language. They create unambiguous boundaries between instructions, eliminating any possibility of parsing errors or instruction blending. § separates major blocks, | separates headers from content, and ^ separates key-value pairs or list items.  
* **Signal Map Prefixes (HDR|, PER|, PRC|):** These act as **semantic anchors** or "opcodes". They provide a high-level signal to the LLM's attention mechanism, indicating the start of a new, distinct instruction block (e.g., "now you are receiving persona instructions"). This priming helps the model allocate its resources more effectively.  
* **Content:** All resolved content from the ontology is embedded directly within this hyper-compressed structure. The model receives the full semantic context, but without the token overhead of verbose formatting.

## **7\. Best Practices & Advanced Patterns**

* **Ontology Organization:** For complex agents, split your ontology into multiple files (e.g., persona.json, tools.json) and import them separately in your .mln file for better organization.  
* **Versioning:** Treat both your .mln and .json files as critical source code. Use Git for version control and always update the version number in the prompt header when making significant changes.  
* **Modular Prompts:** Create a library of common schemas and tool definitions in a shared Melon project that can be imported by multiple agents to ensure consistency across your ecosystem.  
* **Debugging:** If an agent behaves unexpectedly, trust the .cmp file is a faithful compilation. The error is in your .mln logic or .json content. Use melonc validate to check for structural errors first. Then, simplify your proc block to isolate which state is causing the issue.

## **8\. Worked Example: Full Compilation**

**analyst.mln:**

import ontology from "./analyst\_kb.json"  
prompt "analyst:v1.0|mode:strict" {  
    meta { checksum: true }  
    schema Output { summary: string, confidence: float }  
    persona {  
        axiom: ontology.axiom as Pointer,  
        traits { professionalism: 1.0, verbosity: 0.2 }  
    }  
    proc { S0(init) \-\> S1(analyze) \-\> S2(format: Output) }  
}

**analyst\_kb.json:**

{ "axiom": "You are an analyst." }

Compiled analyst.cmp:  
HDR|v:1.0^m:strict^c:d4e5§PER|AX:You are an analyst.^T:pr=10,ve=2§PRC|S0\>S1\>S2§SCH|O{s:s^c:f}

## **9\. CLI Usage**

The Melon compiler is a standalone command-line tool, typically installed via a package manager.

\# Install the compiler globally  
npm install \-g melon-compiler

\# Compile a .mln file into a .cmp file  
melonc build my\_agent.mln  
\# Output: my\_agent.cmp will be created in the same directory.

\# Run validation without creating a .cmp file. This is fast and useful for CI/CD pipelines.  
melonc validate my\_agent.mln  
\# Output: "Validation successful." or a list of errors.

## **10\. Glossary**

* **Melon (.mln):** The human-readable, statically-typed prompt programming language.  
* **Ontology (.json):** An external file storing all natural language content, referenced by the .mln file.  
* **Pointer:** A type in Melon (as Pointer) used to reference content within the ontology.  
* **Compiler (melonc):** The tool that transforms .mln files into .cmp files.  
* **Compiled Melon Prompt (.cmp):** The hyper-efficient, non-human-legible instruction set fed directly to the LLM.  
* **Signal Map:** The top-level prefixes in a .cmp file (PER|, PRC|) that anchor the LLM's attention and signal the type of the subsequent instruction block.  
* **Quantization:** The process of converting a floating-point trait value (e.g., 0.9) into a more token-efficient integer (e.g., 9).