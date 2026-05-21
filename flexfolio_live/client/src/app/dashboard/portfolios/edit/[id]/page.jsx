"use client";

import { useParams } from "next/navigation";

export default function EditPortfolioPage() {
  const params = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">
        Edit Portfolio
      </h1>

      <p className="text-neutral-400 mb-8">
        Editing portfolio ID: {params.id}
      </p>

      {/* Load Existing Builder Data Here */}
    </div>
  );
}