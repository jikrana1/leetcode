// import axios from "axios";
// const wait = (ms) => new Promise(res => setTimeout(res, ms));

// export const getLanguageById = (lang) =>{
//   const language = {
//     "c++" : 54,
//     "java" : 62,
//     "javascript" : 63
//   }
//   return language[lang.toLowerCase()];
// }

//  export const submitBatch = async (submissions) =>{
//   try {
//     const response = await axios.post(
//       "https://ce.judge0.com/submissions/batch?base64_encoded=true",{submissions}
//     );
//     const tokens = response.data.map(item => item.token);
//     let attempts = 0;
//     const maxAttempts = 20 ;
    
//     while(attempts < maxAttempts) {
//       const result = await axios.get(
//         `https://ce.judge0.com/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=true`
//       );
//       const submissionsResult = result.data.submissions;
//       const isDone = submissionsResult.every(r => r.status.id > 2);
//       if(isDone){
//         return submissionsResult ;
//       }
//       attempts ++;
//       await wait(1500);
     
//     }
    
//     // throw new Error("TimeOut");
//   } catch (error) {
//     console.error("Judge0 Error:", error.response?.data || error.message);
//     throw error;
//   }
// }








// import axios from "axios";

// const wait = (ms) => new Promise(res => setTimeout(res, ms));
// const encode = (str) => btoa(str);
// const decode = (str) => str ? atob(str) : "";

// export const submitBatch = async (submissions) => {
//   try {
//     // 🔥 encode before sending
//     const formatted = submissions.map(sub => ({
//       ...sub,
//       source_code: encode(sub.source_code),
//       stdin: encode(sub.stdin || "")
//     }));

//     const response = await axios.post(
//       "https://ce.judge0.com/submissions/batch?base64_encoded=true",
//       { submissions: formatted }
//     );

//     const tokens = response.data.map(item => item.token);

//     let attempts = 0;
//     const maxAttempts = 20;

//     while (attempts < maxAttempts) {
//       const result = await axios.get(
//         `https://ce.judge0.com/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=true`
//       );

//       const submissionsResult = result.data.submissions;

//       const isDone = submissionsResult.every(r => r.status.id > 2);

//       if (isDone) {
//         // 🔥 decode response
//         return submissionsResult.map(r => ({
//           ...r,
//           stdout: decode(r.stdout),
//           stderr: decode(r.stderr),
//           compile_output: decode(r.compile_output)
//         }));
//       }

//       attempts++;
//       await wait(1500);
//     }

//   } catch (error) {
//     console.error("Judge0 Error:", error.response?.data || error.message);
//     throw error;
//   }
// };


import axios from "axios";

const wait = (ms) => new Promise(res => setTimeout(res, ms));

// ✅ language id
export const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63
  };
  return language[lang.toLowerCase()];
};

// // ✅ newline fix function
// const fixCode = (code) => code.replace(/\\n/g, "\n");

// // ✅ base64 encode
// const encode = (str) => Buffer.from(str).toString("base64");

// // ✅ base64 decode (result ke liye)
// const decode = (str) => str ? Buffer.from(str, "base64").toString() : "";

// export const submitBatch = async (submissions) => {
//   try {

//     // 🔥 STEP 1: fix + encode
//     const formattedSubmissions = submissions.map(sub => ({
//       source_code: encode(fixCode(sub.source_code)),
//       stdin: encode(fixCode(sub.stdin || "")),
//       expected_output: encode(fixCode(sub.expected_output || "")),
//       language_id: sub.language_id
//     }));

//     // 🔥 STEP 2: send to Judge0
//     const response = await axios.post(
//       "https://ce.judge0.com/submissions/batch",
//       { submissions: formattedSubmissions }
//     );
// // ?base64_encoded = true
//     const tokens = response.data.map(item => item.token);

//     let attempts = 0;
//     const maxAttempts = 20;

//     // 🔥 STEP 3: polling result
//     while (attempts < maxAttempts) {

//       const result = await axios.get(
//         `https://ce.judge0.com/submissions/batch?tokens=${tokens.join(",")}`
//       );
// // & base64_encoded=true
//       const submissionsResult = result.data.submissions;

//       const isDone = submissionsResult.every(r => r.status.id > 2);

//       if (isDone) {

//         // 🔥 STEP 4: decode result
//         const finalResult = submissionsResult.map(r => ({
//           ...r,
//           stdout: decode(r.stdout),
//           stderr: decode(r.stderr),
//           compile_output: decode(r.compile_output)
//         }));

//         return finalResult;
//       }

//       attempts++;
//       await wait(1500);
//     }

//     throw new Error("Timeout");
//   } catch (error) {
//     console.error("Judge0 Error:", error.response?.data || error.message);
//     throw error;
//   }
// };



// import axios from "axios";

// const wait = (ms) => new Promise(res => setTimeout(res, ms));

const encode = (str) => Buffer.from(str).toString("base64");
const decode = (str) => str ? Buffer.from(str, "base64").toString() : "";

export const submitBatch = async (submissions) => {
  try {


    // ✅ ONLY encode (NO fix
    // Code)
    const formattedSubmissions = submissions.map(sub => ({
      source_code: encode(sub.source_code),
      stdin: encode(sub.stdin || ""),
      expected_output: encode(sub.expected_output || ""),
      language_id: sub.language_id
    }));

    // ✅ IMPORTANT: base64_encoded=true
    const response = await axios.post(
      "https://ce.judge0.com/submissions/batch?base64_encoded=true",
      { submissions: formattedSubmissions }
    );

    const tokens = response.data.map(item => item.token);

    let attempts = 0;

    while (attempts < 20) {

      // ✅ IMPORTANT: base64_encoded=true
      const result = await axios.get(
        `https://ce.judge0.com/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=true`
      );

      const submissionsResult = result.data.submissions;
      const isDone = submissionsResult.every(r => r.status.id > 2);

      if (isDone) {
        return submissionsResult.map(r => ({
          ...r,
          stdout: decode(r.stdout),
          stderr: decode(r.stderr),
          compile_output: decode(r.compile_output)
        }));
      }

      attempts++;
      await wait(1500);
    }

    throw new Error("Timeout");

  } catch (error) {
    console.error("Judge0 Error:", error.response?.data || error.message);
    throw error;
  }
};







// import axios from "axios";

// const wait = (ms) => new Promise(res => setTimeout(res, ms));

// export const getLanguageById = (lang) => {
//   const language = {
//     "c++": 54,
//     "java": 62,
//     "javascript": 63
//   };
//   return language[lang.toLowerCase()];
// };

// export const submitBatch = async (submissions) => {
//   try {

//     // ✅ ENCODE DATA
//     const encodedSubmissions = submissions.map(sub => ({
//       source_code: Buffer.from(sub.source_code || "").toString("base64"),
//       stdin: Buffer.from(sub.stdin || "").toString("base64"),
//       expected_output: Buffer.from(sub.expected_output || "").toString("base64"),
//       language_id: sub.language_id
//     }));

//     const response = await axios.post(
//       "https://ce.judge0.com/submissions/batch?base64_encoded=true",
//       { submissions: encodedSubmissions }
//     );

//     const tokens = response.data.map(item => item.token);

//     let attempts = 0;
//     const maxAttempts = 20;

//     while (attempts < maxAttempts) {
//       const result = await axios.get(
//         `https://ce.judge0.com/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=true`
//       );

//       const submissionsResult = result.data.submissions;

//       const isDone = submissionsResult.every(r => r.status.id > 2);

//       if (isDone) {
//         return submissionsResult;
//       }

//       attempts++;
//       await wait(1500);
//     }

//   } catch (error) {
//     console.error("Judge0 Error:", error.response?.data || error.message);
//     throw error;
//   }
// };