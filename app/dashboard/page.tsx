// Dashboard.tsx (Server Component)
import FaceWalletCard from "@/components/app/face-wallet-card";
import Navbar from "@/components/app/navbar";
import StoreWalletCard from "@/components/app/store-walllet-card";
import { columns } from "@/components/app/table/columns";
import DataTable from "@/components/app/table/data-table";
import { getSession } from "@/lib/data";
import { instrumentSerif } from "@/lib/fonts";
import ExpensesTableWrapper from "@/components/app/ExpenseTableWrapper"; // Client component
import ProfitButton from "@/components/app/ProfitButton";
import DashboardTable from "./data-table";

// Define types for the API responses (update these interfaces to match your API)
interface TransactionsResponse {
  transactions: any[]; // update as needed
  netBalance: number;
  totalCredit: number;
  totalDebit: number;
}

interface InterestResponse {
  faceInterest: string; // e.g., "5%"
  storeInterest: string; // e.g., "7%"
  faceTsdBalance: number;
  storeTsdBalance: number;
  txnCost: number;
}

type ProfitType = number; // profit is just a number in our case

export default async function Dashboard() {
  const user = await getSession();

  // Fetch transactions
  async function getTransactions(): Promise<TransactionsResponse> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return res.json();
  }

  // Fetch profits from your local API (if needed)
  async function getProfits(): Promise<number[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/profit-update`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch profits: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.profitArray || !Array.isArray(data.profitArray)) {
      throw new Error("Invalid response format: Missing or invalid profitArray");
    }
    return data.profitArray;
  }

  // Fetch interest and balances
  async function getInterestAndBalances(): Promise<InterestResponse> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/interest`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch interest and balances");
    }
    return res.json();
  }

  // Calculate profit from the external model
  async function getProfit(
    movableBalance: number,
    apyDifference: number,
    txncost: number
  ): Promise<ProfitType> {
    const res = await fetch("https://model-k35o.onrender.com/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movableBalance, apyDifference, txncost }),
    });
    const data = await res.json();
    if (data?.profit !== undefined) return data.profit;
    if (data?.loss !== undefined) return -Math.abs(data.loss);
    return 0;
  }

  // --- MAIN LOGIC ---
  const txnRes = await getTransactions();
  const transactions = txnRes.transactions;

  // Get first set of interest and balance data
  const interestData1 = await getInterestAndBalances();
  const { faceInterest, storeInterest, faceTsdBalance, storeTsdBalance, txnCost } = interestData1;

  // Calculate estimated spend for FaceWalletCard
  const baseSpend: number = 800 - txnRes.netBalance;
  const faceWalletRandom: number = Number(Math.random().toPrecision(2));
  const estimatedSpendFaceWallet: number = baseSpend + 500 * faceWalletRandom;
  const totalExpense: number = 250;

  // Calculate profits with 4 API calls
  const profit1: ProfitType = await getProfit(
    faceTsdBalance - estimatedSpendFaceWallet - totalExpense,
    parseFloat(storeInterest.replace("%", "")) - parseFloat(faceInterest.replace("%", "")),
    txnCost
  );

  // API call 2: re-fetch interest data if necessary (or consider caching if data is similar)
  const interestData2 = await getInterestAndBalances();
  const profit2: ProfitType = await getProfit(
    interestData2.faceTsdBalance - estimatedSpendFaceWallet - totalExpense,
    parseFloat(interestData2.storeInterest.replace("%", "")) - parseFloat(interestData2.faceInterest.replace("%", "")),
    interestData2.txnCost
  );

  // API call 3
  const interestData3 = await getInterestAndBalances();
  const profit3: ProfitType = await getProfit(
    interestData3.faceTsdBalance - estimatedSpendFaceWallet - totalExpense,
    parseFloat(interestData3.storeInterest.replace("%", "")) - parseFloat(interestData3.faceInterest.replace("%", "")),
    interestData3.txnCost
  );

  // API call 4
  const interestData4 = await getInterestAndBalances();
  const profit4: ProfitType = await getProfit(
    interestData4.faceTsdBalance - estimatedSpendFaceWallet - totalExpense,
    parseFloat(interestData4.storeInterest.replace("%", "")) - parseFloat(interestData4.faceInterest.replace("%", "")),
    interestData4.txnCost
  );

  // Generate unique estimated spend values for each ExpensesTableWrapper instance
  const estimatedSpendWrapper1: number = baseSpend + 500 * Number(Math.random().toPrecision(2));
  const estimatedSpendWrapper2: number = baseSpend + 500 * Number(Math.random().toPrecision(2));
  const estimatedSpendWrapper3: number = baseSpend + 500 * Number(Math.random().toPrecision(2));
  const estimatedSpendWrapper4: number = baseSpend + 500 * Number(Math.random().toPrecision(2));

  return (
    <main className="py-16 px-5">
      <header>
        <Navbar />
      </header>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className={`text-3xl ${instrumentSerif.className}`}>
              Dashboard
            </div>
            <p>Welcome {user?.name}</p>
          </div>
          <div>
            <div className="text-sm">Next Month Spend</div>
            <div className="flex justify-end text-green-600 underline underline-offset-2">
              ${estimatedSpendFaceWallet.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <FaceWalletCard
            interest={parseInt(faceInterest)}
            balance={faceTsdBalance}
            txnCost={txnCost}
          />
          <StoreWalletCard
            interest={parseInt(storeInterest)}
            balance={storeTsdBalance}
            txnCost={txnCost}
          />
        </div>
      </section>

      <section className="mt-10 space-y-10">
        <DataTable data={transactions} columns={columns} />
        <div className="grid gap-5 grid-cols-1">
          {/* Card 1 */}
          <div className="rounded-lg border-2 border-neutral-100 bg-neutral-50 p-5">
            <ExpensesTableWrapper
              index={1}
              faceBalance={faceTsdBalance}
              estimatedSpend={estimatedSpendWrapper1}
              faceInterest={faceInterest}
              storeInterest={storeInterest}
              txnCost={txnCost}
            />
            <ProfitButton effYield={profit1} />
          </div>
        </div>

      </section>
    </main>
  );
}
