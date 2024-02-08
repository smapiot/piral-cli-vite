# Changelog

## 1.1.0 (February 8, 2024)

- Improved the documentation
- Added support for standard `vite.config.js` (or alternatives, e.g., `vite.config.ts`) within Vite (#7)
- Added support for pilet schema `v3`

## 1.0.3 (November 18, 2023)

- Fixed invalid reference to CSS stylesheet in pilet (#5)

## 1.0.2 (November 16, 2023)

- Fixed double usage of `vite.config.js` (#4)
- Added `process.env.NODE_ENV` to automatically exposed variables

## 1.0.1 (November 8, 2023)

- Fixed support for source maps in pilets (#3)

## 1.0.0 (July 6, 2023)

- Fixed support in `piral-cli` 1.0.0 (#2)
- Fixed issue to support Angular 16 (#1)
- Updated to use Vite v4

## 0.15.2 (July 6, 2023)

- Changed standard configuration to place assets directly in output folder

## 0.15.1 (January 17, 2023)

- Fixed issue with `vite-plugin-codegen` to have static options
- Fixed empty outdir - will be cleaned up by `piral-cli`

## 0.15.0 (November 17, 2022)

- Initial release
