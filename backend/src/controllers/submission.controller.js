import { problemModel } from "../models/problem.model.js";
import { problemSolvedModel } from "../models/solvedproblem.model.js";
import { submissionModel } from "../models/submission.model.js";
import { getLanguageById, submitBatch } from "../utils/prolemUtility.js";
import { wrapCode } from "../utils/wrapCode.js";

export const runCode = async (req, res) => {

  try {
    const userId = req.user._id;
    const problemId = req.params.pId;
    let { code, language } = req.body;
    // console.log("req:",req.body);
    
    console.log("1111111111");
    
    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Some field missing"
      })
    }
    console.log("112222222");

    const problem = await problemModel.findById(problemId);
    if (!problem) {
      return res.status(400).json({
        success: false,
        message: "Problem not existed"
      })
    }
    console.log("333333333");
    
    if (language === "cpp") {
      language = "c++"
    }

    const languageId = getLanguageById(language);

    const submissions = problem?.visibleTestCases?.map((testcase) => ({
      source_code: wrapCode(code, language, problem.functionName),
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

console.log("44445555555",submissions);

    const submitResult = await submitBatch(submissions);
console.log("?????/",submitResult);


    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let statusMessage = null;
    let errorMessage = null;


    for (const test of submitResult) {
      if (test.status.id === 3) {
        testCasesPassed++;
        statusMessage = test.status.description;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      }
      else {

        status = false,
          errorMessage = test.stderr || test.compile_output || "Error";
        statusMessage = test.status.description;

      }

    }
    return res.status(201).json({
      message: statusMessage,
      success: status,
      testCases: submitResult,
      runtime,
      memory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error ", error
    });
  }
}

export const submitCode = async (req, res) => {
  try {

    const userId = req.user._id;
    const problemId = req.params.id;
    let { code, language } = req.body;
    if (!userId || !code || !userId || !problemId) {
      return res.status(400).json({
        success: false,
        message: "Some field missing"
      })
    }

    if (language === "cpp") {
      language = 'c++'
    }
  
    // fetch the problem from database
    const problem = await problemModel.findById(problemId);
    const AllTestCases = [...problem?.hiddenTestCases, ...problem?.visibleTestCases]

    const submittedResult = await submissionModel.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: AllTestCases.length
    })

    

    const languageId = getLanguageById(language);
    const submissions = AllTestCases?.map((testcase) => ({

      source_code: wrapCode(code, language, problem.functionName),
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }))
    const submitResult = await submitBatch(submissions);


    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let statusMessage = null;
    let errorMessage = null;

    for (const test of submitResult) {
      if (test.status.id === 3) {
        testCasesPassed++;
        statusMessage = test.status.description;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      }
      else if (test.status.id === 4) {
        status = 'error';
        errorMessage = test.stderr || test.compile_output || "Error";
        statusMessage = test.status.description;
      }
      else {
        status = 'wrong';
        errorMessage = test.stderr || test.compile_output || "Error";
        statusMessage = test.status.description;
      }
    }
  
    submittedResult.status = status;
    submittedResult.testCasePassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    if (!req.user.problemSolved.includes(problemId)) {
      req.user.problemSolved.push(problemId);
      await req.user.save();

    }

    const accepted = (status == "accepted");
    const solvedProblem = await problemSolvedModel.create({
      userId,
      problemId,
      solvedCode: code,
      language
    })
   
    return res.status(201).json({
      success: true,
      message: "code Submitted successfully",
      problemData: {
        accepted,
        totalTestCases: submittedResult.testCasesTotal,
        passedTestCases: testCasesPassed,
        runtime,
        memory
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "ERROR : ", error
    })
  }
}