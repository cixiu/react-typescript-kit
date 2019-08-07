import { Action } from 'redux';
import * as types from '../actionTypes';

export interface CountAction extends Action {
  type: string;
  num: number;
}

const count = (state = 0, action: CountAction): number => {
  switch (action.type) {
    case types.COUNT:
      return state + action.num;
    default:
      return state;
  }
};

export default count;
