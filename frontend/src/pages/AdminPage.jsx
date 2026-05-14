// import React from "react";
// import { useNavigate } from "react-router-dom";

// function AdminPage() {
//   const navigate = useNavigate();

//   // 🔥 DATA ARRAY
//   const adminActions = [
//     {
//       title: "Create Problem",
//       desc: "Add a new coding problem to the platform",
//       icon: "➕",
//       color: "success",
//       bg: "bg-green-500/20",
//       path: "/admin/create",
//     },
//     {
//       title: "Update Problem",
//       desc: "Modify existing problems and their details",
//       icon: "✏️",
//       color: "warning",
//       bg: "bg-yellow-500/20",
//       path: "/admin/update",
//     },
//     {
//       title: "Delete Problem",
//       desc: "Remove problems from the platform",
//       icon: "🗑",
//       color: "error",
//       bg: "bg-red-500/20",
//       path: "/admin/delete",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-base-100 p-6">

//       {/* HEADER */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold text-primary">Admin Panel</h1>
//         <p className="text-gray-500 mt-2">
//           Manage coding problems 🚀
//         </p>
//       </div>

//       {/* 🔥 CARDS */}
//       <div className="grid md:grid-cols-3 gap-6">

//         {adminActions.map((item, index) => (
//           <div
//             key={index}
//             className="card bg-base-200 shadow-xl hover:scale-105 transition-all duration-300"
//           >
//             <div className="card-body items-center text-center">

//               {/* ICON */}
//               <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center text-2xl`}>
//                 {item.icon}
//               </div>

//               {/* TITLE */}
//               <h2 className="card-title mt-3">{item.title}</h2>

//               {/* DESC */}
//               <p className="text-gray-500">{item.desc}</p>

//               {/* BUTTON */}
//               <button
//                 onClick={() => navigate(item.path)}
//                 className={`btn btn-${item.color} mt-4 w-full`}
//               >
//                 {item.title}
//               </button>

//             </div>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }

// export default AdminPage;

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video, CloudSync } from 'lucide-react';
import { NavLink } from 'react-router';

<Video />

function AdminPage() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/10',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'video upload and delete',
      description: 'Remove problems from the platform',
      icon: Video,
      color: 'btn-primary',
      bgColor: 'bg-primary/10',
      route: '/admin/video'
    }

  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Admin Panel
          </h1>
          <p className="text-base-content/70 text-lg">
            Manage coding problems on your platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="card-body items-center text-center p-8">
                  {/* Icon */}
                  <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                    <IconComponent size={32} className="text-base-content" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="card-title text-xl mb-2">
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-base-content/70 mb-6">
                    {option.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="card-actions">
                    <div className="card-actions">
                    <NavLink 
                    to={option.route}
                   className={`btn ${option.color} btn-wide`}
                   >
                   {option.title}
                   </NavLink>
                   </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default AdminPage;