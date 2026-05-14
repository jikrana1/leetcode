
import React from "react";

function Solutions({ problem }) {
  const solutions = problem?.referenceSolution || [];

  return (
    <div className="w-full">

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

        {solutions.map((sol, index) => (
          <div
            key={index}
            className="bg-[#0f172a] border border-gray-700 rounded-xl p-4 shadow-lg"
          >
            {/* 🔹 Language Title */}
            <h2 className="text-lg font-semibold text-blue-400 mb-3">
              {sol.language}
            </h2>

            {/* 🔹 Code Box */}
            <pre className="bg-[#020617] text-gray-200 text-sm p-4 rounded-lg overflow-auto h-64 leading-relaxed">
              <code>
                {sol.completeCode}
              </code>
            </pre>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Solutions;