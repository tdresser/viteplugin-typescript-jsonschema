import { add } from './main';

// To keep typescript happy.
declare global {
  interface Window {
    ai: {
      registerTool: (...args: any[]) => string | void;
    };
  }
}

declare var DEDUCE_SCHEMA: (ty: string) => string;

// To prevent runtime exceptions.
window.ai = {
  registerTool: () => {},
};

window.ai.registerTool(add, DEDUCE_SCHEMA('AddParams'));
console.log(DEDUCE_SCHEMA('AddParams'));
