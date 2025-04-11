// Dashboard.js (Server Component)
import FaceWalletCard from "@/components/app/face-wallet-card";
import Navbar from "@/components/app/navbar";
import StoreWalletCard from "@/components/app/store-walllet-card";
import { columns } from "@/components/app/table/columns";
import DataTable from "@/components/app/table/data-table";
import { getSession } from "@/lib/data";
import { instrumentSerif } from "@/lib/fonts";
import ProfitButton from "@/components/app/ProfitButton";

export default async function Dashboard() {
  const user = await getSession();

  // Fetch transactions
  async function getTransactions() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return res.json();
  }

  async function getProfits() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profit-update`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch profits: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log(data);

      // Validate response structure
      if (!data.profitArray || !Array.isArray(data.profitArray)) {
        throw new Error("Invalid response format: Missing or invalid profitArray");
      }

      return data.profitArray; // Returns the array of profits
    } catch (error) {
      console.error("Error fetching profits:", error);
      throw error; // Re-throw the error for higher-level handling
    }
  }


  // Fetch interest + balances
  async function getInterestAndBalances() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/interest`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch interest and balances");
    }
    return res.json();
  }

  const txnRes = await getTransactions();
  const transactions = txnRes.transactions;

  async function getProfit(movableBalance: any, apyDifference: any, txncost: any) {
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

  // 🧨 API call 1
  const {
    faceInterest,
    storeInterest,
    faceTsdBalance,
    storeTsdBalance,
    txnCost,
  } = await getInterestAndBalances();

  // Calculate estimated spend once for components that need it
  const baseSpend = 800 - txnRes.netBalance;
  // Generate a unique random value for FaceWalletCard
  const faceWalletRandom = Number(Math.random().toPrecision(2));
  const estimatedSpendFaceWallet = baseSpend + 500 * faceWalletRandom;
  const totalExpense = 250;

  const profit1 = await getProfit(
    faceTsdBalance - estimatedSpendFaceWallet - totalExpense,
    storeInterest - faceInterest,
    txnCost
  );

  // 🧨 API call 2
  const {
    faceInterest: faceInterest2,
    storeInterest: storeInterest2,
    faceTsdBalance: faceTsdBalance2,
    storeTsdBalance: storeTsdBalance2,
    txnCost: txnCost2,
  } = await getInterestAndBalances();

  const profit2 = await getProfit(
    faceTsdBalance2 - estimatedSpendFaceWallet - totalExpense,
    storeInterest2 - faceInterest2,
    txnCost2
  );

  // 🧨 API call 3
  const {
    faceInterest: faceInterest3,
    storeInterest: storeInterest3,
    faceTsdBalance: faceTsdBalance3,
    storeTsdBalance: storeTsdBalance3,
    txnCost: txnCost3,
  } = await getInterestAndBalances();

  const profit3 = await getProfit(
    faceTsdBalance3 - estimatedSpendFaceWallet - totalExpense,
    storeInterest3 - faceInterest3,
    txnCost3
  );

  // 🧨 API call 4
  const {
    faceInterest: faceInterest4,
    storeInterest: storeInterest4,
    faceTsdBalance: faceTsdBalance4,
    storeTsdBalance: storeTsdBalance4,
    txnCost: txnCost4,
  } = await getInterestAndBalances();

  const profit4 = await getProfit(
    faceTsdBalance4 - estimatedSpendFaceWallet - totalExpense,
    storeInterest4 - faceInterest4,
    txnCost4
  );

  console.log(faceInterest, storeInterest, faceTsdBalance, storeTsdBalance);

  // Generate unique estimated spend values for each ExpensesTableWrapper instance
  const estimatedSpendWrapper1 = baseSpend + 500 * Number(Math.random().toPrecision(2));
  const estimatedSpendWrapper2 = baseSpend + 500 * Number(Math.random().toPrecision(2));
  const estimatedSpendWrapper3 = baseSpend + 500 * Number(Math.random().toPrecision(2));

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
            <div className="text-sm">
              Next Month Spend
            </div>
            <div className="flex justify-end text-green-600 underline underline-offset-2">
              ${estimatedSpendFaceWallet.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <FaceWalletCard
            interest={faceInterest}
            balance={faceTsdBalance}
            txnCost={txnCost}
          />
          <StoreWalletCard
            interest={storeInterest}
            balance={storeTsdBalance}
            txnCost={txnCost}
          />
        </div>
      </section>

      <section className="space-y-5 mt-10 gap-5">
          <DataTable data={transactions} columns={columns} />
          <div className="grid flex-col md:grid-cols-2 text-neutral-600 gap-5">
            <div className="rounded-lg space-y-1 border-2 border-neutral-100 bg-neutral-50">
            <div className={`${instrumentSerif.className} border-b-2 border-neutral-100 text-2xl lg:text-3xl bg-white p-5 rounded-t-lg`}>
              Funds Overview
            </div>
            <div className="p-5 space-y-1 bg-neutral-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  Total Credit
                </div>
                <div className="text-green-600">
                  $ {txnRes.totalCredit}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  Total Debit
                </div>
                <div className="text-red-600">
                  $ {txnRes.totalDebit}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  Net Balance
                </div>
                <div className="text-red-600">
                  $ {(txnRes.totalCredit - txnRes.totalDebit).toFixed(2)}
                </div>
              </div>
            </div>
            </div>
            <div className="rounded-lg border-2 p-5 border-neutral-100 bg-neutral-50">

            </div>

          </div>
      </section>
    </main>
  );
}
