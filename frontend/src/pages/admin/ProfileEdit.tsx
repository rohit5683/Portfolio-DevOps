import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedBackground from '../../components/layout/AnimatedBackground';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [editingBadgeIndex, setEditingBadgeIndex] = useState<number>(-1);

  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/skills')
        ]);
        
        setProfile(profileRes.data);
        if (profileRes.data.photoUrl) {
          setPhotoPreview(profileRes.data.photoUrl);
        }
        setSkills(skillsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
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
      console.log('Saving section:', section);
      console.log('Profile data being sent:', JSON.stringify(profile, null, 2));
      await api.put(`/profile/${profile._id}`, profile);
      alert(`${section} updated successfully!`);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handleToggleFeatured = async (skillId: string, currentStatus: boolean) => {
    try {
      await api.put(`/skills/${skillId}`, { featured: !currentStatus });
      setSkills(skills.map(skill => 
        skill._id === skillId ? { ...skill, featured: !currentStatus } : skill
      ));
    } catch (error) {
      console.error('Failed to update skill', error);
      alert('Failed to update skill status');
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          <button 
            onClick={() => navigate('/portal')}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Profile Photo Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Profile Photo</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm text-center px-2">No photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700 file:cursor-pointer
                  cursor-pointer"
              />
              <p className="text-gray-400 text-xs text-center">Max size: 2MB</p>
              <button
                onClick={() => handleSave('Photo')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Photo
              </button>
            </div>
          </div>

          {/* Home Page Information Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Home Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Rohit Vishwakarma"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Role/Title</label>
                <input
                  type="text"
                  value={profile.role || ''}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="DevOps Engineer"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Tagline</label>
                <input
                  type="text"
                  value={profile.tagline || ''}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Building scalable infrastructure..."
                />
              </div>
              <button
                onClick={() => handleSave('Home Page')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Home Page
              </button>
            </div>
          </div>



          {/* Contact Information Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={profile.contact?.email || ''}
                  onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, email: e.target.value } })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Phone</label>
                <input
                  type="text"
                  value={profile.contact?.phone || ''}
                  onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, phone: e.target.value } })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="+91 XXX XXX XXXX"
                />
              </div>
              <button
                onClick={() => handleSave('Contact Information')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Contact Info
              </button>
            </div>
          </div>

          {/* Dynamic Roles Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Dynamic Roles (Typing Animation)</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newRole"
                  className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Add new role (e.g. Cloud Architect)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setProfile({ ...profile, roles: [...(profile.roles || []), input.value.trim()] });
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newRole') as HTMLInputElement;
                    if (input.value.trim()) {
                      setProfile({ ...profile, roles: [...(profile.roles || []), input.value.trim()] });
                      input.value = '';
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 text-sm md:text-base rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.roles?.map((role: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                    <span>{role}</span>
                    <button
                      onClick={() => {
                        const newRoles = [...profile.roles];
                        newRoles.splice(index, 1);
                        setProfile({ ...profile, roles: newRoles });
                      }}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSave('Roles')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Roles
              </button>
            </div>
          </div>

          {/* Homepage Statistics Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Homepage Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {profile.stats?.map((stat: any, index: number) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex gap-4 items-start">
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setProfile({
                  ...profile,
                  stats: [...(profile.stats || []), { label: 'New Stat', value: '0+', icon: '📊' }]
                })}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Add Statistic
              </button>
              <button
                onClick={() => handleSave('Statistics')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors"
              >
                Save Statistics
              </button>
            </div>
          </div>

          {/* Profile Badges Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Profile Badges</h2>
            <p className="text-gray-400 text-sm mb-4">Manage the badges displayed on your Home page. These appear as floating elements around your profile picture.</p>
            
            <div className="space-y-3 mb-6">
              {profile.badges?.map((badge: any, index: number) => {
                const isEditing = editingBadgeIndex === index;
                
                const getColorClass = (color: string) => {
                  switch (color) {
                    case 'green': return 'text-green-400';
                    case 'blue': return 'text-blue-400';
                    case 'purple': return 'text-purple-400';
                    case 'red': return 'text-red-400';
                    case 'orange': return 'text-orange-400';
                    default: return 'text-blue-400';
                  }
                };

                return (
                  <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 transition-all hover:bg-white/10">
                    {isEditing ? (
                      // Edit Mode
                      <div className="flex flex-col gap-3 animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-white">Editing Badge #{index + 1}</h3>
                          <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-bold shadow-sm">
                            <span className={`${getColorClass(badge.color)} mr-2`}>{badge.icon}</span> 
                            {badge.text || 'Badge Text'}
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
                            <span className={`${getColorClass(badge.color)} mr-2`}>{badge.icon}</span> 
                            {badge.text || 'Badge Text'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Position: <span className="text-gray-300">{badge.position}</span></span>
                            <span className="text-xs text-gray-400">Color: <span className="text-gray-300 capitalize">{badge.color}</span></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingBadgeIndex(index)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Badge"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this badge?')) {
                                const newBadges = [...(profile.badges || [])];
                                newBadges.splice(index, 1);
                                setProfile({ ...profile, badges: newBadges });
                              }
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Badge"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                  <p>No custom badges added yet. The Home page is currently showing default badges.</p>
                  <button
                    onClick={() => {
                      const defaultBadges = [
                        { text: 'Available for hire', icon: '●', color: 'green', position: 'top-right' },
                        { text: '5+ Years Exp', icon: '★', color: 'blue', position: 'bottom-left' }
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
                  const newBadge = { text: 'New Badge', icon: '✨', color: 'blue', position: 'top-right' };
                  const newBadges = [...(profile.badges || []), newBadge];
                  setProfile({ ...profile, badges: newBadges });
                  setEditingBadgeIndex(newBadges.length - 1); // Automatically enter edit mode
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Badge
              </button>
              <button
                onClick={() => handleSave('Badges')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 md:py-2 md:px-4 text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>



          {/* Core Technologies (Featured Skills) Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Core Technologies</h2>
                <p className="text-gray-400 text-sm">Select skills to display in the "Core Technologies" section on the home page.</p>
              </div>
              <button
                onClick={() => navigate('/portal/skills')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Skill
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div 
                  key={skill._id}
                  onClick={() => handleToggleFeatured(skill._id, skill.featured)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    skill.featured 
                      ? 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    skill.featured ? 'bg-blue-500 border-blue-500' : 'border-gray-500'
                  }`}>
                    {skill.featured && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 overflow-hidden">
                    {skill.iconUrl && (
                      <img src={skill.iconUrl} alt="" className="w-6 h-6 object-contain" />
                    )}
                    <span className={`text-sm font-medium truncate ${skill.featured ? 'text-white' : 'text-gray-400'}`}>
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
                <label className="block mb-2 text-gray-300 text-sm font-semibold">LinkedIn URL</label>
                <input
                  type="url"
                  value={profile.contact?.linkedin || ''}
                  onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, linkedin: e.target.value } })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">GitHub URL</label>
                <input
                  type="url"
                  value={profile.contact?.github || ''}
                  onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, github: e.target.value } })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">Twitter URL</label>
                <input
                  type="url"
                  value={profile.contact?.twitter || ''}
                  onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, twitter: e.target.value } })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              <button
                onClick={() => handleSave('Social Links')}
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
