"use client";

interface MoreWaysToSendCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: "paid" | "enterprise";
}

export default function MoreWaysToSendCard({ icon, title, description, badge }: MoreWaysToSendCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#4a4d52] shrink-0">
          {icon}
        </div>
        {badge && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] text-xs font-medium shrink-0">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            {badge === "paid" ? "Paid" : "Enterprise"}
          </span>
        )}
      </div>
      <h4 className="text-sm font-semibold text-[#282a2e] mb-1">{title}</h4>
      <p className="text-xs text-[#6b7280] leading-relaxed">{description}</p>
    </div>
  );
}
