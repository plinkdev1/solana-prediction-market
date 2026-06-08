import { create } from 'zustand';
import type { TokenType } from './types';

type TxStatus = 'idle' | 'pending' | 'success' | 'error';

interface BetState {
  selectedSide: 'yes' | 'no' | null;
  amount: number;
  tokenType: TokenType;
  pendingTx: string | null;
  txStatus: TxStatus;
  txError: string | null;
  setSelectedSide: (side: 'yes' | 'no' | null) => void;
  setAmount: (amount: number) => void;
  setTokenType: (tokenType: TokenType) => void;
  setPendingTx: (txHash: string | null) => void;
  setTxStatus: (status: TxStatus) => void;
  setTxError: (error: string | null) => void;
  reset: () => void;
}

export const useBetStore = create<BetState>((set) => ({
  selectedSide: null,
  amount: 0,
  tokenType: 'DATX',
  pendingTx: null,
  txStatus: 'idle',
  txError: null,
  setSelectedSide: (side) => set({ selectedSide: side }),
  setAmount: (amount) => set({ amount }),
  setTokenType: (tokenType) => set({ tokenType }),
  setPendingTx: (txHash) => set({ pendingTx: txHash }),
  setTxStatus: (status) => set({ txStatus: status }),
  setTxError: (error) => set({ txError: error }),
  reset: () => set({
    selectedSide: null,
    amount: 0,
    tokenType: 'DATX',
    pendingTx: null,
    txStatus: 'idle',
    txError: null,
  }),
}));
