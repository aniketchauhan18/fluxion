export async function GET() {
  function getRandomTransaction(min: number, max: number) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Ivy", "Jack", "Kevin", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Riley", "Sophia", "Toby", "Uma", "Vera", "Willow", "Xander", "Yara", "Zoe"];
  const countries = ["USA", "India", "Germany", "Canada", "Brazil", "UK", "France", "Australia", "Japan", "UAE", "Singapore", "South Africa", "Mexico", "Italy", "Spain", "Netherlands", "Sweden", "Norway", "Finland", "Denmark", "Russia"];
  const mediums = ["USDC", "USDT"];

  const transactions = [];

  let totalCredit = 0;
  let totalDebit = 0;

  for (let i = 0; i < 100; i++) {
    const name = getRandomItem(names);
    const creditAmount = getRandomTransaction(50, 70);
    const country = getRandomItem(countries);
    const medium = getRandomItem(mediums);
    const email = `${name.toLowerCase()}${i}@example.com`;

    transactions.push({
      type: "CR",
      amount: creditAmount,
      name,
      email,
      country,
      medium,
    });
    totalCredit += creditAmount;
  }

  for (let i = 0; i < 110; i++) {
    const name = getRandomItem(names);
    const debitAmount = getRandomTransaction(50, 70);
    const country = getRandomItem(countries);
    const medium = getRandomItem(mediums);
    const email = `${name.toLowerCase()}${i + 100}@example.com`;

    transactions.push({
      type: "DR",
      amount: debitAmount,
      name,
      email,
      country,
      medium,
    });
    totalDebit += debitAmount;
  }

  // Shuffle using Fisher-Yates
  for (let i = transactions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [transactions[i], transactions[j]] = [transactions[j], transactions[i]];
  }

  const netBalance = parseFloat((totalCredit - totalDebit).toFixed(2));

  return Response.json({
    transactions,
    totalCredit: totalCredit.toFixed(2),
    totalDebit: totalDebit.toFixed(2),
    netBalance,
  });
}
