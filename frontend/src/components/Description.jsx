import React from 'react'

function Description({problem}) {
  // console.log(problem);


  return (
    <>

      <h1 className="text-2xl font-bold mb-2">
        {problem?.title}
      </h1>


      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-green-500 text-sm">
          {problem?.difficulty}
        </span>
        <span className="px-3 py-1 rounded-full bg-purple-500 text-sm">
          {problem?.tags}
        </span>
      </div>

      <p className="text-gray-300 mb-6">
        {problem?.description}
      </p>
      {problem?.visibleTestCases?.map((p,index) =>{
  return ( <div key={index}>
  
    <div className="bg-[#020617] p-4 rounded-lg border border-gray-700">
      <h3 className="font-semibold mb-2 text-blue-400">Example</h3>

      <p className="text-sm text-gray-300">
        <strong>Input:</strong> {p?.input}
      </p>

      <p className="text-sm text-gray-300">
        <strong>Output:</strong> {p?.output}
      </p>

      <p className="text-sm text-gray-400 mt-2">
        {p?.explanation}
      </p>
    </div>
  </div>)
})}
      {/* <div className="bg-[#020617] p-4 rounded-lg border border-gray-700">
        <h3 className="font-semibold mb-2 text-blue-400">Example</h3>

        <p className="text-sm text-gray-300">
          <strong>Input:</strong> {problem?.visibleTestCases?.[0]?.input}
        </p>

        <p className="text-sm text-gray-300">
          <strong>Output:</strong> {problem?.visibleTestCases?.[0]?.output}
        </p>

        <p className="text-sm text-gray-400 mt-2">
          {problem?.visibleTestCases?.[0]?.explanation}
        </p>
      </div> */}

    </>
  )
}

export default Description