import { defineConfig } from 'vite'
import * as TJS from 'typescript-json-schema'
import { resolve } from 'path'

const declarativeSchemaRegex =
  /<script type="tool-registration">(.*?)<\/script>/ms

const buildJSONSchemasPlugin = () => {
  const program = TJS.getProgramFromFiles([resolve('src/main.ts')], {})
  const schemaGenerator = TJS.buildGenerator(program)
  return {
    name: 'build-json-schemas-plugin',
    //transform(src: string, id: string) {
    //      if (/\.html$/.test(id)) {
    transformIndexHtml(html) {
      const toolRegistrationStr = html.match(declarativeSchemaRegex)![1]
      const toolRegistration = JSON.parse(toolRegistrationStr)
      const schema = schemaGenerator?.getSchemaForSymbol(
        toolRegistration.params
      )
      toolRegistration.params = schema
      const substituted = html.replace(
        declarativeSchemaRegex,
        `<script type="tool-registration">${JSON.stringify(
          toolRegistration,
          null,
          2
        )}</script>`
      )
      return substituted
    },
    //},
  }
}

export default defineConfig({
  plugins: [buildJSONSchemasPlugin()],
})
