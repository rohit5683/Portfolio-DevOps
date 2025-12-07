import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import UploadProgress from '../../components/common/UploadProgress';
import { getImageUrl } from '../../utils/imageUtils';

const ProjectsEdit = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ 
    title: '', 
    description: '', 
    techStack: '', 
    images: '',  // Comma-separated image URLs
    link: '', 
    githubLink: '',
    status: 'completed',
    featured: false,
    category: 'web',
    completionDate: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    api.get('/projects').then(res => setProjects(res.data)).catch(console.error);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setNewProject({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      images: project.images.join(', '),
      link: project.link || '',
      githubLink: project.githubLink || '',
      status: project.status || 'completed',
      featured: project.featured || false,
      category: project.category || 'web',
      completionDate: project.completionDate || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewProject({ 
      title: '', 
      description: '', 
      techStack: '', 
      images: '', 
      link: '', 
      githubLink: '', 
      status: 'completed', 
      featured: false, 
      category: 'web', 
      completionDate: '' 
    });
    setUploadedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (uploadedFiles.length === 0) return [];
    
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await api.post('/upload/projects', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });
      
      // Small delay to show 100%
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploading(false);
      setUploadProgress(0);
      return response.data.urls;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files. Please check file size (max 50MB) and type (Images).');
      setUploading(false);
      setUploadProgress(0);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload files if any
    let uploadedUrls: string[] = [];
    if (uploadedFiles.length > 0) {
      uploadedUrls = await uploadFiles();
      if (uploadedUrls.length === 0 && uploadedFiles.length > 0) {
        // Upload failed, stop submission
        return;
      }
    }
    
    // Combine uploaded URLs with manually entered URLs
    const urlsFromInput = newProject.images.split(',').map(img => img.trim()).filter(img => img);
    const allImageUrls = [...uploadedUrls, ...urlsFromInput];
    
    const projectData = {
      ...newProject,
      techStack: newProject.techStack.split(',').map(t => t.trim()),
      images: allImageUrls
    };
    
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, projectData);
        alert('Project updated successfully!');
      } else {
        await api.post('/projects', projectData);
        alert('Project created successfully!');
      }
      
      handleCancel(); // Reset form
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please check console for details.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      {uploading && (
        <UploadProgress 
          isUploading={true}
          progress={uploadProgress} 
          fileName={uploadedFiles.length === 1 ? uploadedFiles[0].name : `${uploadedFiles.length} files`} 
        />
      )}

      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Projects</h1>
          <button 
            onClick={() => navigate('/portal')}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="mb-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white">
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <select
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="web" className="text-black">Web Apps</option>
                <option value="devops" className="text-black">DevOps</option>
                <option value="cloud" className="text-black">Cloud</option>
                <option value="mobile" className="text-black">Mobile</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="completed" className="text-black">Completed</option>
                <option value="in-progress" className="text-black">In Progress</option>
                <option value="archived" className="text-black">Archived</option>
              </select>
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProject.featured}
                  onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="featured" className="text-white cursor-pointer">Featured Project</label>
              </div>
              <input
                type="date"
                value={newProject.completionDate}
                onChange={(e) => setNewProject({ ...newProject, completionDate: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Completion Date"
              />
            </div>

            <input
              type="text"
              placeholder="Tech Stack (comma separated, e.g. React, Node, AWS)"
              value={newProject.techStack}
              onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors h-32"
              required
            />
            
            {/* Image Upload Section */}
            <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white">Project Images</h3>
              
              {/* File Upload */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  📁 Upload Images (Max 10 files, 5MB each)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                />
                {uploadedFiles.length > 0 && (
                  <p className="text-green-400 text-sm mt-2">
                    ✓ {uploadedFiles.length} file(s) selected
                  </p>
                )}
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  🔗 Paste Image URLs (comma separated)
                </label>
                <textarea
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  value={newProject.images}
                  onChange={(e) => setNewProject({ ...newProject, images: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors h-24"
                />
              </div>
              
              <p className="text-gray-400 text-sm">
                💡 You can upload files, paste URLs, or use both methods together!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Live Demo Link (optional)"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="text"
                placeholder="GitHub Repository Link (optional)"
                value={newProject.githubLink}
                onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={uploading}
                className="flex-1 bg-green-600 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg text-white font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : (editingId ? 'Update Project' : 'Add Project')}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-3">{project.description}</p>
              
              {/* Image Preview */}
              {project.images && project.images.length > 0 && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                  {project.images.map((img: string, idx: number) => (
                    <img 
                      key={idx}
                      src={getImageUrl(img)} 
                      alt={`${project.title} - ${idx + 1}`}
                      className="h-20 w-32 object-cover rounded border border-white/20"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-3">
                {project.techStack?.map((tech: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Links Display */}
              <div className="flex gap-2 mb-3 text-sm">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    🔗 Live Demo
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                    💻 GitHub
                  </a>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(project)} 
                  className="flex-1 bg-blue-600 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded text-white hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(project._id)} 
                  className="flex-1 bg-red-600 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsEdit;
