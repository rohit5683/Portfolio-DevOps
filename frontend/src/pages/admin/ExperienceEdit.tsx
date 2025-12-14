import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";

const ExperienceEdit = () => {
  const navigate = useNavigate();
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
    setEditingId(exp._id);
    setNewExp({
      title: exp.title,
      company: exp.company,
      startDate: exp.startDate.split("T")[0],
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      description: exp.description,
      roleDescription: exp.roleDescription || "",
      companyLogo: exp.companyLogo || "",
      techStack: exp.techStack ? exp.techStack.join(", ") : "",
      achievements: "",
      location: exp.location || "",
    });
    setAchievementsList(exp.achievements || []);
    setChallengesList(exp.challenges || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    const expData = {
      ...newExp,
      techStack: newExp.techStack
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      achievements: achievementsList,
      challenges: challengesList,
    };

    if (editingId) {
      await api.put(`/experience/${editingId}`, expData);
    } else {
      await api.post("/experience", expData);
    }
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
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Experience</h1>
          <button
            onClick={() => navigate("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. DevOps Engineer"
                  value={newExp.title}
                  onChange={(e) =>
                    setNewExp({ ...newExp, title: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Corp"
                  value={newExp.company}
                  onChange={(e) =>
                    setNewExp({ ...newExp, company: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={newExp.companyLogo}
                  onChange={(e) =>
                    setNewExp({ ...newExp, companyLogo: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote, New York, NY"
                  value={newExp.location}
                  onChange={(e) =>
                    setNewExp({ ...newExp, location: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newExp.startDate}
                  onChange={(e) =>
                    setNewExp({ ...newExp, startDate: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  End Date (Leave empty if current)
                </label>
                <input
                  type="date"
                  value={newExp.endDate}
                  onChange={(e) =>
                    setNewExp({ ...newExp, endDate: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. AWS, Docker, Kubernetes, Jenkins"
                value={newExp.techStack}
                onChange={(e) =>
                  setNewExp({ ...newExp, techStack: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Brief overview of the role..."
                value={newExp.description}
                onChange={(e) =>
                  setNewExp({ ...newExp, description: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors h-24"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Detailed Role Description
              </label>
              <textarea
                placeholder="Comprehensive description of responsibilities and impact..."
                value={newExp.roleDescription}
                onChange={(e) =>
                  setNewExp({ ...newExp, roleDescription: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors h-48"
              />
            </div>

            {/* Achievements Section */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Key Achievements
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add an achievement..."
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddAchievement())
                  }
                  className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  Add
                </button>
              </div>
              {achievementsList.length > 0 && (
                <div className="space-y-2">
                  {achievementsList.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10"
                    >
                      <span className="text-green-400">✓</span>
                      <span className="flex-1 text-gray-300 text-sm">
                        {achievement}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(index)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Challenges Section */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Key Challenges
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a challenge..."
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddChallenge())
                  }
                  className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddChallenge}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  Add
                </button>
              </div>
              {challengesList.length > 0 && (
                <div className="space-y-2">
                  {challengesList.map((challenge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10"
                    >
                      <span className="text-orange-400">⚠</span>
                      <span className="flex-1 text-gray-300 text-sm">
                        {challenge}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChallenge(index)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg text-white font-bold hover:bg-green-700 transition-colors shadow-lg flex-1 md:flex-none"
              >
                {editingId ? "Update Experience" : "Add Experience"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-600 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg text-white font-bold hover:bg-gray-700 transition-colors shadow-lg flex-1 md:flex-none"
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
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {exp.companyLogo && (
                      <img
                        src={exp.companyLogo}
                        alt={exp.company}
                        className="w-12 h-12 rounded-lg object-cover border border-white/20"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {exp.title}
                      </h3>
                      <p className="text-blue-400 font-semibold">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-gray-400 text-xs">{exp.location}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    -
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : " Present"}
                  </p>
                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.techStack.map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-300 mb-3">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-3 bg-white/5 p-3 rounded border border-white/10">
                      <p className="text-xs text-purple-300 font-semibold mb-2">
                        🏆 Achievements:
                      </p>
                      <ul className="space-y-1">
                        {exp.achievements.map(
                          (achievement: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-300 flex items-start gap-2"
                            >
                              <span className="text-green-400">✓</span>
                              <span>{achievement}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="bg-blue-500/20 text-blue-300 border border-blue-500/50 px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="bg-red-500/20 text-red-300 border border-red-500/50 px-3 py-1 rounded text-xs md:text-sm hover:bg-red-500/30 transition-colors"
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
