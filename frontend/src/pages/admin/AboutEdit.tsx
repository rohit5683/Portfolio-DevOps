import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";

const AboutEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (section: string) => {
    try {
      await api.put(`/profile/${profile._id}`, profile);
      alert(`${section} updated successfully!`);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    }
  };

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Edit About Section</h1>
          <button
            onClick={() => navigate("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About Overview Section */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About Overview
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Quick Info & Status */}
              <div className="space-y-6 lg:border-r border-white/10 lg:pr-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-800"></span>
                    Availability
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Current Status</label>
                      <select
                        value={profile.availability?.status || "available"}
                        onChange={(e) => setProfile({
                          ...profile,
                          availability: { ...profile.availability, status: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                      >
                        <option value="available" className="text-black">Available</option>
                        <option value="busy" className="text-black">Busy</option>
                        <option value="unavailable" className="text-black">Unavailable</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Status Message</label>
                      <input
                        type="text"
                        value={profile.availability?.message || ""}
                        onChange={(e) => setProfile({
                          ...profile,
                          availability: { ...profile.availability, message: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="e.g., Open to new opportunities"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-800"></span>
                    Location
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Base Location</label>
                    <input
                      type="text"
                      value={profile.location || ""}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSave("About Overview")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Overview
                </button>
              </div>

              {/* Right Column: Detailed Narrative */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-800"></span>
                    Identity & Narrative
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Main Headline</label>
                      <input
                        type="text"
                        value={profile.headline || ""}
                        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all font-medium"
                        placeholder="e.g., AWS Certified Senior DevOps Engineer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Subtitle / Quick Bio</label>
                      <textarea
                        data-lenis-prevent
                        value={profile.aboutSubtitle || ""}
                        onChange={(e) => setProfile({ ...profile, aboutSubtitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all h-20 resize-none"
                        placeholder="A brief, high-impact summary of your expertise..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Full About Narrative</label>
                      <textarea
                        data-lenis-prevent
                        value={profile.about || ""}
                        onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all h-44 resize-none leading-relaxed"
                        placeholder="Tell your professional story, your journey, and what drives you..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Page Highlights */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Key Highlights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {profile.highlights?.map((highlight: any, index: number) => (
                <div
                  key={index}
                  className="bg-black/40 p-5 rounded-2xl border border-white/10 relative group/item transition-all hover:border-blue-500/30"
                >
                  <button
                    onClick={() => {
                      const newHighlights = [...profile.highlights];
                      newHighlights.splice(index, 1);
                      setProfile({ ...profile, highlights: newHighlights });
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-500/20"
                  >
                    ×
                  </button>
                  
                  <div className="flex gap-4">
                    <div className="space-y-1.5 flex-shrink-0">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1 text-center block">Icon</label>
                      <input
                        type="text"
                        value={highlight.icon}
                        onChange={(e) => {
                          const newHighlights = [...profile.highlights];
                          newHighlights[index].icon = e.target.value;
                          setProfile({ ...profile, highlights: newHighlights });
                        }}
                        className="w-14 h-14 p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-center text-2xl outline-none focus:border-blue-500/50"
                        placeholder="🏆"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Title</label>
                        <input
                          type="text"
                          value={highlight.title}
                          onChange={(e) => {
                            const newHighlights = [...profile.highlights];
                            newHighlights[index].title = e.target.value;
                            setProfile({ ...profile, highlights: newHighlights });
                          }}
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-blue-500/50"
                          placeholder="e.g., 50+ Projects Completed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Description</label>
                        <input
                          type="text"
                          value={highlight.description}
                          onChange={(e) => {
                            const newHighlights = [...profile.highlights];
                            newHighlights[index].description = e.target.value;
                            setProfile({ ...profile, highlights: newHighlights });
                          }}
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-blue-500/50"
                          placeholder="e.g., Successfully delivered high-impact tech solutions"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    highlights: [
                      ...(profile.highlights || []),
                      { icon: "🎯", title: "New Highlight", description: "Brief description here" },
                    ],
                  })
                }
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Highlight
              </button>
              <button
                onClick={() => handleSave("Highlights")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                Save Highlights
              </button>
            </div>
          </div>

          {/* About Page Animated Stats */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Animated Statistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {profile.animatedStats?.map((stat: any, index: number) => (
                <div
                  key={index}
                  className="bg-black/40 p-5 rounded-2xl border border-white/10 relative group/stat transition-all hover:border-purple-500/30"
                >
                  <button
                    onClick={() => {
                      const newStats = [...profile.animatedStats];
                      newStats.splice(index, 1);
                      setProfile({ ...profile, animatedStats: newStats });
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/stat:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-500/20"
                  >
                    ×
                  </button>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1 block text-center">Icon</label>
                      <input
                        type="text"
                        value={stat.icon}
                        onChange={(e) => {
                          const newStats = [...profile.animatedStats];
                          newStats[index].icon = e.target.value;
                          setProfile({ ...profile, animatedStats: newStats });
                        }}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xl text-center outline-none focus:border-purple-500/50"
                        placeholder="📊"
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...profile.animatedStats];
                          newStats[index].label = e.target.value;
                          setProfile({ ...profile, animatedStats: newStats });
                        }}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-purple-500/50"
                        placeholder="e.g., Code Commits"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Value</label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...profile.animatedStats];
                          newStats[index].value = parseInt(e.target.value) || 0;
                          setProfile({ ...profile, animatedStats: newStats });
                        }}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm text-center outline-none focus:border-purple-500/50"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    animatedStats: [
                      ...(profile.animatedStats || []),
                      { label: "New Statistic", value: 0, icon: "🔥" },
                    ],
                  })
                }
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Statistic
              </button>
              <button
                onClick={() => handleSave("Animated Stats")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                Save All Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEdit;
