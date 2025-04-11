import { Button } from "../ui/button";
import { WalletCards } from "lucide-react";

interface Props {
  interest: number;
  balance: number;
  txnCost: number;
}

export default function FaceWalletCard({ interest, balance, txnCost }: Props) {
  return (
    <div className="border p-5 space-y-3 rounded-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-medium">Face Wallet Card</div>
          <p className="text-neutral-400 text-sm">Primary fund account</p>
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
          <p className="font-bold">${balance ?? "0.00"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="border-2 rounded-md bg-neutral-50 border-neutral-100 p-2">
          <div className="text-neutral-600">APY</div>
          <div className="font-bold">{interest ?? "0.00"}%</div>
        </div>
        <div className="border-2 rounded-md bg-neutral-50 border-neutral-100 p-2">
          <div className="text-neutral-600">Txn Cost</div>
          <div className="font-bold">${txnCost ?? "0.00"}</div>
        </div>
      </div>
    </div>
  );
}
