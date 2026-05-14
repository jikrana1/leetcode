
import React, { useEffect, useState } from "react";
import { axiosClient } from "../axios/axiosClient";
import { useNavigate } from "react-router-dom";

function UpdateAdmin() {
  const navigate = useNavigate();


  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH ALL PROBLEMS
  const fetchProblems = async () => {
    try {
      const { data } = await axiosClient.get("/problem/getAll");
      setProblems(data?.getAllProblem || []);
    } catch (error) {
      console.log("Error fetching problems", error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // 🔥 UPDATE FUNCTION
  const handleUpdate = async (id) => {
   
    navigate(`/admin/update/${id}`);
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Update Problems
        </h1>

        {/* TABLE */}
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg">

          <table className="table table-zebra">

            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {problems.map((p, index) => (

                <tr key={p._id} className="hover">

                  {/* INDEX */}
                  <td>{index + 1}</td>

                  {/* TITLE */}
                  <td className="font-medium">{p.title}</td>

                  {/* DIFFICULTY */}
                  <td>
                    <span className={`badge 
                      ${p.difficulty === "easy" ? "badge-success" :
                        p.difficulty === "medium" ? "badge-warning" :
                          "badge-error"}`}>
                      {p.difficulty}
                    </span>
                  </td>

                  {/* TAG */}
                  <td>
                    <span className="badge badge-outline">
                      {p.tags}
                    </span>
                  </td>

                  {/* DELETE BUTTON */}
                  <td>
                    <button
                      onClick={() => handleUpdate(p._id)}
                      className="btn btn-primary btn-sm text-white"
                      disabled={loading}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {problems.length === 0 && (
            <p className="text-center p-6 text-gray-500">
              No Problems Found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateAdmin;