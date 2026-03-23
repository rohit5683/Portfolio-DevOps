import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";

const SkillsEdit = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    iconUrl: "",
    category: "tools",
    proficiency: 75,
    yearsOfExperience: 0,
    featured: false,
  });

  const categories = [
    { value: "cloud", label: "Cloud", icon: "☁️" },
    { value: "devops", label: "DevOps", icon: "⚙️" },
    { value: "programming", label: "Programming", icon: "💻" },
    { value: "database", label: "Database", icon: "🗄️" },
    { value: "tools", label: "Tools", icon: "🛠️" },
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    api
      .get("/skills")
      .then((res) => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch skills", err);
        setLoading(false);
      });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "proficiency" || name === "yearsOfExperience"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      api
        .put(`/skills/${editingId}`, formData)
        .then(() => {
          fetchSkills();
          resetForm();
        })
        .catch((err) => console.error("Failed to update skill", err));
    } else {
      api
        .post("/skills", formData)
        .then(() => {
          fetchSkills();
          resetForm();
        })
        .catch((err) => console.error("Failed to create skill", err));
    }
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      iconUrl: skill.iconUrl || "",
      category: skill.category || "tools",
      proficiency: skill.proficiency || 75,
      yearsOfExperience: skill.yearsOfExperience || 0,
      featured: skill.featured || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      api
        .delete(`/skills/${id}`)
        .then(() => fetchSkills())
        .catch((err) => console.error("Failed to delete skill", err));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      iconUrl: "",
      category: "tools",
      proficiency: 75,
      yearsOfExperience: 0,
      featured: false,
    });
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await api.post("/upload/skills", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        iconUrl: response.data.url,
      }));
    } catch (error) {
      console.error("Failed to upload icon", error);
      alert("Failed to upload icon. Please try again.");
    }
  };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return "Expert";
    if (proficiency >= 75) return "Advanced";
    if (proficiency >= 60) return "Intermediate";
    return "Beginner";
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return "from-green-500 to-emerald-500";
    if (proficiency >= 75) return "from-blue-500 to-cyan-500";
    if (proficiency >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  if (loading) {
    return (
      <div className="container mx-auto text-center text-white text-xl mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-3 py-6 md:px-4 md:py-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-white">Manage Skills</h1>
          <button
            onClick={() => navigate("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/20 mb-6 md:mb-8 shadow-xl">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 border-b border-white/5 pb-3">
            {editingId ? "Edit Skill" : "Add New Skill"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Skill Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. React.js"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm md:text-base"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer text-sm md:text-base"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-gray-900">
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1 flex justify-between">
                  <span>Proficiency</span>
                  <span className="text-blue-400 font-bold">{formData.proficiency}%</span>
                </label>
                <div className="flex items-center gap-3 h-9 md:h-10 px-1">
                  <input
                    type="range"
                    name="proficiency"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={handleInputChange}
                    className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Icon URL</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="iconUrl"
                      value={formData.iconUrl}
                      onChange={handleInputChange}
                      className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                      placeholder="https://example.com/icon.png"
                    />
                  </div>
                  {formData.iconUrl && (
                    <div className="shrink-0">
                      <img
                        src={formData.iconUrl}
                        alt="Preview"
                        className="w-9 h-9 md:w-10 md:h-10 object-contain bg-white/5 rounded-lg md:rounded-xl border border-white/10 p-1.5"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Or Upload Icon</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-gray-400 text-xs md:text-sm group-hover:border-blue-500/50 transition-all flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="truncate">Click to upload icon</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  min="0"
                  max="50"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3 h-9 md:h-11 px-4 bg-black/40 rounded-lg md:rounded-xl border border-white/10 group cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 md:w-5 md:h-5 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500/50 transition-all cursor-pointer"
                />
                <label
                  htmlFor="featured"
                  className="text-[10px] md:text-xs font-medium text-gray-400 cursor-pointer group-hover:text-gray-300 transition-colors"
                >
                  Featured Skill (Homepage Visibility)
                </label>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 pt-3 md:pt-4 border-t border-white/5 text-sm md:text-base">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{editingId ? "Update" : "Save Skill"}</span>
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg md:rounded-xl border border-white/10 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skills List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {skills.map((skill) => {
            const category = categories.find((c) => c.value === skill.category);
            return (
              <div
                key={skill._id}
                className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg md:rounded-xl border border-white/20 hover:border-blue-500/30 transition-all relative"
              >
                {skill.featured && (
                  <div
                    className="absolute top-4 right-4 text-yellow-400"
                    title="Featured Skill"
                  >
                    ⭐
                  </div>
                )}
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2.5 md:gap-3">
                    {skill.iconUrl && (
                      <img
                        src={skill.iconUrl}
                        alt={skill.name}
                        className="w-8 h-8 md:w-10 md:h-10 object-contain shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-white truncate">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] md:text-xs text-gray-400">
                        {category?.icon} {category?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3 md:mb-4">
                  <div className="flex justify-between items-center mb-1.5 md:mb-2 text-[10px] md:text-xs">
                    <span className="text-gray-400">Proficiency</span>
                    <span className="font-bold text-white">
                      {skill.proficiency}% -{" "}
                      {getProficiencyLabel(skill.proficiency)}
                    </span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} rounded-full`}
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>

                {skill.yearsOfExperience > 0 && (
                  <div className="mb-4 text-sm text-gray-300">
                    📅 {skill.yearsOfExperience} year
                    {skill.yearsOfExperience !== 1 ? "s" : ""} experience
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs md:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs md:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No skills added yet. Add your first skill above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsEdit;
