// import React from 'react'

// function Editorial({problem}) {
//   console.log("EDITORial : ",problem);
  
//   return (
//     <div>Editorial</div>
//   )
// }

// export default Editorial

function Editorial({ problem }) {

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-white">
        {problem.title}
      </h1>

      {/* VIDEO */}
      {problem.secureUrl && (
        <div className="bg-[#111827] p-4 rounded-xl">

          <video
            controls
            poster={problem.thumbnailUrl}
            className="w-full rounded-lg"
          >
            <source
              src={problem.secureUrl}
              type="video/mp4"
            />
          </video>

          <div className="mt-2 text-gray-400 text-sm">
            Duration: {Math.floor(problem.duration)} sec
          </div>

        </div>
      )}

      {/* DESCRIPTION */}
      <div className="text-gray-300">
        {problem.description}
      </div>

    </div>
  );
}

export default Editorial;