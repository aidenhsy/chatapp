import { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  schema: 'http://localhost:6001/graphql',
  documents: ['src/graphql/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/__generated__/': {
      preset: 'client',
      plugins: [],
    },
  },
};
export default config;
