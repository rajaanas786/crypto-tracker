import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur border-b border-gray-800">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">💹 Crypto Tracker</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 rounded-xl px-3 py-2 w-40 sm:w-64 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search coins..."
          />
        </div>
      </header>

      <main className="w-full px-2 sm:px-4 py-6">
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-center text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800 text-left">
                  <th className="p-2 sm:p-3">Coin</th>
                  <th className="p-2 sm:p-3">Price</th>
                  <th className="p-2 sm:p-3">24h Change</th>
                  <th className="p-2 sm:p-3">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((coin) => (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-800 hover:bg-gray-900/40"
                  >
                    <td className="p-2 sm:p-3 flex items-center gap-2">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                      />
                      <Link
                        to={`/coin/${coin.id}`}
                        className="hover:underline"
                      >
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </Link>
                    </td>
                    <td className="p-2 sm:p-3">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td
                      className={`p-2 sm:p-3 ${
                        coin.price_change_percentage_24h > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {coin.price_change_percentage_24h !== null &&
                      coin.price_change_percentage_24h !== undefined
                        ? coin.price_change_percentage_24h.toFixed(2) + "%"
                        : "N/A"}
                    </td>
                    <td className="p-2 sm:p-3">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

export default Home;
