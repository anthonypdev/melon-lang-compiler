# Melon Prompt Language

*A comprehensive summary of the Melon language vision and specification*

---

## Overview

**Melon** (Melon is ErLang inspired Object Notation) is a prompt-oriented programming language designed for architecting high-reliability, production-grade instructions for Large Language Models (LLMs). It represents a paradigm shift from natural language prompting to a statically-typed, compilable language that produces hyper-efficient, machine-native instruction sets.

## Core Philosophy

Melon treats system prompts as **low-level operational code** rather than descriptive text, solving critical challenges in LLM deployment:

- **Predictability**: Deterministic behavior through explicit control structures
- **Cost-efficiency**: 70-80% token reduction through aggressive compression
- **Semantic integrity**: Guaranteed meaning preservation through compile-time pointer resolution

### The Two-File System

Melon projects consist of two essential components:

1. **.mln (Melon Language Notation)**: Human-readable source file containing prompt logic, architecture, types, and procedures
2. **.json (Ontology)**: Structured key-value store containing all verbose natural-language content that .mln files reference

This separation enables clean logic in .mln files while keeping content manageable in .json files, facilitating team collaboration and localization.

---

## 1. Design Principles

Melon's architecture implements modern research in machine-parsable LLM control through five core principles:

### Configuration as Code, Not Prose

All model behavior (persona, reasoning, tool usage) is defined with explicit, typed syntax, eliminating ambiguity and ensuring consistency across model versions.

### Pointers Over Words

Verbose instructions live in external ontology.json files and are referenced via Pointer types. The compiler resolves these at build time, allowing compact operation while preserving semantic context.

### Separation of Logic and Content

- **.mln files** contain the *how*: operational logic, control flow, structure
- **.json files** contain the *what*: natural language data, examples, descriptions

### Explicit State and Procedure

Agent execution flow is defined as an explicit **State Machine** in the proc block, making reasoning paths deterministic, auditable, and resilient to unexpected inputs.

### Compilation as Integrity Check

The melonc compiler acts as both compressor and validator, enforcing strict contracts between logic, ontology, and language specification.

---

## 2. The Melon Ecosystem

A complete Melon project requires both files working together:

- **Logic File (.mln)**: Single source of truth for agent behavior, under version control
- **Ontology File (.json)**: Editable by non-programmers, contains all natural language strings

This modularity is essential for complex, multi-language, or multi-persona agents.

---

## 3. Language Syntax: Writing .mln Files

### 3.1 Header and Imports

Every .mln file begins with an import statement and prompt declaration:

```melon
import ontology from "./agent_kb.json"
prompt "financial_analyst:v3.2|mode:strict" {
    // prompt blocks go here
}
```

### 3.2 meta Block

Optional block configuring compiler behavior and integrity checks:

```melon
meta {
    checksum: true,           // Generate SHA-256 checksum
    confidence_token: true,   // Model appends confidence score
}
```

### 3.3 schema Declarations

Statically-typed output structure declarations (required):

```melon
schema StockAnalysis {
    ticker: string,
    recommendation: enum(Buy, Hold, Sell),
    price_target: float,
}
```

Supported types: `string`, `int`, `float`, `bool`, `array(type)`, `enum(value1, value2)`

### 3.4 persona Block

Defines agent identity and behavioral traits quantitatively:

```melon
persona {
    axiom: ontology.axioms.analyst_identity as Pointer,
    traits {
        candor: 1.0,           // Values 0.0-1.0, quantized to 0-9
        professionalism: 0.9,
        verbosity: 0.3,
    }
    example(positive, on: professionalism) {
        if: ontology.examples.prof_p1.if as Pointer,
        then: ontology.examples.prof_p1.then as Pointer,
    }
}
```

### 3.5 proc Block (Required)

Defines agent's reasoning as explicit state machine:

```melon
proc {
    S0(init) -> S1(validate_query) -> S2(exec: tools.fetch_quarterly_data) 
    -> S3(analyze_data) -> S4(format: AnalysisOutput)
}
```

### 3.6 tools Block

Defines available functions with typed parameters:

```melon
tools {
    tool fetch_quarterly_data(company_ticker: string, quarter: string) -> json {
        purpose: ontology.tools.q_data.purpose as Pointer,
        behavior: ontology.tools.q_data.behavior as Pointer,
        example_call: ontology.tools.q_data.example as Pointer,
    }
}
```

---

## 4. The Ontology File

Simple JSON structure storing all text that .mln files reference:

```json
{
  "axioms": {
    "analyst_identity": "You are a world-class financial analyst..."
  },
  "examples": {
    "prof_p1": {
      "if": "The user asks a vague question about market trends.",
      "then": "To provide the most accurate analysis, could you please specify..."
    }
  },
  "tools": {
    "q_data": {
      "purpose": "Retrieves official quarterly earnings data...",
      "behavior": "Returns a JSON object containing the requested financial data...",
      "example": "To get data for Apple's Q4 2024..."
    }
  }
}
```

---

## 5. The Compiler: melonc

The melonc compiler performs multi-stage transformation from .mln to .cmp:

### Stage 1: Parsing & Static Analysis

- Parses .mln into Abstract Syntax Tree (AST)
- Performs rigorous type-checking and validation
- Throws compile-time errors for:
  - Broken pointers
  - Schema mismatches
  - Type mismatches
  - Illogical procedural flow

### Stage 2: Pointer Resolution

- Reads imported ontology.json
- Injects content into AST
- Replaces Pointer references with actual string values
- Effectively "inlines" content into logical structure

### Stage 3: Assembly & Compression

Aggressive serialization and symbolic compression:

- **Keyword-to-Symbol Mapping**: `persona` → `PER`, `proc` → `PRC`, `candor` → `ca`
- **Quantization**: Trait values `0.9` → `9` (floats to single integers)
- **Whitespace & Syntax Annihilation**: Removes all non-essential characters
- **Structure Serialization**: Flattens to single line with specialized delimiters

---

## 6. The .cmp Format

The compiled .cmp file is a single-line, machine-optimized instruction set for LLMs.

### Example Output

```
HDR|v:3.2^m:strict^c:a1b2§PER|AX:You are...^T:ca=10,pr=9,ve=3^EX:+pr(if...|then...)§PRC|S0>S1>S2>S3§TLS|fqd(ct:s,q:s)>j§SCH|AO{s:s^kf:a(s)^cs:f}
```

### Structure Components

**Delimiters**:

- `§` separates major blocks
- `|` separates headers from content
- `^` separates key-value pairs or list items

**Signal Map Prefixes** (semantic anchors):

- `HDR|` - Header information
- `PER|` - Persona instructions
- `PRC|` - Procedural flow
- `TLS|` - Tools definitions
- `SCH|` - Schema constraints

**Design**: Token-efficient characters create unambiguous boundaries, eliminating parsing errors while priming the LLM's attention mechanism.

---

## 7. Best Practices & Advanced Patterns

### Ontology Organization

- Split complex ontologies into multiple files (persona.json, tools.json)
- Import separately in .mln for better organization

### Versioning

- Treat .mln and .json as critical source code
- Use Git for version control
- Update version numbers in prompt header for significant changes

### Modular Prompts

- Create libraries of common schemas and tool definitions
- Import across multiple agents for consistency

### Debugging

- Trust .cmp file as faithful compilation
- Errors are in .mln logic or .json content
- Use `melonc validate` to check structural errors
- Simplify proc block to isolate problematic states

---

## 8. Worked Example: Full Compilation

**Input: analyst.mln**

```melon
import ontology from "./analyst_kb.json"
prompt "analyst:v1.0|mode:strict" {
    meta { checksum: true }
    schema Output { summary: string, confidence: float }
    persona {
        axiom: ontology.axiom as Pointer,
        traits { professionalism: 1.0, verbosity: 0.2 }
    }
    proc { S0(init) -> S1(analyze) -> S2(format: Output) }
}
```

**Input: analyst_kb.json**

```json
{ "axiom": "You are an analyst." }
```

**Output: analyst.cmp**

```
HDR|v:1.0^m:strict^c:d4e5§PER|AX:You are an analyst.^T:pr=10,ve=2§PRC|S0>S1>S2§SCH|O{s:s^c:f}
```

---

## 9. CLI Usage & Validation

### Installation

```bash
npm install -g melon-compiler
```

### Commands

**Build**: Compile .mln to .cmp

```bash
melonc build my_agent.mln
# Output: my_agent.cmp created in same directory
```

**Validate**: Check without compiling (fast, CI/CD friendly)

```bash
melonc validate my_agent.mln
# Output: "Validation successful." or error list
```

---

## 10. Key Terminology

| Term | Definition |
|------|------------|
| **Melon (.mln)** | Human-readable, statically-typed prompt programming language |
| **Ontology (.json)** | External file storing all natural language content |
| **Pointer** | Type in Melon (`as Pointer`) referencing ontology content |
| **Compiler (melonc)** | Tool transforming .mln files into .cmp files |
| **Compiled Melon Prompt (.cmp)** | Hyper-efficient, non-human-legible LLM instruction set |
| **Signal Map** | Top-level prefixes (PER\|, PRC\|) anchoring LLM attention |
| **Quantization** | Converting float values (0.9) to integers (9) for efficiency |

---

## Key Features Summary

✅ **Verifiable & Type-Safe**: Static analysis catches errors before reaching model  
✅ **Extreme Token Efficiency**: 70-80% reduction in token counts  
✅ **Guaranteed Semantic Integrity**: Two-file system prevents pointer decay  
✅ **Predictable by Design**: Explicit control structures enable deterministic behavior  
✅ **Production-Ready**: Designed for mission-critical LLM applications at scale

---

**Melon v1.0** - Moving prompt engineering from art to engineering discipline.
