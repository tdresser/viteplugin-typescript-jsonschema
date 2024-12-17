import { defineConfig } from 'vite';
import * as TJS from 'typescript-json-schema';
import { resolve } from 'path';

// These need to be converted from regexes to something more stateful, e.g., to handle parens within the arguments to DEDUCE_SCHEMA.
const imperativeRegistrationRegex = /DEDUCE_SCHEMA\(["']([^)]*)["']\)/gms;

const declarativeSchemaRegex =
  /<script type="tool-registration">(.*?)<\/script>/gms;

const buildJSONSchemasPlugin = () => {
  const program = TJS.getProgramFromFiles([resolve('src/main.ts')], {});
  const schemaGenerator = TJS.buildGenerator(program);
  console.log(schemaGenerator?.getUserSymbols());
  return {
    name: 'build-json-schemas-plugin',
    transform(src: string, id: string) {
      if (/\.ts$/.test(id)) {
        return src.replaceAll(imperativeRegistrationRegex, (_, typename) => {
          const schema = schemaGenerator?.getSchemaForSymbol(typename);
          return JSON.stringify(schema, null, 2);
        });
      }
    },
    transformIndexHtml(html: string) {
      return html.replaceAll(
        declarativeSchemaRegex,
        (_, toolRegistrationStr) => {
          const toolRegistration = JSON.parse(toolRegistrationStr);
          const typename = toolRegistration.params;
          const schema = schemaGenerator?.getSchemaForSymbol(typename);
          toolRegistration.params = schema;
          return `<script type="tool-registration">${JSON.stringify(
            toolRegistration,
            null,
            2
          )}</script>`;
        }
      );
    },
  };
};

export default defineConfig({
  plugins: [buildJSONSchemasPlugin()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        test: resolve(__dirname, 'test.html'),
      },
    },
  },
});
