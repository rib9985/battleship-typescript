# 🚀 Webpack Template 2.0

A opinionated webpack template for developing in Vanilla Typescript.
## Building 
```bash
pnpm install
pnpm webpack
```

## Available Scripts
```bash
    "dev": "node --loader ts-node/esm src/index.ts",
    "prestart": "pnpm run build",
    "test": "jest",
    "jest": "jest",
    "build": "webpack",
    "watch": "webpack --watch",
    "start": "webpack serve --open",
    "debug": "webpack -d --mode development"
```
## Common Issues
- Dependencies may not be correctly installed (rm -rf node_modules, pnpm install for fresh install)
