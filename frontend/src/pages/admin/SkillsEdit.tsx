import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedBackground from '../../components/layout/AnimatedBackground';

const SkillsEdit = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    iconUrl: '',
    category: 'tools',
    proficiency: 75,
    yearsOfExperience: 0,
    featured: false,
  });

  const categories = [
    { value: 'cloud', label: 'Cloud', icon: '☁️' },
    { value: 'devops', label: 'DevOps', icon: '⚙️' },
    { value: 'programming', label: 'Programming', icon: '💻' },
    { value: 'database', label: 'Database', icon: '🗄️' },
    { value: 'tools', label: 'Tools', icon: '🛠️' },
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    api.get('/skills')
      .then(res => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch skills', err);
        setLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'proficiency' || name === 'yearsOfExperience' ? Number(value) : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      api.put(`/skills/${editingId}`, formData)
        .then(() => {
          fetchSkills();
          resetForm();
        })
        .catch(err => console.error('Failed to update skill', err));
    } else {
      api.post('/skills', formData)
        .then(() => {
          fetchSkills();
          resetForm();
        })
        .catch(err => console.error('Failed to create skill', err));
    }
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      iconUrl: skill.iconUrl || '',
      category: skill.category || 'tools',
      proficiency: skill.proficiency || 75,
      yearsOfExperience: skill.yearsOfExperience || 0,
      featured: skill.featured || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      api.delete(`/skills/${id}`)
        .then(() => fetchSkills())
        .catch(err => console.error('Failed to delete skill', err));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      iconUrl: '',
      category: 'tools',
      proficiency: 75,
      yearsOfExperience: 0,
      featured: false,
    });
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await api.post('/upload/skills', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setFormData(prev => ({
        ...prev,
        iconUrl: response.data.url,
      }));
    } catch (error) {
      console.error('Failed to upload icon', error);
      alert('Failed to upload icon. Please try again.');
    }
  };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 60) return 'Intermediate';
    return 'Beginner';
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return 'from-green-500 to-emerald-500';
    if (proficiency >= 75) return 'from-blue-500 to-cyan-500';
    if (proficiency >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return <div className="container mx-auto text-center text-white text-xl mt-20">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Skills</h1>
          <button 
            onClick={() => navigate('/portal')}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Icon URL</label>
                <input
                  type="text"
                  name="iconUrl"
                  value={formData.iconUrl}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/icon.png"
                />
                <div className="mt-2">
                  <label className="block text-gray-400 text-xs mb-1">Or upload icon:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                  />
                </div>
                {formData.iconUrl && (
                  <div className="mt-2">
                    <img src={formData.iconUrl} alt="Icon preview" className="w-12 h-12 object-contain bg-white/10 rounded-lg p-2" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value} className="text-black">
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Proficiency: {formData.proficiency}% ({getProficiencyLabel(formData.proficiency)})
                </label>
                <input
                  type="range"
                  name="proficiency"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  min="0"
                  max="50"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-gray-300 text-sm font-medium">
                Featured (Show on Homepage as Core Technology)
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingId ? 'Update Skill' : 'Add Skill'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skills List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => {
            const category = categories.find(c => c.value === skill.category);
            return (
              <div
                key={skill._id}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-blue-500/30 transition-all relative"
              >
                {skill.featured && (
                  <div className="absolute top-4 right-4 text-yellow-400" title="Featured Skill">
                    ⭐
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {skill.iconUrl && (
                      <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                      <span className="text-xs text-gray-400">
                        {category?.icon} {category?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Proficiency</span>
                    <span className="text-xs font-bold text-white">
                      {skill.proficiency}% - {getProficiencyLabel(skill.proficiency)}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} rounded-full`}
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>

                {skill.yearsOfExperience > 0 && (
                  <div className="mb-4 text-sm text-gray-300">
                    📅 {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''} experience
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
            <p className="text-gray-400 text-lg">No skills added yet. Add your first skill above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsEdit;
