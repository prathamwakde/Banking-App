export default function StatCard({ label, value, tone = "plain" }) {
  return (
    <div className={`stat stat-${tone}`}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
