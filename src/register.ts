import { add } from './main';
import { negate } from './main';

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
window.ai.registerTool(negate, DEDUCE_SCHEMA('NegateParams'));

const output = document.getElementById('output')!;
output.innerHTML += JSON.stringify(DEDUCE_SCHEMA('AddParams'), null, 2);
output.innerHTML += JSON.stringify(DEDUCE_SCHEMA('NegateParams'), null, 2);
