import { add } from './main';

declare global {
  interface Window {
    readonly ai: {
      registerTool: (...args: any[]) => string | void;
    };
  }
}

// To keep typescript happy.
declare var DEDUCE_SCHEMA: (ty: string) => string;

window.ai.registerTool(add, DEDUCE_SCHEMA('AddParams'));
console.log(DEDUCE_SCHEMA('AddParams'));
