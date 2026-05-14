import validator from "validator";

export const ValidaterFunc = (data) => {
  const validations = [];

  if ((data.firstName) !==undefined){
    validations.push({
      check : () => validator.isLength((data.firstName)?.trim()||"",{
        min:3,
        max:20
      }),
      message : "Name must be 3-20 characters"
    })
  }

 
  if(data.email !== undefined){
    validations.push({
      check : () => validator.isEmail(data.email || ""),
      message : "Invalid email address"
    })
  }
  
  if (data.password !== undefined) {
    validations.push({
      check: () => validator.isStrongPassword(data.password || ""),
      message: "Password is not strong enough",
    });
  }
 
     return validations ;
}