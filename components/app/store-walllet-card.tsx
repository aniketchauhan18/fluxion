import { WalletCards } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  interest: number;
  balance: number;
  txnCost: number;
}

export default function StoreWalletCard({ interest, balance, txnCost }: Props) {
  return (
    <div className="border p-5 space-y-3 rounded-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-medium">Store Wallet Card</div>
          <p className="text-neutral-400 text-sm">Secondary fund account</p>
        </div>
        <div className="px-3 text-xs rounded-full py-1 bg-green-100 text-green-500">
          Active
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="w-10 shadow-none h-10 rounded-full"
        >
          <WalletCards />
        </Button>
        <div>
          <p className="text-neutral-500 text-sm">Current Balance</p>
          <p className="font-bold">${balance}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="border-2 rounded-md bg-neutral-50 border-neutral-100 p-2">
          <div className="text-neutral-600 text-sm">APY</div>
          <div className="font-bold">{interest}%</div>
        </div>
        <div className="border-2 rounded-md bg-neutral-50 border-neutral-100 p-2">
          <div className="text-neutral-600 text-sm">Txn Cost</div>
          <div className="font-bold">${txnCost }</div>
        </div>
      </div>
    </div>
  );
}
