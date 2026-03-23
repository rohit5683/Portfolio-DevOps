import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";
import UploadProgress from "../../components/common/UploadProgress";
import { getImageUrl } from "../../utils/imageUtils";
import { 
  Bold, Italic, Strikethrough, Link2, ListOrdered, List, Quote, Code, 
  Smile, ExternalLink, Github
} from "lucide-react";
import EmojiPicker from "../../components/common/EmojiPicker";
import RichText from "../../components/common/RichText";

const ProjectsEdit = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "",
    images: "", // Comma-separated image URLs
    link: "",
    githubLink: "",
    status: "completed",
    featured: false,
    category: "web",
    completionDate: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch(console.error);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setNewProject({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      images: project.images.join(", "),
      link: project.link || "",
      githubLink: project.githubLink || "",
      status: project.status || "completed",
      featured: project.featured || false,
      category: project.category || "web",
      completionDate: project.completionDate || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewProject({
      title: "",
      description: "",
      techStack: "",
      images: "",
      link: "",
      githubLink: "",
      status: "completed",
      featured: false,
      category: "web",
      completionDate: "",
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
    uploadedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await api.post("/upload/projects", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Small delay to show 100%
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploading(false);
      setUploadProgress(0);
      return response.data.urls;
    } catch (error) {
      console.error("Upload failed:", error);
      alert(
        "Failed to upload files. Please check file size (max 50MB) and type (Images).",
      );
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
    const urlsFromInput = newProject.images
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img);
    const allImageUrls = [...uploadedUrls, ...urlsFromInput];

    const projectData = {
      ...newProject,
      techStack: newProject.techStack.split(",").map((t) => t.trim()),
      images: allImageUrls,
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, projectData);
        alert("Project updated successfully!");
      } else {
        await api.post("/projects", projectData);
        alert("Project created successfully!");
      }

      handleCancel(); // Reset form
      fetchProjects();
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Please check console for details.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />

      {uploading && (
        <UploadProgress
          isUploading={true}
          progress={uploadProgress}
          fileName={
            uploadedFiles.length === 1
              ? uploadedFiles[0].name
              : `${uploadedFiles.length} files`
          }
        />
      )}

      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Projects</h1>
          <button
            onClick={() => navigate("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Aura Dashboard"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Category</label>
                <select
                  value={newProject.category}
                  onChange={(e) =>
                    setNewProject({ ...newProject, category: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all cursor-pointer"
                >
                  <option value="web" className="text-black">Web Apps</option>
                  <option value="devops" className="text-black">DevOps</option>
                  <option value="cloud" className="text-black">Cloud</option>
                  <option value="mobile" className="text-black">Mobile</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all cursor-pointer"
                >
                  <option value="completed" className="text-black">Completed</option>
                  <option value="in-progress" className="text-black">In Progress</option>
                  <option value="archived" className="text-black">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Completion Date</label>
                <input
                  type="date"
                  value={newProject.completionDate}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      completionDate: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                />
              </div>
              <div className="flex items-end pb-1.5">
                <div 
                  className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group/feat"
                  onClick={() => setNewProject({ ...newProject, featured: !newProject.featured })}
                >
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProject.featured}
                    onChange={(e) =>
                      setNewProject({ ...newProject, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-white/20 bg-transparent text-blue-500 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs text-gray-400 cursor-pointer group-hover/feat:text-white transition-colors">
                    Featured Project
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Tech Stack</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node, Docker, AWS"
                  value={newProject.techStack}
                  onChange={(e) =>
                    setNewProject({ ...newProject, techStack: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
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
                          
                          setNewProject(prev => {
                            const current = prev.description || "";
                            return { 
                              ...prev, 
                              description: current + (current && !current.endsWith('\n') && needsNewline ? '\n' : '') + marker 
                            };
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
                  value={newProject.description || ""}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-4 bg-transparent text-white text-sm focus:outline-none h-48 leading-relaxed font-sans placeholder:text-gray-600"
                  placeholder="Describe your project..."
                  required
                />

                {/* Bottom Tray: Extras */}
                <div className="flex items-center justify-between p-2 border-t border-white/5 bg-white/5 relative">
                  <div className="flex items-center gap-1">
                    <div className="relative group/emoji">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          const picker = document.getElementById('project-emoji-picker');
                          if (picker) picker.classList.toggle('hidden');
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-yellow-400 transition-colors"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <div id="project-emoji-picker" className="hidden absolute bottom-full left-0 mb-2">
                        <EmojiPicker 
                          onEmojiSelect={(emoji: string) => {
                            setNewProject(prev => ({ 
                              ...prev, 
                              description: (prev.description || "") + emoji 
                            }));
                            document.getElementById('project-emoji-picker')?.classList.add('hidden');
                          }}
                          onClose={() => document.getElementById('project-emoji-picker')?.classList.add('hidden')}
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

            {/* Image Upload Section */}
            <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white">
                Project Images
              </h3>

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
                  data-lenis-prevent
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  value={newProject.images}
                  onChange={(e) =>
                    setNewProject({ ...newProject, images: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors h-24"
                />
              </div>

              <p className="text-gray-400 text-sm">
                💡 You can upload files, paste URLs, or use both methods
                together!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Live Demo Link</label>
                <div className="relative group/link">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/link:text-blue-500 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://your-site.com"
                    value={newProject.link}
                    onChange={(e) =>
                      setNewProject({ ...newProject, link: e.target.value })
                    }
                    className="w-full pl-10 p-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase px-1">GitHub Repository</label>
                <div className="relative group/link">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/link:text-blue-500 transition-colors">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://github.com/user/repo"
                    value={newProject.githubLink}
                    onChange={(e) =>
                      setNewProject({ ...newProject, githubLink: e.target.value })
                    }
                    className="w-full pl-10 p-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{editingId ? "Update Project" : "Create Project"}</span>
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {project.title}
              </h3>
              <div className="text-gray-300 mb-3 text-sm line-clamp-3 overflow-hidden">
                <RichText text={project.description || ""} />
              </div>

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
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links Display */}
              <div className="flex gap-2 mb-3 text-sm">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    🔗 Live Demo
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300"
                  >
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
