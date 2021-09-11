import { SIMILAR } from '../actionTypes';

const initialState = {
  similarType: ''
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SIMILAR:
      return { ...state, similarType: action.payload };
    default:
      return state;
  }
}

export default rootReducer;
