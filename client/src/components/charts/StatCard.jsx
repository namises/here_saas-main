import React from "react";
import { Sparkline } from "./index";

const trendColor = (t) => (t > 0 ? "text-emerald-500" : t < 0 ? "text-rose-500" : "text-gray-400");

const StatCard = ({ label, value, Icon, accent = "#3b82f6", trend, trendData, suffix, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 transition-transform group-hover:scale-125" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
            {value}
            {suffix ? <span className="ml-1 text-sm font-medium text-gray-400">{suffix}</span> : null}
          </p>
        </div>
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${accent}1a`, color: accent }}>
            <Icon size="1.3rem" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between">
        {typeof trend === "number" ? (
          <span className={`text-xs font-semibold ${trendColor(trend)}`}>
            {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {Math.abs(trend)}%
          </span>
        ) : (
          <span />
        )}
        {trendData?.length ? <Sparkline data={trendData} color={accent} width={80} height={26} /> : null}
      </div>
    </div>
  );
};

export default StatCard;
