import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedBackground from '../../components/layout/AnimatedBackground';

const AboutEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile').then(res => {
      setProfile(res.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleSave = async (section: string) => {
    try {
      await api.put(`/profile/${profile._id}`, profile);
      alert(`${section} updated successfully!`);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Edit About Section</h1>
          <button 
            onClick={() => navigate('/portal')}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About Page Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">About Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Headline</label>
                <input
                  type="text"
                  value={profile.headline || ''}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="AWS Certified Cloud Practitioner"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">About Text</label>
                <textarea
                  value={profile.about || ''}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white h-32 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Tell visitors about yourself..."
                />
              </div>
              <button
                onClick={() => handleSave('About Page')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save About
              </button>
            </div>
          </div>

          {/* About Page Subtitle */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">About Page Subtitle</h2>
            <div className="space-y-4">
              <textarea
                value={profile.aboutSubtitle || ''}
                onChange={(e) => setProfile({ ...profile, aboutSubtitle: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                rows={2}
                placeholder="DevOps Engineer passionate about automation and cloud infrastructure"
              />
              <button
                onClick={() => handleSave('About Subtitle')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Subtitle
              </button>
            </div>
          </div>

          {/* Location and Availability */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Location & Availability</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Location</label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="India"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Availability Status</label>
                <select
                  value={profile.availability?.status || 'available'}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    availability: { ...profile.availability, status: e.target.value }
                  })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Availability Message</label>
                <input
                  type="text"
                  value={profile.availability?.message || ''}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    availability: { ...profile.availability, message: e.target.value }
                  })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Open to opportunities"
                />
              </div>
              <button
                onClick={() => handleSave('Location & Availability')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Location & Availability
              </button>
            </div>
          </div>

          {/* About Page Highlights */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">About Page Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {profile.highlights?.map((highlight: any, index: number) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={highlight.icon}
                      onChange={(e) => {
                        const newHighlights = [...profile.highlights];
                        newHighlights[index].icon = e.target.value;
                        setProfile({ ...profile, highlights: newHighlights });
                      }}
                      className="w-16 p-2 rounded bg-white/5 border border-white/10 text-white text-center text-2xl"
                      placeholder="🏆"
                    />
                    <button
                      onClick={() => {
                        const newHighlights = [...profile.highlights];
                        newHighlights.splice(index, 1);
                        setProfile({ ...profile, highlights: newHighlights });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    value={highlight.title}
                    onChange={(e) => {
                      const newHighlights = [...profile.highlights];
                      newHighlights[index].title = e.target.value;
                      setProfile({ ...profile, highlights: newHighlights });
                    }}
                    className="w-full p-2 mb-2 rounded bg-white/5 border border-white/10 text-white"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={highlight.description}
                    onChange={(e) => {
                      const newHighlights = [...profile.highlights];
                      newHighlights[index].description = e.target.value;
                      setProfile({ ...profile, highlights: newHighlights });
                    }}
                    className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setProfile({
                  ...profile,
                  highlights: [...(profile.highlights || []), { icon: '🎯', title: 'New Highlight', description: 'Description here' }]
                })}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Add Highlight
              </button>
              <button
                onClick={() => handleSave('Highlights')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Highlights
              </button>
            </div>
          </div>

          {/* About Page Animated Stats */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">About Page Animated Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {profile.animatedStats?.map((stat: any, index: number) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...profile.animatedStats];
                        newStats[index].label = e.target.value;
                        setProfile({ ...profile, animatedStats: newStats });
                      }}
                      className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
                      placeholder="Label (e.g., Years Experience)"
                    />
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...profile.animatedStats];
                        newStats[index].value = parseInt(e.target.value) || 0;
                        setProfile({ ...profile, animatedStats: newStats });
                      }}
                      className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
                      placeholder="Value (number)"
                    />
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => {
                        const newStats = [...profile.animatedStats];
                        newStats[index].icon = e.target.value;
                        setProfile({ ...profile, animatedStats: newStats });
                      }}
                      className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
                      placeholder="Icon (emoji)"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newStats = [...profile.animatedStats];
                      newStats.splice(index, 1);
                      setProfile({ ...profile, animatedStats: newStats });
                    }}
                    className="text-red-400 hover:text-red-300 text-xl"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setProfile({
                  ...profile,
                  animatedStats: [...(profile.animatedStats || []), { label: 'New Stat', value: 0, icon: '📊' }]
                })}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Add Stat
              </button>
              <button
                onClick={() => handleSave('Animated Stats')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Animated Stats
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutEdit;
