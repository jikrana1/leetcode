import React from 'react';
import { useEffect, useState } from 'react';
import { axiosClient } from "../axios/axiosClient.js";
function Submissions({ problemId }) {

  const [selectedCode, setSelectedCode] = useState(null);
  const [notPendingData, setNotPendingData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const solvedProblemsCode = async () => {
      try {
        const response = await axiosClient.post(`/problem/submittedProblem/${problemId}`);
        setLoading(true)
        const data = response?.data?.data;

        setSubmissionData(data);

        // ✅ yahi filter kar do
        const filtered = data?.filter(item => item?.status !== "pending");
        setNotPendingData(filtered);

      } catch (error) {
        console.log(error.response);
      }
    };

    solvedProblemsCode();
  }, [problemId]);

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };


  const closeModal = () => setSelectedCode(null);

  return (

    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Submission History</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-gray-400">
              <th>#</th>
              <th>Language</th>
              <th>Status</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Test Cases</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {notPendingData?.map((sub, index) => (
              <tr key={sub._id}>
                <td>{index + 1}</td>
                <td>{sub.language}</td>

                <td>
                  <span
                    className={`badge ${sub.status === "accepted"
                      ? "badge-success"
                      : "badge-error"
                      }`}
                  >
                    {sub.status}
                  </span>
                </td>

                <td>{(sub.runtime).toFixed(6)} sec</td>
                <td>{formatMemory(sub.memory)}</td>
                <td>
                  {sub.testCasePassed}/{sub.testCasesTotal}
                </td>
                <td>
                  {new Date(sub.createdAt).toLocaleString()}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedCode(sub.code)}
                  >
                    Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {selectedCode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-base-100 w-4/5 max-h-[85vh] p-5 rounded-xl shadow-xl relative overflow-auto">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Your Code</h3>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-error"
              >
                ✕
              </button>
            </div>

            <pre className="bg-black text-green-400 p-4 rounded text-sm whitespace-pre-wrap">
              <code>{selectedCode}</code>
            </pre>

          </div>
        </div>
      )}
    </div>
  );
}

export default Submissions;




// import React, { useState } from 'react';

// function Submissions({ submissionData }) {
//   const [selectedCode, setSelectedCode] = useState(null);

//   return (
//     <div className="flex gap-4 p-4">

//       {/* LEFT SIDE → TABLE */}
//       <div className="w-2/3">
//         <h2 className="text-xl font-bold mb-4">Submission History</h2>

//         <div className="overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr className="text-gray-400">
//                 <th>#</th>
//                 <th>Language</th>
//                 <th>Status</th>
//                 <th>Runtime</th>
//                 <th>Memory</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {submissionData?.map((sub, index) => (
//                 <tr key={sub._id} className="hover">
//                   <td>{index + 1}</td>

//                   <td className="uppercase">{sub.language}</td>

//                   <td>
//                     <span
//                       className={`badge ${sub.status === "accepted"
//                           ? "badge-success"
//                           : "badge-error"
//                         }`}
//                     >
//                       {sub.status}
//                     </span>
//                   </td>

//                   <td>{sub.runtime} sec</td>

//                   <td>{sub.memory} KB</td>

//                   {/* 👇 BUTTON */}
//                   <td>
//                     <button
//                       className="btn btn-sm btn-primary"
//                       onClick={() => setSelectedCode(sub.code)}
//                     >
//                       View Code
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* RIGHT SIDE → CODE VIEWER */}
//       <div className="w-1/3 bg-black text-green-400 p-4 rounded-lg overflow-auto h-[500px]">
//         <h3 className="font-bold mb-2">Code</h3>

//         {selectedCode ? (
//           <pre className="text-sm whitespace-pre-wrap">
//             <code>{selectedCode}</code>
//           </pre>
//         ) : (
//           <p className="text-gray-400">Click "View Code" to see code</p>
//         )}
//       </div>

//     </div>
//   );
// }

// export default Submissions;