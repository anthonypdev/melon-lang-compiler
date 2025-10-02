# Melon Language Compiler Ecosystem

**A complete, production-grade compiler ecosystem for the Melon prompt programming language**

---

## 🍈 What is Melon?

Melon is a statically-typed, compilable programming language for architecting high-reliability LLM instructions. It transforms verbose natural language prompts into hyper-efficient, machine-native instruction sets with 70-80% token reduction.

**Key Benefits:**

- ✅ **Type-Safe**: Catch errors at compile-time, not runtime
- ✅ **Token-Efficient**: 70-80% reduction in token usage
- ✅ **Deterministic**: Explicit state machines ensure predictable behavior
- ✅ **Maintainable**: Clean separation of logic (.mln) and content (.json)

---

## 📦 Packages

This monorepo contains 5 packages:

### 1. **@melon-lang/core** (`packages/core/`)

Core compiler library with lexer, parser, type checker, and code generator.

### 2. **melonc** (`packages/melonc/`)

Command-line compiler for building .mln files to .cmp files.

### 3. **melon-language-server** (`packages/language-server/`)

LSP server providing IDE support with diagnostics, completion, and hover info.

### 4. **melon-vscode** (`packages/vscode-extension/`)

Official VS Code extension with syntax highlighting and integrated tooling.

### 5. **melon-playground** (`packages/playground/`)

Interactive web-based playground for learning and experimenting with Melon.

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies for all packages
npm install

# Build core library
cd packages/core
npm install

# Test the compiler with example
cd ../../examples
node ../packages/melonc/bin/melonc.js build basic-agent.mln
```

### Your First Melon Program

See `examples/basic-agent.mln` for a simple example or `examples/financial-analyst.mln` for an advanced example with tools.

---

## 📖 Documentation

- **[Melon Vision](Melon-Vision.md)** - Original language specification
- **[Melon Guide](Melon-Guide.md)** - Comprehensive reference guide
- **[Implementation Plan](plan.md)** - Technical implementation details

---

## 🏗️ Project Structure

```
melon-lang-compiler/
├── packages/
│   ├── core/                    # @melon-lang/core - Compiler core
│   ├── melonc/                  # CLI compiler
│   ├── language-server/         # LSP server
│   ├── vscode-extension/        # VS Code extension
│   └── playground/              # Web playground
├── examples/                    # Example .mln files
├── docs/                        # Documentation
└── tests/                       # Integration tests
```

---

## 🛠️ Development

### Build All Packages

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Development Mode

```bash
# Core library
npm run dev:core

# CLI compiler
npm run dev:cli

# Playground
npm run dev:playground
```

---

## 📝 Example Usage

### Compile a Melon file

```bash
melonc build agent.mln
# Output: agent.cmp
```

### Validate without compiling

```bash
melonc validate agent.mln
```

### Initialize new project

```bash
melonc init my-agent --template advanced
cd my-agent
melonc build agent.mln
```

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🔗 Links

- **GitHub**: <https://github.com/anthonypdev/melon-lang-compiler>
- **Documentation**: See Melon-Guide.md
- **Issues**: <https://github.com/anthonypdev/melon-lang-compiler/issues>
