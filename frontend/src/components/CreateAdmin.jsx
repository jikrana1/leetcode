import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { axiosClient } from "../axios/axiosClient.js"
import { useNavigate, useParams } from "react-router-dom";
/* -------------------- ZOD SCHEMA -------------------- */

const schema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),
  functionName: z.string().min(1, "Function name required"),

  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input required"),
      output: z.string().min(1, "Output required"),
      explanation: z.string().min(1, "Explanation required"),

    })
  ).min(1),

  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1)
    })
  ).min(1),

  startCode: z.array(
    z.object({
      language: z.string(),
      initialCode: z.string().min(1)
    })
  ).length(3),

  referenceSolution: z.array(
    z.object({
      language: z.string(),
      completeCode: z.string().min(1)
    })
  ).length(3)
});

/* -------------------- COMPONENT -------------------- */

function CreateAdmin() {


  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      visibleTestCases: [],
      hiddenTestCases: [],
      startCode: [
        { language: "JavaScript", initialCode: "" },
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" }
       
      ],
      referenceSolution: [
        { language: "JavaScript", completeCode: "" },
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" }
        
      ]
    }
  });

  const { fields: visibleFields, append: addVisible, remove: removeVisible } =
    useFieldArray({ control, name: "visibleTestCases" });

  const { fields: hiddenFields, append: addHidden, remove: removeHidden } =
    useFieldArray({ control, name: "hiddenTestCases" });

  /* -------------------- SUBMIT -------------------- */

  const onSubmit = async (data) => {
    console.log("DATA : ", data);

    try {
      if (isEditMode) {
        const res = await axiosClient.put(`/problem/update/${id}`, data);
        alert("✅ Problem Updated!");
      }
      else {
        const res = await axiosClient.post("/problem/create", data);
        alert("✅ Problem Created!");

      }
      navigate("/");
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchProlem = async () => {
        try {
          const res = await axiosClient.get(`/problem/problemById/${id}`);
          reset(res?.data?.getProblem);
          console.log(res.data);

        } catch (error) {
          console.log(error.response);

        }
      }
      fetchProlem();


    }

  }, [id, reset])


  return (
    <div className="min-h-screen bg-base-200 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-primary mb-6">
          Admin Panel 🚀
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ---------------- BASIC ---------------- */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Basic Info</h2>

            <input
              {...register("title")}
              placeholder="Title"
              className="input input-bordered w-full mb-2"
            />
            <p className="text-error">{errors.title?.message}</p>

            <textarea
              {...register("description")}
              placeholder="Description"
              className="textarea textarea-bordered w-full mb-2"
            />
            <p className="text-error">{errors.description?.message}</p>

            <div className="flex gap-4">
              <select {...register("difficulty")} className="select select-bordered w-full">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="text-error text-sm mt-1">
                  {errors.difficulty.message}
                </p>
              )}

              <select {...register("tags")} className="select select-bordered w-full">
                <option value="array">Array</option>
                <option value="linkedList">LinkedList</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>
            </div>

            <div className="form-control mb-4 mt-3">
              <label className="label">
                <span className="label-text font-semibold text-[15px]">
                  Function Name
                </span>
              </label>

              <input
                {...register("functionName")}
                placeholder="e.g. twoSum"
                className={`input input-bordered w-full ${errors.functionName ? "input-error" : ""
                  }`}
              />

              {errors.functionName && (
                <p className="text-error text-sm mt-1">
                  {errors.functionName.message}
                </p>
              )}
            </div>


          </div>

          {/* ---------------- VISIBLE ---------------- */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="font-bold mb-3">Visible Test Cases</h2>

            <button
              type="button"
              onClick={() => addVisible({ input: "", output: "", explanation: "" })}
              className="btn btn-sm btn-primary mb-3"
            >
              + Add
            </button>

            {visibleFields.map((item, index) => (
              <div key={item.id} className="bg-base-200 p-4 rounded-lg mb-3">
                <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input w-full mb-2" />
                <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input w-full mb-2" />
                <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="textarea w-full mb-2" />

                <button onClick={() => removeVisible(index)} type="button" className="btn btn-error btn-xs">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* ---------------- HIDDEN ---------------- */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="font-bold mb-3">Hidden Test Cases</h2>

            <button
              type="button"
              onClick={() => addHidden({ input: "", output: "" })}
              className="btn btn-sm btn-primary mb-3"
            >
              + Add
            </button>

            {hiddenFields.map((item, index) => (
              <div key={item.id} className="bg-base-200 p-4 rounded-lg mb-3">
                <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input w-full mb-2" />
                <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input w-full mb-2" />

                <button onClick={() => removeHidden(index)} type="button" className="btn btn-error btn-xs">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* ---------------- CODE ---------------- */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="font-bold mb-3">Code</h2>

            {["JavaScript", "C++", "Java"].map((lang, i) => {

return(
              <div key={i} className="mb-4">
              
                <h3 className="font-semibold">{lang}</h3>

                <textarea
                  {...register(`startCode.${i}.initialCode`)}
                  placeholder="Initial Code"
                  className="textarea textarea-bordered w-full mb-2 font-mono"
                />

                <textarea
                  {...register(`referenceSolution.${i}.completeCode`)}
                  placeholder="Solution Code"
                  className="textarea textarea-bordered w-full font-mono"
                />
              </div>)
            }


            )}
          </div>

          {/* SUBMIT */}
          <button className="btn btn-primary w-full text-lg">
            {isEditMode ? "Update Problem" : " Create Problem"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateAdmin;