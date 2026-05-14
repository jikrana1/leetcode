import { problemModel } from "../models/problem.model.js"
import { submissionModel } from "../models/submission.model.js";
import { userModel } from "../models/user.model.js";
import { videoModel } from "../models/video.model.js";
import { getLanguageById, submitBatch } from "../utils/prolemUtility.js";
import { wrapCode } from "../utils/wrapCode.js";

export const createProblem = async (req, res) => {
  try {

    const {
      title,
      description,
      difficulty,
      tags,
      functionName,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
    } = req.body;

    if (!title ||
      !referenceSolution?.length ||
      !visibleTestCases?.length ||
      !hiddenTestCases?.length ||
      !functionName
    ) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const AllTestCases = [...visibleTestCases, ...hiddenTestCases]

    for (const { language, completeCode } of referenceSolution) {

      let lang = language.toLowerCase();

      if (lang === "c++" || lang === "cpp") lang = "c++";
      const languageId = getLanguageById(lang);
      const wrappedCode = wrapCode(completeCode, lang, functionName);

      const submissions = AllTestCases.map((testcase) => ({
        source_code: wrappedCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));
      const submitResult = await submitBatch(submissions);

      const allPassed = submitResult.every(
        r => r.status.id === 3
      );

      if (!allPassed) {
        return res.status(400).json({
          message: `Reference solution failed in ${language} ❌`
        });
      }

    }
    const userProblem = await problemModel.create({
      ...req.body,
      problemCreator: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Problem Saved Successfully",
      userProblem
    })
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error
    });
  }

}

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, difficulty, tags,
      visibleTestCases, hiddenTestCases, startCode, functionName,
      referenceSolution, problemCreator
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing ID Field"
      })
    }

    const DsaProblem = await problemModel.findById(id);

    if (!DsaProblem) {
      return res.status(400).json({
        success: false,
        message: "ID is not persent in server"
      })
    }
    const AllTestCases = [...visibleTestCases, ...hiddenTestCases]

    for (const { language, completeCode } of referenceSolution) {
      let lang = language.toLowerCase();

      if (lang === "c++" || lang === "cpp") lang = "c++";

      const languageId = getLanguageById(lang)

      // const AllTestCases = [...visibleTestCases, ...hiddenTestCases]
      const wrappedCode = wrapCode(completeCode, lang, functionName);

      const submissions = AllTestCases.map((testcase) => ({
        source_code: wrappedCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));
      const submitResult = await submitBatch(submissions);
      console.log(submitResult);
      const allPassed = submitResult.every(
        r => r.status.id === 3
      );


      if (!allPassed) {
        return res.status(400).json({
          message: `Reference solution failed in ${language} ❌`
        });
      }

    }

    const newProblem = await problemModel.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });

    return res.status(200).json({
      success: true,
      message: "Update Problem successfully!",
      newProblem
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "ERROR : ", error
    })
  }
}

export const deletedProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing ID Field"
      })
    }
    const deleteProblem = await problemModel.findByIdAndDelete(id);


    if (!deleteProblem) {
      return res.status(400).json({
        success: false,
        message: "Delete Problem is Missing"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Deleted Problem successfully!"
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "ERROR : ", error
    })
  }
}

export const getOneProblemById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing ID Field"
      })
    }
    const getProblem = await problemModel.findById(id);

    if (!getProblem) {
      return res.status(400).json({
        success: false,
        message: "Problem is Missing"
      })
    }

    const video = await videoModel.findOne({ problemId: id });

    let responseData = getProblem.toObject();
    if (video) {
      responseData = {
        ...responseData,
        secureUrl: video.secureUrl,
        cloudinaryPublicId: video.cloudinaryPublicId,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration
      }
      

      return res.status(200).json({
        success: true,
        message: "  GetProblem successfully!",
        getProblem: responseData
      })
      
    }
    return res.status(200).json({
      success: true,
      message: "  GetProblem successfully!",
      getProblem: responseData
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "ERROR : ", error
    })
  }
}

export const getAllProblems = async (req, res) => {
  try {
    const getAllProblem = await problemModel.find({});

    if (getAllProblem.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Problem is Missing"
      })
    }


    return res.status(200).json({
      success: true,
      message: "  GetAllProblems successfully!",
      getAllProblem
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "ERROR : ", error
    })
  }
}
export const solvedAllProblembyUser = async (req, res) => {
  try {

    const userId = req.user._id;
    const user = await userModel.findById(userId).populate({
      path: "problemSolved",
      select: "_id tags title difficulty"

    });
    return res.status(200).json({
      success: true,
      message: "get userSolved problem",
      data: user
    })
  } catch (error) {
    return res.status(400).json({
      message: "ERROR : ", error,
      success: false
    })
  }
}

export const submittedProblem = async (req, res) => {

  try {

    const userId = req.user._id;
    const problemId = req.params.pId;

    const ans = await submissionModel.find({ userId, problemId });

    if (ans.length == 0)
      res.status(200).send("No Submission is persent");
    return res.status(200).json({
      message: "submited data",
      data: ans
    })
  }
  catch (err) {
    res.status(500).send("Internal Server Error");
  }
}