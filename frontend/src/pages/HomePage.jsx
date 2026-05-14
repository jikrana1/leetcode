import { axiosClient } from "../axios/axiosClient.js"
import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import LoadingPage from "./LoadingPage.jsx";
import { logoutUser } from "../slice/auth.slice.js";
import HeaderHome from "./HeaderHomePage.jsx";
import { NavLink } from "react-router-dom";
import { Search } from "lucide-react"
function HomePage() {

  const { loading, user, isAuthenticated } = useSelector((state) => state.auth);

  // ✅ correct state name
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  const dispatch = useDispatch();


  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/problem/getAll");

        setProblems(response?.data?.getAllProblem || []);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // call function

    const fetchSolvedProblems = async () => {
      try {

        const response = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(response?.data?.data?.problemSolved || []);
      } catch (error) {
        console.error('Error fetching solved problems:', error.response);
      }
    }
    if (user) {

      fetchSolvedProblems();

    }
  }, [user]);


  //  Filters state
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all"
  });

  // const filteredProblems = useMemo(() => {
  //   if (!Array.isArray(problems)) return [];

  //   return problems.filter(problem => {

  //     const difficultyMatch =
  //       filters.difficulty === "all" ||
  //       problem.difficulty === filters.difficulty;

  //     // const tagMatch =
  //     //   filters.tag === "all" ||
  //     //   problem.tags === filters.tag;

  //     const tagMatch =
  //       filters.tag === "all" ||
  //       (Array.isArray(problem.tags)
  //         ? problem.tags.includes(filters.tag)
  //         : problem.tags === filters.tag);

  //     const searchMatch =
  //       problem.title.toLowerCase().includes(searchValue.toLowerCase());

  //     // 🔥 SOLVED MATCH
  //     const statusMatch =
  //       filters.status === "all" ||
  //       solvedProblems.some(sp => sp._id === problem._id);

  //     return difficultyMatch && tagMatch && statusMatch && searchMatch;
  //   });

  // }, [filters, problems, solvedProblems,searchValue]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300)
    return () => clearTimeout(timer);
  }, [searchValue])


  const filteredProblems = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    return problems.filter(problem => {

      const difficultyMatch =
        filters.difficulty === "all" ||
        problem.difficulty === filters.difficulty;

      const tagMatch =
        filters.tag === "all" ||
        (Array.isArray(problem.tags)
          ? problem.tags.includes(filters.tag)
          : problem.tags === filters.tag);

      const searchMatch =
        problem.title.toLowerCase().includes(debouncedSearch.toLowerCase());

      const isSolved = solvedProblems.some(sp => sp._id === problem._id);

      const statusMatch =
        filters.status === "all" ||
        (filters.status === "solved" && isSolved);

      return difficultyMatch && tagMatch && statusMatch && searchMatch;
    });

  }, [filters, problems, solvedProblems, debouncedSearch]);


  return (
    <div className="min-h-screen bg-base-100 bg-base-10">
      {/* HEADER */}
      <HeaderHome />
      {/* FILTERS */}
      <div className="flex gap-4 p-4 flex-wrap bg-base-300">
        <select
          className="select select-bordered select-sm"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="all">All Problems</option>
          <option value="solved">Solved Problems</option>
        </select>
        <select
          className="select select-bordered select-sm"
          value={filters.difficulty}
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
        >
          <option value="all">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className="select select-bordered select-sm"
          value={filters.tag}
          onChange={(e) =>
            setFilters({ ...filters, tag: e.target.value })
          }
        >
          <option value="all">All Tags</option>
          <option value="array">Array</option>
          <option value="dp">DP</option>
          <option value="graph">Graph</option>
        </select>
        <div className="w-full max-w-md relative">
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-base-100 border border-base-300 shadow-md 
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition duration-300 text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {/* ICON */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">

        {loading ? (
          <LoadingPage />
        ) : (
          <div className="p-4 space-y-3">

            {filteredProblems.map((p, index) => (


              <div className="card bg-base-300 shadow-md hover:shadow-xl transition  border border-base-300" key={index}>

                <div className="card-body flex flex-row items-center justify-between">

                  {/* LEFT SIDE */}
                  <div>
                    <NavLink key={p._id} to={`/problem/${p._id}`}>
                      <h2 className="font-semibold text-lg cursor-pointer text-gray-300 hover:text-primary mb-3">
                        {p.title}
                      </h2>
                    </NavLink>
                    <div className="flex gap-6">


                      <div className="flex gap-2 mt-1 flex-wrap">
                        {Array.isArray(p.tags)
                          ? p.tags.map((tag, i) => (
                            <span key={i} className="badge badge-outline badge-sm">
                              {tag}
                            </span>
                          ))
                          : (
                            <span className="badge badge-outline badge-sm">
                              {p.tags}
                            </span>
                          )
                        }
                      </div>
                      <div>
                        <span className={`badge 
              ${p.difficulty === "easy" ? "badge-success" :
                            p.difficulty === "medium" ? "badge-warning" :
                              "badge-error"}`}>
                          {p.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  {solvedProblems.some(sp => sp._id === p._id) && (
                    <div className="badge badge-success gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

              </div>


            ))}

            {filteredProblems.length === 0 && (
              <p className="text-center p-4 text-gray-500">
                No problems found 😔
              </p>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default HomePage;

