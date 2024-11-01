import { defineStore } from 'pinia';
import axiosWithToken from '@/api/AxiosWithToken';
import type { SplitParams, SplitPart } from '@/stores/interfaces/SplitCreateInterfaces';
import type { Transaction } from '@/stores/interfaces/TransactionInterfaces';
import type { Friend } from '@/stores/interfaces/FriendInterfaces';

const SPLIT_CREATE_URL = '/api/v1/splits/outgoing';

export const useSplitCreateStore = defineStore('split-create', {
  state: () => ({
    total: 0 as Transaction['amount'],
    currentUserId: null as string | null,
    splitParts: [] as SplitPart[]
  }),
  actions: {
    async createSplit(transactionId: string) {
      try {
        const newSplit: SplitParams = {
          users: this.partsWithoutMe,
          splitId: crypto.randomUUID(),
          amount: this.sumWithoutMe,
          receipt: null,
          transactionId
        };
        await axiosWithToken.post(`${SPLIT_CREATE_URL}`, newSplit);
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    markSplitPartAsTouched(userId: string) {
      const part = this.splitParts.find((part) => part.userId === userId) as SplitPart;
      part.touched = true;
    },
    addToSplitPart(user: Friend) {
      this.splitParts.push({ ...user, amount: 0, touched: false });
      this.rebalanceSplitParts();
    },
    removeFromSplitPart(userId: string) {
      this.splitParts = this.splitParts.filter((part) => part.userId !== userId);
    },
    rebalanceSplitParts() {
      const touchedTotalCents = Math.round(
        this.splitParts
          .filter((part) => part.touched)
          .reduce((sum, part) => sum + part.amount * 100, 0)
      );

      const remainingCents = Math.round(this.total * 100) - touchedTotalCents;
      if (remainingCents <= 0) return;

      const untouchedParts = this.splitParts.filter((part) => !part.touched);

      if (untouchedParts.length > 0) {
        const baseAmountCents = Math.floor(remainingCents / untouchedParts.length);
        let extraCents = remainingCents - baseAmountCents * untouchedParts.length;

        untouchedParts.forEach((part) => {
          part.amount = (baseAmountCents + (extraCents > 0 ? 1 : 0)) / 100;
          if (extraCents > 0) extraCents--;
        });
      }
    }
  },
  getters: {
    sumWithoutMe: (state) => {
      return (
        state.splitParts
          .filter((part) => part.userId !== state.currentUserId)
          .reduce((sum, part) => sum + part.amount * 100, 0) / 100
      );
    },
    partsWithoutMe: (state) => {
      return state.splitParts.filter((part) => part.userId !== state.currentUserId);
    }
  }
});
