import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import { axiosClient } from "../axios/axiosClient.js";
import Description from '../components/Description.jsx';
import Solutions from '../components/Solutions.jsx';
import Submissions from '../components/Submissions.jsx';
import ChatAi from '../components/ChatAi.jsx';
import Editorial from '../components/Editorial.jsx';
function CodeEditor() {

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [topLeftNavBtn, setTopLeftNavBtn] = useState("Description");
  const [submittedData, setSubmittedData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const editorRef = useRef(null);
  const { problemId } = useParams();
  //  FETCH PROBLEM
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        console.log(response?.data);
        
        const problemData = response?.data?.getProblem;

        setProblem(problemData);

        const initialCode = problemData?.startCode?.find(
          sc => sc.language.toLowerCase() === selectedLanguage
        )?.initialCode;

        setCode(initialCode || "");
      } catch (error) {
        console.log("ERROR:", error?.response);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  //  LANGUAGE CHANGE
  useEffect(() => {
    if (problem) {
      const newCode = problem.startCode?.find(
        sc => sc.language.toLowerCase() === selectedLanguage
      )?.initialCode;

      setCode(newCode || "");
    }

  }, [selectedLanguage, problem]);

  //  MONACO LANGUAGE
  const getLanguageForMonaco = (lang) => {
    if (lang === 'javascript') return 'javascript';
    if (lang === 'java') return 'java';
    if (lang === 'cpp') return 'cpp';
  };

  // RUN CODE
  const handleRun = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post(`/submission/runCode/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      console.log(res?.data);

      setRunResult(res.data);


    } catch (error) {
      console.log(error.response);
    } finally {      
      setLoading(false);
    }
  };
  // SUBMIT CODE
  const handleSubmitted = async () => {
    try {
      setLoading(true);


      const response = await axiosClient.post(`/submission/submitted/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmittedData(response?.data);
      solvedProblemsCode();
      setTopLeftNavBtn("Submissions");
    } catch (error) {
      console.log("ERROR : ", error.response);
    } finally {
      setLoading(false);
    }
  }
  const solvedProblemsCode = async () => {
    try {
      const response = await axiosClient.post(`/problem/submittedProblem/${problemId}`);
      setSubmissionData(response?.data?.data);
      const data = response?.data?.data?.filter(item => item?.status === "accepted");
      setCode(data[0]?.code)

    } catch (error) {
      console.log(error.response);

    }
  }
  useEffect(() => {
    setTimeout(() => {
      solvedProblemsCode()
    }, 2000);

  }, []);
  console.log("PRoblem : ",problem);
  
  return <>
    {loading && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )}

    <div className="h-screen flex flex-col bg-[#0f172a] text-white">

      <div className="flex gap-6 px-6 py-3 border-b border-gray-700 bg-[#020617]">

        <button
          onClick={() => setTopLeftNavBtn("Description")}
          className={topLeftNavBtn === "Description"
            ? "text-blue-400 font-semibold"
            : "text-gray-400 hover:text-white"}
        >
          Description
        </button>

        <button
          onClick={() => setTopLeftNavBtn("Solutions")}
          className={topLeftNavBtn === "Solutions"
            ? "text-blue-400 font-semibold"
            : "text-gray-400 hover:text-white"}
        >
          Solutions
        </button>

        <button
          onClick={() => setTopLeftNavBtn("Submissions")}
          className={topLeftNavBtn === "Submissions"
            ? "text-blue-400 font-semibold"
            : "text-gray-400 hover:text-white"}
        >
          Submissions
        </button>

        <button
          onClick={() => setTopLeftNavBtn("Editorial")}
          className={topLeftNavBtn === "Editorial"
            ? "text-blue-400 font-semibold"
            : "text-gray-400 hover:text-white"}
        >
         Editorial
        </button>



        <button
          onClick={() => setTopLeftNavBtn("chatAi")}
          className={topLeftNavBtn === "chatAi"
            ? "text-blue-400 font-semibold"
            : "text-gray-400 hover:text-white"}
        >
          chat AI
        </button>


      </div>
      {/*  MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/*  LEFT SIDE */}

        <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-700">

          {topLeftNavBtn === "Description" && <Description problem={problem} />}

          {topLeftNavBtn === "Solutions" && <Solutions problem={problem} />}
          {topLeftNavBtn === "Submissions" && <Submissions problemId={problemId} />}

          {topLeftNavBtn === "Editorial" && <Editorial problem={problem} />}
          
          {topLeftNavBtn === "chatAi" && <ChatAi problem={problem} />}

        </div>








        {/*  RIGHT SIDE */}
        <div className="w-1/2 flex flex-col">

          {/*  TOP BAR */}
          <div className="flex justify-between items-center px-4 py-2 bg-[#020617] border-b border-gray-700">

            {/* Languages */}
            <div className="flex gap-2">
              {["javascript", "java", "c++"].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded ${selectedLanguage === lang
                    ? "bg-blue-600"
                    : "bg-gray-700"
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                className="bg-green-600 px-4 py-1 rounded"
              >
                Run
              </button>

              <button className="bg-blue-600 px-4 py-1 rounded" onClick={handleSubmitted}>
                Submit
              </button>
            </div>

          </div>

          {/*  EDITOR */}
          <div className="flex-1/3 ">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={(val) => setCode(val)}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'line',
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                mouseWheelZoom: true,
              }}
            />
          </div>

          {/*  OUTPUT PANEL */}
          <div className="h-40 bg-black border-t border-gray-700 p-3 overflow-auto">

            <div className="flex gap-4 mb-2">
              <span className="text-blue-400">Testcase</span>
              <span className="text-gray-400">Result</span>
            </div>

            <pre className="text-green-400 text-sm">
              <div className="text-sm">
                {!runResult && "Run your code to see output..."}

                {runResult?.testCases?.map((tc, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-2 rounded ${tc.status.description === "Accepted"
                      ? "bg-green-900"
                      : "bg-red-900"
                      }`}
                  >
                    <div className="flex justify-between">
                      <span>Test Case {index + 1}</span>
                      <span
                        className={`font-bold ${tc.status.description === "Accepted"
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {tc.status.description}
                      </span>
                    </div>

                    <div className="mt-1 text-gray-300">
                      Output: {tc.stdout}
                    </div>
                  </div>
                ))}
              </div>
            </pre>

          </div>

        </div>

      </div>
    </div>
  </>
}

export default CodeEditor;

// render , morgen , pritter.json