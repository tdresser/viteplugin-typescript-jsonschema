import { AddParams } from './addParams';
import { NegateParams } from './negateParams';

export function add(v: AddParams): number {
  return v.a + v.b;
}

export function negate(v: NegateParams): number {
  return -v.a;
}
