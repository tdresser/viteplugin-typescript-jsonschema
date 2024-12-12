import { defineConfig } from 'vite'
import * as TJS from "typescript-json-schema";
import { resolve } from "path";

const buildJSONSchemasPlugin = () => {
    const program = TJS.getProgramFromFiles(
        [resolve("src/main.ts")],{}
      );
    const schemaGenerator = TJS.buildGenerator(program);
    return {
      name: 'build-json-schemas-plugin',
      transformIndexHtml(html:string) {
        const toolRegistrationStr = html.match(/<script type="tool-registration">(.*?)<\/script>/sm)![1];
        const toolRegistration = JSON.parse(toolRegistrationStr);
        const schema = schemaGenerator?.getSchemaForSymbol("AddParams");
        toolRegistration.params = schema;
        return `<script type="tool-registration">${JSON.stringify(toolRegistration, null, 2)}</script>`
      },
    }
  }

export default defineConfig({
    plugins: [buildJSONSchemasPlugin()]
})