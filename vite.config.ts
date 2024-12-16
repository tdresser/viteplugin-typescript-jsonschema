import { defineConfig } from 'vite';
import * as TJS from 'typescript-json-schema';
import { resolve } from 'path';

// These need to be converted from regexes to something more stateful, e.g., to handle parens within the arguments to DEDUCE_SCHEMA.
const imperativeRegistrationRegex = /DEDUCE_SCHEMA\(["']([^)]*)["']\)/ms;

const declarativeSchemaRegex =
  /<script type="tool-registration">(.*?)<\/script>/ms;

const buildJSONSchemasPlugin = () => {
  const program = TJS.getProgramFromFiles([resolve('src/main.ts')], {});
  const schemaGenerator = TJS.buildGenerator(program);
  return {
    name: 'build-json-schemas-plugin',
    enforce: 'pre',
    transform(src: string, id: string) {
      if (/\.ts$/.test(id)) {
        const matches = src.match(imperativeRegistrationRegex);
        if (!matches) {
          return src;
        }
        const typename = matches[1];
        const schema = schemaGenerator?.getSchemaForSymbol(typename);
        console.log('TEST');
        // @ts-ignore
        src = src.replace(
          imperativeRegistrationRegex,
          JSON.stringify(schema, null, 2)
        );
        return src;
      }
    },
    transformIndexHtml(html: string) {
      const matches = html.match(declarativeSchemaRegex);
      if (!matches) {
        return html;
      }
      const toolRegistrationStr = matches[1];
      const toolRegistration = JSON.parse(toolRegistrationStr);
      const typename = toolRegistration.params;
      const schema = schemaGenerator?.getSchemaForSymbol(typename);
      toolRegistration.params = schema;
      const substituted = html.replace(
        declarativeSchemaRegex,
        `<script type="tool-registration">${JSON.stringify(
          toolRegistration,
          null,
          2
        )}</script>`
      );
      return substituted;
    },
  };
};

export default defineConfig({
  plugins: [buildJSONSchemasPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        test: resolve(__dirname, 'test.html'),
      },
    },
  },
});
