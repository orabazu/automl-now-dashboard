/* eslint-disable no-unused-vars */
export type AccountState = {
  isLoading: boolean;
  account: {
    address: string;
    balance: string;
  } | null;
};

const initialState: AccountState = {
  account: null,
  isLoading: false,
};

export enum AccountActionTypes {
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_IS_ACCOUNT_LOADING = 'SET_IS_ACCOUNT_LOADING',
  SET_ACCOUNT_FAILURE = 'SET_ACCOUNT_FAILURE',
}

export type AccountAction =
  | {
      type: AccountActionTypes.SET_ACCOUNT;
      payload: { address: string; balance: string } | null;
    }
  | { type: AccountActionTypes.SET_IS_ACCOUNT_LOADING; payload: boolean }
  | { type: AccountActionTypes.SET_ACCOUNT_FAILURE };

const reducer = (state: AccountState, action: AccountAction): AccountState => {
  switch (action.type) {
    case AccountActionTypes.SET_ACCOUNT:
      return {
        ...state,
        account: action.payload,
      };
    case AccountActionTypes.SET_ACCOUNT_FAILURE:
      return {
        ...state,
        account: null,
      };
    case AccountActionTypes.SET_IS_ACCOUNT_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export { initialState, reducer };
