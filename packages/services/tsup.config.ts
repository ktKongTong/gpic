import { defineConfig, Options } from 'tsup'
export default defineConfig((options) => {
  const commonOptions: Partial<Options> = {
    entry: [
      'src/**/*.[jt]s',
      'src/**/*.[jt]sx',
      '!./src/**/*.d.ts',
      '!./src/**/*.test.[jt]s',
      '!./src/**/*.spec.[jt]s',
      '!./src/**/*.test.[jt]sx',
      '!./src/**/*.spec.[jt]sx'
    ],
    platform: 'node',
    target: 'es6',
    splitting: false,
    bundle: false,
    sourcemap: true,
    clean: true,
    outExtension: (ctx) => {
      return { js: '.js', dts: '.d.ts' };
    },
    ...options,
  }
  return [
    // types
    {
      ...commonOptions,
      outDir: './dist/types/',
      format: ['esm'],
      dts: {
        only: true,
      },

    },
    {
      ...commonOptions,
      format: ['esm'],
      outDir: './dist/esm/',
      bundle: false,
      dts: false,
    },
    {
      ...commonOptions,
      format: ['cjs'],
      outDir: './dist/cjs/',
    },
  ]
})