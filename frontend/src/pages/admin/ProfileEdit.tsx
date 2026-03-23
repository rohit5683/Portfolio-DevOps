import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";
import { 
  Bold, Italic, Strikethrough, Link2, ListOrdered, List, Quote, Code, 
  Smile
} from "lucide-react";
import EmojiPicker from "../../components/common/EmojiPicker";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [editingBadgeIndex, setEditingBadgeIndex] = useState<number>(-1);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<number>(-1);

  const [skills, setSkills] = useState<any[]>([]);

  const ensureAchievements = () => {
    if (!profile) return [];
    if (Array.isArray(profile.achievements)) return profile.achievements;
    return [];
  };

  const createAchievement = () => ({
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `a-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: "solved",
    title: "New achievement",
    description: "",
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD (stored as string)
    tags: [],
    pinned: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          api.get("/profile"),
          api.get("/skills"),
        ]);

        setProfile(profileRes.data);
        if (profileRes.data.photoUrl) {
          setPhotoPreview(profileRes.data.photoUrl);
        }
        setSkills(skillsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setProfile({ ...profile, photoUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (section: string) => {
    try {
      console.log("Saving section:", section);
      console.log("Profile data being sent:", JSON.stringify(profile, null, 2));
      await api.put(`/profile/${profile._id}`, profile);
      alert(`${section} updated successfully!`);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    }
  };

  const handleToggleFeatured = async (
    skillId: string,
    currentStatus: boolean,
  ) => {
    try {
      await api.put(`/skills/${skillId}`, { featured: !currentStatus });
      setSkills(
        skills.map((skill) =>
          skill._id === skillId
            ? { ...skill, featured: !currentStatus }
            : skill,
        ),
      );
    } catch (error) {
      console.error("Failed to update skill", error);
      alert("Failed to update skill status");
    }
  };

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          <button
            onClick={() => navigate("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Identity & Contact Section */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Photo & Basic Stats */}
              <div className="flex flex-col items-center gap-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-[1.02]">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm text-center px-4">
                        No photo set
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-95 group-hover:ring-4 ring-blue-500/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="text-center space-y-1">
                  <p className="text-white font-bold text-lg">{profile.name || "Set your name"}</p>
                  <p className="text-blue-400 text-sm font-medium">{profile.role || "Set your role"}</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-2 px-3 py-1 bg-white/5 rounded-full inline-block">Pro Account</p>
                </div>

                <button
                  onClick={() => handleSave("Identity & Contact")}
                  className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Profile
                </button>
              </div>

              {/* Right Column: Detailed Forms */}
              <div className="flex-1 space-y-6">
                {/* Basic Info Grid */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-800"></span>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name || ""}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Rohit Vishwakarma"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Professional Title</label>
                      <input
                        type="text"
                        value={profile.role || ""}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="DevOps Engineer"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Tagline</label>
                      <input
                        type="text"
                        value={profile.tagline || ""}
                        onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Building scalable infrastructure and CI/CD pipelines..."
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info Grid */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-800"></span>
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Email Address</label>
                      <input
                        type="email"
                        value={profile.contact?.email || ""}
                        onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, email: e.target.value } })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Phone Number</label>
                      <input
                        type="text"
                        value={profile.contact?.phone || ""}
                        onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, phone: e.target.value } })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="+91 XXX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Roles Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-800"></span>
                    Dynamic Roles
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="newRole"
                        className="flex-1 p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Add new role (e.g. Cloud Architect)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              setProfile({
                                ...profile,
                                roles: [...(profile.roles || []), input.value.trim()],
                              });
                              input.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("newRole") as HTMLInputElement;
                          if (input.value.trim()) {
                            setProfile({
                              ...profile,
                              roles: [...(profile.roles || []), input.value.trim()],
                            });
                            input.value = "";
                          }
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-xl border border-white/10 transition-all text-sm font-bold active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.roles?.map((role: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full border border-blue-500/20 text-xs font-medium group/role hover:border-blue-500/40 transition-all"
                        >
                          <span>{role}</span>
                          <button
                            onClick={() => {
                              const newRoles = [...profile.roles];
                              newRoles.splice(index, 1);
                              setProfile({ ...profile, roles: newRoles });
                            }}
                            className="hover:text-red-400 transition-colors opacity-60 group-hover/role:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Homepage Statistics Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">
              Homepage Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {profile.stats?.map((stat: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg border border-white/10 flex gap-4 items-start"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...profile.stats];
                        newStats[index].label = e.target.value;
                        setProfile({ ...profile, stats: newStats });
                      }}
                      className="w-full p-2 rounded bg-black/20 border border-white/10 text-white text-sm"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...profile.stats];
                        newStats[index].value = e.target.value;
                        setProfile({ ...profile, stats: newStats });
                      }}
                      className="w-full p-2 rounded bg-black/20 border border-white/10 text-white text-sm"
                      placeholder="Value"
                    />
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => {
                        const newStats = [...profile.stats];
                        newStats[index].icon = e.target.value;
                        setProfile({ ...profile, stats: newStats });
                      }}
                      className="w-full p-2 rounded bg-black/20 border border-white/10 text-white text-sm"
                      placeholder="Icon (emoji)"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newStats = [...profile.stats];
                      newStats.splice(index, 1);
                      setProfile({ ...profile, stats: newStats });
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    stats: [
                      ...(profile.stats || []),
                      { label: "New Stat", value: "0+", icon: "📊" },
                    ],
                  })
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Add Statistic
              </button>
              <button
                onClick={() => handleSave("Statistics")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Statistics
              </button>
            </div>
          </div>

          {/* Profile Badges Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">
              Profile Badges
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Manage the badges displayed on your Home page. These appear as
              floating elements around your profile picture.
            </p>

            <div className="space-y-3 mb-6">
              {profile.badges?.map((badge: any, index: number) => {
                const isEditing = editingBadgeIndex === index;

                const getColorClass = (color: string) => {
                  switch (color) {
                    case "green":
                      return "text-green-400";
                    case "blue":
                      return "text-blue-400";
                    case "purple":
                      return "text-purple-400";
                    case "red":
                      return "text-red-400";
                    case "orange":
                      return "text-orange-400";
                    default:
                      return "text-blue-400";
                  }
                };

                return (
                  <div
                    key={index}
                    className="bg-white/5 p-4 rounded-lg border border-white/10 transition-all hover:bg-white/10"
                  >
                    {isEditing ? (
                      // Edit Mode
                      <div className="flex flex-col gap-3 animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-white">
                            Editing Badge #{index + 1}
                          </h3>
                          <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-bold shadow-sm">
                            <span
                              className={`${getColorClass(badge.color)} mr-2`}
                            >
                              {badge.icon}
                            </span>
                            {badge.text || "Badge Text"}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={badge.text}
                              onChange={(e) => {
                                const newBadges = [...(profile.badges || [])];
                                newBadges[index].text = e.target.value;
                                setProfile({ ...profile, badges: newBadges });
                              }}
                              className="flex-1 p-2 rounded bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500 outline-none"
                              placeholder="Badge Text"
                            />
                            <input
                              type="text"
                              value={badge.icon}
                              onChange={(e) => {
                                const newBadges = [...(profile.badges || [])];
                                newBadges[index].icon = e.target.value;
                                setProfile({ ...profile, badges: newBadges });
                              }}
                              className="w-16 p-2 rounded bg-black/20 border border-white/10 text-white text-sm text-center focus:border-blue-500 outline-none"
                              placeholder="Icon"
                            />
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={badge.color}
                              onChange={(e) => {
                                const newBadges = [...(profile.badges || [])];
                                newBadges[index].color = e.target.value;
                                setProfile({ ...profile, badges: newBadges });
                              }}
                              className="flex-1 p-2 rounded bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500 outline-none"
                            >
                              <option value="green">Green</option>
                              <option value="blue">Blue</option>
                              <option value="purple">Purple</option>
                              <option value="red">Red</option>
                              <option value="orange">Orange</option>
                            </select>
                            <select
                              value={badge.position}
                              onChange={(e) => {
                                const newBadges = [...(profile.badges || [])];
                                newBadges[index].position = e.target.value;
                                setProfile({ ...profile, badges: newBadges });
                              }}
                              className="flex-1 p-2 rounded bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500 outline-none"
                            >
                              <option value="top-right">Top Right</option>
                              <option value="bottom-left">Bottom Left</option>
                              <option value="top-left">Top Left</option>
                              <option value="bottom-right">Bottom Right</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => setEditingBadgeIndex(-1)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode (History List Item)
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-bold shadow-sm">
                            <span
                              className={`${getColorClass(badge.color)} mr-2`}
                            >
                              {badge.icon}
                            </span>
                            {badge.text || "Badge Text"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400">
                              Position:{" "}
                              <span className="text-gray-300">
                                {badge.position}
                              </span>
                            </span>
                            <span className="text-xs text-gray-400">
                              Color:{" "}
                              <span className="text-gray-300 capitalize">
                                {badge.color}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingBadgeIndex(index)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Badge"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this badge?",
                                )
                              ) {
                                const newBadges = [...(profile.badges || [])];
                                newBadges.splice(index, 1);
                                setProfile({ ...profile, badges: newBadges });
                              }
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Badge"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {(!profile.badges || profile.badges.length === 0) && (
                <div className="text-center py-8 text-gray-400 bg-white/5 rounded-lg border border-white/10 border-dashed flex flex-col items-center gap-4">
                  <p>
                    No custom badges added yet. The Home page is currently
                    showing default badges.
                  </p>
                  <button
                    onClick={() => {
                      const defaultBadges = [
                        {
                          text: "Available for hire",
                          icon: "●",
                          color: "green",
                          position: "top-right",
                        },
                        {
                          text: "5+ Years Exp",
                          icon: "★",
                          color: "blue",
                          position: "bottom-left",
                        },
                      ];
                      setProfile({ ...profile, badges: defaultBadges });
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-semibold border border-white/10"
                  >
                    Load Default Badges to Edit
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const newBadge = {
                    text: "New Badge",
                    icon: "✨",
                    color: "blue",
                    position: "top-right",
                  };
                  const newBadges = [...(profile.badges || []), newBadge];
                  setProfile({ ...profile, badges: newBadges });
                  setEditingBadgeIndex(newBadges.length - 1); // Automatically enter edit mode
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Badge
              </button>
              <button
                onClick={() => handleSave("Badges")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save Changes
              </button>
            </div>
          </div>

          {/* Recent Achievements (Home Feed) Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Recent Achievements (Home Feed)
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Add your “news feed” updates like problems solved, things you
                  learned, improvements, and shipped features.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const current = ensureAchievements();
                    const newAchievement = createAchievement();
                    const next = [...current, newAchievement];
                    setProfile({ ...profile, achievements: next });
                    setEditingAchievementIndex(next.length - 1);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("Achievements")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {ensureAchievements().length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-white/5 rounded-lg border border-white/10 border-dashed">
                  No achievements yet. Click <span className="text-white">Add</span>{" "}
                  to create your first update.
                </div>
              ) : (
                ensureAchievements().map((a: any, index: number) => {
                  const isEditing = editingAchievementIndex === index;
                  const getMeta = (type?: string) => {
                    switch (type) {
                      case "learned": return { icon: "🧠", color: "text-purple-400" };
                      case "shipped": return { icon: "🚀", color: "text-blue-400" };
                      case "improved": return { icon: "⚙️", color: "text-orange-400" };
                      default: return { icon: "✅", color: "text-green-400" };
                    }
                  };
                  const meta = getMeta(a.type);

                  return (
                    <div
                      key={a.id || index}
                      className="bg-white/5 p-4 rounded-lg border border-white/10 transition-all hover:bg-white/10"
                    >
                      {isEditing ? (
                        /* Edit Mode */
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3 pb-3 border-b border-white/5">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-sm font-bold text-white">Editing Achievement #{index + 1}</h3>
                              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-xl">
                                <input
                                  type="checkbox"
                                  checked={!!a.pinned}
                                  onChange={(e) => {
                                    const next = [...ensureAchievements()];
                                    next[index] = { ...next[index], pinned: e.target.checked };
                                    setProfile({ ...profile, achievements: next });
                                  }}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <span className="text-[10px] text-gray-200 font-semibold">Pinned</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingAchievementIndex(-1)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg"
                              >
                                Done
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Type</label>
                              <select
                                value={a.type || "solved"}
                                onChange={(e) => {
                                  const next = [...ensureAchievements()];
                                  next[index] = { ...next[index], type: e.target.value };
                                  setProfile({ ...profile, achievements: next });
                                }}
                                className="p-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500 outline-none"
                              >
                                <option value="solved">Solved ✅</option>
                                <option value="learned">Learned 🧠</option>
                                <option value="shipped">Shipped 🚀</option>
                                <option value="improved">Improved ⚙️</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Date</label>
                              <input
                                type="date"
                                value={typeof a.date === "string" ? a.date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
                                onChange={(e) => {
                                  const next = [...ensureAchievements()];
                                  next[index] = { ...next[index], date: e.target.value };
                                  setProfile({ ...profile, achievements: next });
                                }}
                                className="p-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500 outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Tags (CSV)</label>
                              <input
                                type="text"
                                value={Array.isArray(a.tags) ? a.tags.join(", ") : a.tags || ""}
                                onChange={(e) => {
                                  const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                                  const next = [...ensureAchievements()];
                                  next[index] = { ...next[index], tags };
                                  setProfile({ ...profile, achievements: next });
                                }}
                                className="p-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500 outline-none"
                                placeholder="AWS, CI/CD..."
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Title</label>
                            <input
                              type="text"
                              value={a.title || ""}
                              onChange={(e) => {
                                const next = [...ensureAchievements()];
                                next[index] = { ...next[index], title: e.target.value };
                                setProfile({ ...profile, achievements: next });
                              }}
                              className="w-full p-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500 outline-none font-semibold"
                              placeholder="Key achievement title..."
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 group/editor">
                            <label className="text-[10px] font-bold text-gray-500 uppercase px-1 transition-colors group-focus-within/editor:text-blue-400">
                              Description
                            </label>
                            <div className="flex flex-col rounded-xl bg-black/40 border border-white/10 overflow-hidden focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-xl">
                              {/* Top Toolbar: Formatting */}
                              <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-white/5 bg-white/5">
                                {[
                                  { icon: <Bold className="w-4 h-4" />, action: "**", title: "Bold" },
                                  { icon: <Italic className="w-4 h-4" />, action: "*", title: "Italic" },
                                  { icon: <Strikethrough className="w-4 h-4" />, action: "~~", title: "Strikethrough" },
                                  { icon: <div className="w-px h-4 bg-white/10 mx-1" />, separator: true },
                                  { icon: <Link2 className="w-4 h-4" />, action: "[", title: "Link" },
                                  { icon: <ListOrdered className="w-4 h-4" />, action: "1. ", title: "Ordered List" },
                                  { icon: <List className="w-4 h-4" />, action: "• ", title: "Bullet List" },
                                  { icon: <Quote className="w-4 h-4" />, action: "> ", title: "Quote" },
                                  { icon: <Code className="w-4 h-4" />, action: "`", title: "Inline Code" },
                                ].map((btn, i) => 
                                  btn.separator ? (
                                    <div key={i}>{btn.icon}</div>
                                  ) : (
                                    <button
                                      key={i}
                                      type="button"
                                      title={btn.title}
                                        onClick={() => {
                                          if (btn.separator) return;
                                          const marker = btn.action as string;
                                          const needsNewline = marker === '• ' || marker === '1. ' || marker === '> ';
                                          
                                          setProfile((prev: any) => {
                                            if (!prev) return prev;
                                            const next = Array.isArray(prev.achievements) ? [...prev.achievements] : [];
                                            if (!next[index]) return prev;
                                            
                                            const current = next[index].description || "";
                                            const newText = current + (current && !current.endsWith('\n') && needsNewline ? '\n' : '') + marker;
                                            
                                            next[index] = { ...next[index], description: newText };
                                            return { ...prev, achievements: next };
                                          });
                                        }}
                                      className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all active:scale-95"
                                    >
                                      {btn.icon}
                                    </button>
                                  )
                                )}
                              </div>

                              {/* Textarea */}
                              <textarea
                                data-lenis-prevent
                                value={a.description || ""}
                                onChange={(e) => {
                                  const next = [...ensureAchievements()];
                                  next[index] = { ...next[index], description: e.target.value };
                                  setProfile({ ...profile, achievements: next });
                                }}
                                className="w-full p-4 bg-transparent text-white text-sm focus:outline-none h-40 leading-relaxed font-sans placeholder:text-gray-600"
                                placeholder="Message #achievements"
                              />

                              {/* Bottom Tray: Extras */}
                              <div className="flex items-center justify-between p-2 border-t border-white/5 bg-white/5 relative">
                                  <div className="flex items-center gap-1">
                                    <div className="relative group/emoji">
                                      <button 
                                        type="button" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const picker = document.getElementById(`emoji-picker-${index}`);
                                          if (picker) picker.classList.toggle('hidden');
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-yellow-400 transition-colors"
                                      >
                                        <Smile className="w-4 h-4" />
                                      </button>
                                      <div id={`emoji-picker-${index}`} className="hidden absolute bottom-full left-0 mb-2">
                                        <EmojiPicker 
                                          onEmojiSelect={(emoji: string) => {
                                            setProfile((prev: any) => {
                                              if (!prev) return prev;
                                              const next = Array.isArray(prev.achievements) ? [...prev.achievements] : [];
                                              if (!next[index]) return prev;
                                              
                                              next[index] = { ...next[index], description: (next[index].description || "") + emoji };
                                              return { ...prev, achievements: next };
                                            });
                                            document.getElementById(`emoji-picker-${index}`)?.classList.add('hidden');
                                          }}
                                          onClose={() => document.getElementById(`emoji-picker-${index}`)?.classList.add('hidden')}
                                        />
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                            <p className="mt-1.5 text-[9px] text-gray-600 italic px-1 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-blue-500/50" />
                              <span>Markdown supported: **bold**, *italic*, ~~strike~~, `inline code`</span>
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (index === 0) return;
                                  const next = [...ensureAchievements()];
                                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                  setProfile({ ...profile, achievements: next });
                                  setEditingAchievementIndex(index - 1);
                                }}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded border border-white/5 disabled:opacity-30"
                                disabled={index === 0}
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const cur = ensureAchievements();
                                  if (index >= cur.length - 1) return;
                                  const next = [...cur];
                                  [next[index], next[index + 1]] = [next[index + 1], next[index]];
                                  setProfile({ ...profile, achievements: next });
                                  setEditingAchievementIndex(index + 1);
                                }}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded border border-white/5 disabled:opacity-30"
                                disabled={index === ensureAchievements().length - 1}
                                title="Move down"
                              >
                                ↓
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Delete this achievement?")) {
                                  const next = [...ensureAchievements()];
                                  next.splice(index, 1);
                                  setProfile({ ...profile, achievements: next });
                                  setEditingAchievementIndex(-1);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <div className="flex items-center justify-between group/view">
                          <div className="flex items-center gap-4 min-w-0">
                            <span className="text-xl bg-white/10 w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 shadow-inner">
                              {meta.icon}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                {a.pinned && (
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 uppercase tracking-wider">
                                    Pinned
                                  </span>
                                )}
                                <h3 className="text-white font-bold text-sm truncate">
                                  {a.title || "Untitled Achievement"}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <span className={meta.color + " font-bold uppercase tracking-widest"}>{a.type}</span>
                                <span>•</span>
                                <span>{a.date ? new Date(a.date).toLocaleDateString() : "No date"}</span>
                                {a.tags?.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[150px]">{a.tags.join(", ")}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover/view:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setEditingAchievementIndex(index)}
                              className="p-2 text-blue-400 hover:text-blue-300 bg-blue-400/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Delete this achievement?")) {
                                  const next = [...ensureAchievements()];
                                  next.splice(index, 1);
                                  setProfile({ ...profile, achievements: next });
                                }
                              }}
                              className="p-2 text-red-400 hover:text-red-300 bg-red-400/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Core Technologies (Featured Skills) Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Core Technologies
                </h2>
                <p className="text-gray-400 text-sm">
                  Select skills to display in the "Core Technologies" section on
                  the home page.
                </p>
              </div>
              <button
                onClick={() => navigate("/portal/skills")}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  onClick={() =>
                    handleToggleFeatured(skill._id, skill.featured)
                  }
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    skill.featured
                      ? "bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      skill.featured
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-500"
                    }`}
                  >
                    {skill.featured && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 overflow-hidden">
                    {skill.iconUrl && (
                      <img
                        src={skill.iconUrl}
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span
                      className={`text-sm font-medium truncate ${skill.featured ? "text-white" : "text-gray-400"}`}
                    >
                      {skill.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={profile.contact?.linkedin || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contact: { ...profile.contact, linkedin: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={profile.contact?.github || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contact: { ...profile.contact, github: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={profile.contact?.twitter || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contact: { ...profile.contact, twitter: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              <button
                onClick={() => handleSave("Social Links")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Social Links
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
