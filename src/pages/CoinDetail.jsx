import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function CoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch coin detail
  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        if (!res.ok) throw new Error("Failed to fetch coin");
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id]);

  // fetch coin chart
  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );
        const data = await res.json();
        const formatted = data.prices.map((p) => ({
          time: new Date(p[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: p[1],
        }));
        setChartData(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChart();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/" className="text-indigo-400 hover:underline">
        ← Back
      </Link>

      {/* Coin Header */}
      <div className="flex items-center gap-4 mt-4">
        <img src={coin.image.large} alt={coin.name} className="w-12 h-12" />
        <h2 className="text-2xl font-bold">
          {coin.name} ({coin.symbol.toUpperCase()})
        </h2>
      </div>

      <p className="mt-4 text-gray-300">
        Current Price:{" "}
        <span className="font-semibold">
          ${coin.market_data.current_price.usd.toLocaleString()}
        </span>
      </p>
      <p className="mt-2 text-gray-300">
        Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}
      </p>

      {/* Chart */}
      <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">7 Day Price Chart</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">Loading chart...</p>
        )}
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-400 text-sm">
        {coin.description.en
          ? coin.description.en.split(". ")[0] + "."
          : "No description available."}
      </p>
    </div>
  );
}

export default CoinDetail;
