export const getSolvedProblemCode = async(req,res) =>{
  try {
    const userId = req.user._id;
    const problemId = req.params.id;
    const { solvedCode , language} = req.body;
    if (!userId || !code || !solvedCode || !problemId) {
      return res.status(400).json({
        success: false,
        message: "Some field missing"
      })
    }
    
  } catch (error) {
    
  }
}