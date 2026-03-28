"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";
import RichTextEditor from "../../components/admin/RichTextEditor";


const ExperienceEdit = () => {
  const navigate = useRouter();
  const [experience, setExperience] = useState<any[]>([]);
  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    roleDescription: "",
    companyLogo: "",
    techStack: "",
    achievements: "",
    location: "",
  });
  const [achievementInput, setAchievementInput] = useState("");
  const [achievementsList, setAchievementsList] = useState<string[]>([]);
  const [challengeInput, setChallengeInput] = useState("");
  const [challengesList, setChallengesList] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = () => {
    api
      .get("/experience")
      .then((res) => setExperience(res.data))
      .catch(console.error);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/experience/${id}`);
      fetchExperience();
    }
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setAchievementsList([...achievementsList, achievementInput.trim()]);
      setAchievementInput("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievementsList(achievementsList.filter((_, i) => i !== index));
  };

  const handleAddChallenge = () => {
    if (challengeInput.trim()) {
      setChallengesList([...challengesList, challengeInput.trim()]);
      setChallengeInput("");
    }
  };

  const handleRemoveChallenge = (index: number) => {
    setChallengesList(challengesList.filter((_, i) => i !== index));
  };

  const handleEdit = (exp: any) => {
    console.log("Editing experience:", exp);
    setEditingId(exp._id);
    
    try {
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        try {
          return dateString.split("T")[0];
        } catch (e) {
          console.error("Error formatting date:", dateString, e);
          return "";
        }
      };

      setNewExp({
        title: exp.title || "",
        company: exp.company || "",
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate),
        description: exp.description || "",
        roleDescription: exp.roleDescription || "",
        companyLogo: exp.companyLogo || "",
        techStack: exp.techStack ? (Array.isArray(exp.techStack) ? exp.techStack.join(", ") : exp.techStack) : "",
        achievements: "",
        location: exp.location || "",
      });
      setAchievementsList(exp.achievements || []);
      setChallengesList(exp.challenges || []);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error in handleEdit:", error);
      alert("Failed to load experience for editing. Please check console for details.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewExp({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      roleDescription: "",
      companyLogo: "",
      techStack: "",
      achievements: "",
      location: "",
    });
    setAchievementsList([]);
    setChallengesList([]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const expData = {
        ...newExp,
        techStack: typeof newExp.techStack === 'string' 
          ? newExp.techStack.split(",").map((t) => t.trim()).filter((t) => t)
          : newExp.techStack, // Handle case where it might already be an array (though it shouldn't be)
        achievements: achievementsList,
        challenges: challengesList,
      };
      console.log("Submitting experience data:", expData);

      if (editingId) {
        await api.put(`/experience/${editingId}`, expData);
        alert("Experience updated successfully!");
      } else {
        await api.post("/experience", expData);
        alert("Experience added successfully!");
      }

      // Only clear form on success
      setEditingId(null);
      setNewExp({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        roleDescription: "",
        companyLogo: "",
        techStack: "",
        achievements: "",
        location: "",
      });
      setAchievementsList([]);
      setChallengesList([]);
      fetchExperience();
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Failed to save experience. Please check the console for details.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-3 py-6 md:px-4 md:py-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-white">Manage Experience</h1>
          <button
            onClick={() => navigate.push("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-6 md:mb-8 bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white border-b border-white/5 pb-3 md:pb-4">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h2>
          <form onSubmit={handleCreate} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior DevOps Engineer"
                  value={newExp.title}
                  onChange={(e) =>
                    setNewExp((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Google"
                  value={newExp.company}
                  onChange={(e) =>
                    setNewExp((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote"
                  value={newExp.location}
                  onChange={(e) =>
                    setNewExp((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Start Date</label>
                <input
                  type="date"
                  value={newExp.startDate}
                  onChange={(e) =>
                    setNewExp((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">End Date</label>
                <input
                  type="date"
                  value={newExp.endDate}
                  onChange={(e) =>
                    setNewExp((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Company Logo URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={newExp.companyLogo}
                  onChange={(e) =>
                    setNewExp((prev) => ({ ...prev, companyLogo: e.target.value }))
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Tech Stack</label>
              <input
                type="text"
                placeholder="e.g. AWS, Docker, Jenkins"
                value={newExp.techStack}
                onChange={(e) =>
                  setNewExp((prev) => ({ ...prev, techStack: e.target.value }))
                }
                className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Summary Description</label>
                <RichTextEditor
                  value={newExp.description}
                  onChange={(content: string) =>
                    setNewExp((prev) => ({ ...prev, description: content }))
                  }
                  placeholder="Summarize your impact..."
                  className="h-24 md:h-32"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Detailed Achievements</label>
                <RichTextEditor
                  value={newExp.roleDescription}
                  onChange={(content: string) =>
                    setNewExp((prev) => ({ ...prev, roleDescription: content }))
                  }
                  placeholder="Detailed responsibilities..."
                  className="h-44 md:h-56"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6">
              {/* Achievements Section */}
              <div className="bg-black/20 p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/5 space-y-4">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Key Achievements
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Optimized CI/CD by 40%"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddAchievement())
                    }
                    className="flex-1 p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg md:rounded-xl border border-white/10 transition-colors text-xs md:text-sm font-bold"
                  >
                    Add
                  </button>
                </div>
                {achievementsList.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {achievementsList.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-black/40 p-2 md:p-2.5 rounded-lg md:rounded-xl border border-white/5 group/item"
                      >
                        <span className="text-green-400 text-[10px]">✓</span>
                        <span className="flex-1 text-gray-300 text-[10px] md:text-xs line-clamp-2">
                          {achievement}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-gray-500 hover:text-red-400 font-bold transition-colors opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>              {/* Challenges Section */}
              <div className="bg-black/20 p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/5 space-y-4">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Key Challenges
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Scaling to 1M users"
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddChallenge())
                    }
                    className="flex-1 p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddChallenge}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg md:rounded-xl border border-white/10 transition-colors text-xs md:text-sm font-bold"
                  >
                    Add
                  </button>
                </div>
                {challengesList.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {challengesList.map((challenge, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-black/40 p-2 md:p-2.5 rounded-lg md:rounded-xl border border-white/5 group/item"
                      >
                        <span className="text-orange-400 text-[10px]">⚠</span>
                        <span className="flex-1 text-gray-300 text-[10px] md:text-xs line-clamp-2">
                          {challenge}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChallenge(index)}
                          className="text-gray-500 hover:text-red-400 font-bold transition-colors opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 pt-4 border-t border-white/5">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{editingId ? "Update" : "Create Experience"}</span>
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg md:rounded-xl border border-white/10 transition-all active:scale-[0.98] text-sm md:text-base"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {experience.map((exp) => (
            <div
              key={exp._id}
              className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg md:rounded-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all group/card"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    {exp.companyLogo && (
                      <img
                        src={exp.companyLogo}
                        alt={exp.company}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-white/20 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white truncate">
                        {exp.title}
                      </h3>
                      <p className="text-blue-400 font-semibold text-sm md:text-base">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-gray-400 text-[10px] md:text-xs">{exp.location}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-sm text-gray-400 mb-3 border-b border-white/5 pb-3">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })} - {exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : " Present"}
                    </span>
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techStack.slice(0, 4).map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300 text-[9px] md:text-xs rounded border border-blue-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {exp.techStack.length > 4 && (
                          <span className="text-[9px] text-gray-500 self-center">+{exp.techStack.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 md:line-clamp-none leading-relaxed">{exp.description}</p>
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                      <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-2">
                        🏆 Key Achievements
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                        {exp.achievements.slice(0, 4).map(
                          (achievement: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-[11px] md:text-sm text-gray-400 flex items-start gap-2"
                            >
                              <span className="text-green-500 mt-1 shrink-0">✓</span>
                              <span className="line-clamp-1">{achievement}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0 opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="flex-1 md:flex-none bg-blue-500/20 text-blue-300 border border-blue-500/50 px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-blue-500/30 transition-all active:scale-95 font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="flex-1 md:flex-none bg-red-500/20 text-red-300 border border-red-500/50 px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-red-500/30 transition-all active:scale-95 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceEdit;
