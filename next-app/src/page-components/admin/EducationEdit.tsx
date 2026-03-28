"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";
import UploadProgress from "../../components/common/UploadProgress";
import RichTextEditor from "../../components/admin/RichTextEditor";
import RichText from "../../components/common/RichText";

const EducationEdit = () => {
  const navigate = useRouter();
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    schoolCollege: "",
    boardUniversity: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
    gradeType: "Percentage",
    description: "",
    documents: "", // Comma-separated URLs
    level: "undergraduate",
    status: "completed",
    featured: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = () => {
    api
      .get("/education")
      .then((res) => {
        setEducation(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch education", err);
        setLoading(false);
      });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const uploadFiles = async (): Promise<string[]> => {
    if (uploadedFiles.length === 0) return [];

    setUploading(true);
    setUploadProgress(0);
    const formDataUpload = new FormData();
    uploadedFiles.forEach((file) => {
      formDataUpload.append("documents", file);
    });

    try {
      const response = await api.post("/upload/education", formDataUpload, {
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
        "Failed to upload files. Please check file size (max 50MB) and type (Images/PDF).",
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
    const urlsFromInput = formData.documents
      .split(",")
      .map((doc) => doc.trim())
      .filter((doc) => doc);
    const allDocumentUrls = [...uploadedUrls, ...urlsFromInput];

    const eduData = {
      ...formData,
      documents: allDocumentUrls,
    };

    try {
      if (editingId) {
        await api.put(`/education/${editingId}`, eduData);
        alert("Education updated successfully!");
      } else {
        await api.post("/education", eduData);
        alert("Education added successfully!");
      }
      setEditingId(null);
      setFormData({
        schoolCollege: "",
        boardUniversity: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        gradeType: "Percentage",
        description: "",
        documents: "",
        level: "undergraduate",
        status: "completed",
        featured: false,
      });
      setUploadedFiles([]);
      fetchEducation();
    } catch (error) {
      console.error("Failed to save education", error);
      alert("Failed to save education. Please check console for details.");
    }
  };

  const handleEdit = (edu: any) => {
    setEditingId(edu._id);
    setFormData({
      schoolCollege: edu.schoolCollege || "",
      boardUniversity: edu.boardUniversity || edu.school || "", // Backward compatibility
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      grade: edu.grade || "",
      gradeType: edu.gradeType || "Percentage",
      description: edu.description || "",
      documents: edu.documents?.join(", ") || "",
      level: edu.level || "undergraduate",
      status: edu.status || "completed",
      featured: edu.featured || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this education entry?")
    ) {
      try {
        await api.delete(`/education/${id}`);
        fetchEducation();
      } catch (error) {
        console.error("Failed to delete education", error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      schoolCollege: "",
      boardUniversity: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
      gradeType: "Percentage",
      description: "",
      documents: "",
      level: "undergraduate",
      status: "completed",
      featured: false,
    });
    setUploadedFiles([]);
  };

  if (loading)
    return (
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 text-white text-center mt-20">
          Loading...
        </div>
      </div>
    );

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

      <div className="relative z-10 container mx-auto px-3 py-6 md:px-4 md:py-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-white">Manage Education</h1>
          <button
            onClick={() => navigate.push("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-6 md:mb-8 bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl border border-white/20 shadow-xl w-full">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white border-b border-white/5 pb-3 md:pb-4">
            {editingId ? "Edit Education Entry" : "Add New Education"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">School / College</label>
                <input
                  type="text"
                  name="schoolCollege"
                  value={formData.schoolCollege}
                  onChange={handleInputChange}
                  placeholder="e.g. Stanford University"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Board / University</label>
                <input
                  type="text"
                  name="boardUniversity"
                  value={formData.boardUniversity}
                  onChange={handleInputChange}
                  placeholder="e.g. California State"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                >
                  <option value="schooling">Schooling</option>
                  <option value="intermediate">Intermediate / High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Degree / Course</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Field of Study</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="e.g. Information Technology"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-xs md:text-base"
                >
                  <option value="completed">Completed</option>
                  <option value="pursuing">Pursuing</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1 flex justify-between">
                  <span>Grade / CGPA</span>
                  <select
                    name="gradeType"
                    value={formData.gradeType}
                    onChange={handleInputChange}
                    className="bg-transparent text-[9px] md:text-[10px] text-blue-400 font-bold focus:outline-none"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="CGPA">CGPA</option>
                  </select>
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder="e.g. 9.0"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Program Details & Highlights</label>
              <RichTextEditor
                value={formData.description}
                onChange={(content: string) => setFormData({ ...formData, description: content })}
                placeholder="Describe your courses..."
                className="h-32 md:h-40"
              />
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-3 px-4 py-2 md:py-2.5 bg-black/40 rounded-lg md:rounded-xl border border-white/10 group cursor-pointer transition-all hover:border-white/20">
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
                  Featured Education (Priority View)
                </label>
              </div>

              <div className="flex gap-3 md:gap-4">
                <button
                  type="submit"
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-2.5 px-4 md:px-8 rounded-lg md:rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] text-sm md:text-base"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{editingId ? "Update" : "Save"}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 md:flex-none px-4 md:px-8 py-2 md:py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg md:rounded-xl border border-white/10 transition-all active:scale-[0.98] text-sm md:text-base"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* List Section - Full Width */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Education History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {education.map((edu) => (
              <div
                key={edu._id}
                className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg md:rounded-xl border border-white/20 hover:border-blue-500/30 transition-all relative group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-0.5 md:mb-1">
                          {edu.schoolCollege}
                        </h3>
                        <p className="text-blue-400 font-semibold text-sm md:text-base">
                          {edu.boardUniversity}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(edu)}
                          className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(edu._id)}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-3">
                      <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{edu.degree}</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{edu.fieldOfStudy}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${edu.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        {edu.status.charAt(0).toUpperCase() + edu.status.slice(1)}
                      </div>
                      {edu.grade && (
                        <div className="text-green-400 font-bold border-l border-white/10 pl-4 ml-auto">
                          {edu.grade} {edu.gradeType === 'Percentage' ? '%' : 'CGPA'}
                        </div>
                      )}
                    </div>

                    {edu.description && (
                      <div className="mt-4 border-t border-white/5 pt-3">
                        <RichText text={edu.description} className="text-sm italic !text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {education.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-black/20 rounded-2xl border border-white/5 border-dashed">
              No education history found. Add your first entry to showcase your academic journey.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationEdit;
