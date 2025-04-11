import Paymanai from "paymanai";

export async function GET() {
  function getRandomInterest(min: number, max: number) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  const faceInterest = getRandomInterest(2, 5);
  const storeInterest = getRandomInterest(4.5, 8.25);
  const txnCost = getRandomInterest(40, 50);

  const facePayman = new Paymanai({
    xPaymanAPISecret: process.env.FACE_PAYMAN_SECRET!,
  });
console.log( process.env.FACE_PAYMAN_SECRET);
  const storePayman = new Paymanai({
    xPaymanAPISecret: process.env.STORE_PAYMAN_SECRET!,
  });
console.log(process.env.STORE_PAYMAN_SECRET);
  // Change currency from "USD" to "TSD" if that's what you need
  const faceTsdBalance = await facePayman.balances.getSpendableBalance("TSD");
  const storeTsdBalance = await storePayman.balances.getSpendableBalance("TSD");

  return Response.json({
    faceInterest: `${faceInterest}%`,
    storeInterest: `${storeInterest}%`,
    txnCost: `${txnCost}`,
    faceTsdBalance,
    storeTsdBalance,
  });
}
