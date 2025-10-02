# Project: Melon Prompt Language Compiler Ecosystem

## Project Overview

The Melon Prompt Language Compiler Ecosystem is a monorepo designed for developing and compiling the Melon prompt programming language. Melon (Melon is ErLang inspired Object Notation) is a statically-typed, compilable language aimed at creating high-reliability, production-grade instructions for Large Language Models (LLMs). It promotes a "two-file system" where `.mln` files contain the prompt logic, architecture, types, and procedures, and `.json` files (Ontology) store verbose natural-language content referenced by the `.mln` files. This separation enhances predictability, cost-efficiency (through token reduction), and semantic integrity in LLM deployments.

The ecosystem comprises several key packages:
- `core`: Contains the core compiler logic, including lexer, parser, analyzer, optimizer, and code generator.
- `language-server`: Provides language server capabilities for IDE integration.
- `melonc`: The Command Line Interface (CLI) compiler for Melon.
- `playground`: A web-based playground for interacting with the Melon language.
- `vscode-extension`: A VS Code extension for Melon language support.

**Main Technologies:**
- JavaScript/Node.js
- npm Workspaces (for monorepo management)
- Jest (for testing)

## Building and Running

This project uses npm workspaces for managing its various packages.

### Installation

To install all project dependencies:
```bash
npm install
```

### Building

To build all packages in the monorepo:
```bash
npm run build
```

### Testing

To run tests for all packages:
```bash
npm test
```

To run tests for a specific package (e.g., `melonc`):
```bash
npm test -w melonc
```

### Cleaning

To remove `dist` and `node_modules` directories across all packages:
```bash
npm run clean
```

### Development Scripts

Individual packages can be developed using specific `dev` scripts:
- `npm run dev:core`: For the `@melon-lang/core` package.
- `npm run dev:cli`: For the `melonc` package.
- `npm run dev:lsp`: For the `melon-language-server` package.
- `npm run dev:playground`: For the `melon-playground` package.

### CLI Usage (melonc)

The `melonc` package provides a command-line interface for compiling and validating Melon files.

**Compile a Melon file:**
```bash
melonc build <file.mln>
```

**Validate a Melon file (without compiling):**
```bash
melonc validate <file.mln>
```

## Development Conventions

- **Monorepo Structure:** The project is organized as a monorepo using npm workspaces.
- **Two-File System:** Adherence to the Melon language's core philosophy of separating logic (`.mln` files) from content (`.json` ontology files).
- **Version Control:** `.mln` and `.json` files are treated as critical source code and are managed with Git.
- **Testing:** Jest is the primary testing framework.
- **Code Style:** (Inferring from `markdownlint-cli` dev dependency) Markdown files are linted, suggesting a focus on consistent documentation style. Further code style guidelines for JavaScript/TypeScript would likely be defined in configuration files (e.g., ESLint, Prettier) if present.
