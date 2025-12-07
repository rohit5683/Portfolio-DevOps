import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import UploadProgress from '../../components/common/UploadProgress';
import { getImageUrl } from '../../utils/imageUtils';

const EducationEdit = () => {
  const navigate = useNavigate();
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    schoolCollege: '',
    boardUniversity: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    gradeType: 'Percentage',
    description: '',
    documents: '', // Comma-separated URLs
    level: 'undergraduate',
    status: 'completed',
    featured: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = () => {
    api.get('/education')
      .then(res => {
        setEducation(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch education', err);
        setLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const formDataUpload = new FormData();
    uploadedFiles.forEach(file => {
      formDataUpload.append('documents', file);
    });

    try {
      const response = await api.post('/upload/education', formDataUpload, {
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
      alert('Failed to upload files. Please check file size (max 50MB) and type (Images/PDF).');
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
    const urlsFromInput = formData.documents.split(',').map(doc => doc.trim()).filter(doc => doc);
    const allDocumentUrls = [...uploadedUrls, ...urlsFromInput];
    
    const eduData = {
      ...formData,
      documents: allDocumentUrls
    };
    
    try {
      if (editingId) {
        await api.put(`/education/${editingId}`, eduData);
        alert('Education updated successfully!');
      } else {
        await api.post('/education', eduData);
        alert('Education added successfully!');
      }
      setEditingId(null);
      setFormData({
        schoolCollege: '',
        boardUniversity: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        gradeType: 'Percentage',
        description: '',
        documents: '',
        level: 'undergraduate',
        status: 'completed',
        featured: false,
      });
      setUploadedFiles([]);
      fetchEducation();
    } catch (error) {
      console.error('Failed to save education', error);
      alert('Failed to save education. Please check console for details.');
    }
  };

  const handleEdit = (edu: any) => {
    setEditingId(edu._id);
    setFormData({
      schoolCollege: edu.schoolCollege || '',
      boardUniversity: edu.boardUniversity || edu.school || '', // Backward compatibility
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      grade: edu.grade || '',
      gradeType: edu.gradeType || 'Percentage',
      description: edu.description || '',
      documents: edu.documents?.join(', ') || '',
      level: edu.level || 'undergraduate',
      status: edu.status || 'completed',
      featured: edu.featured || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await api.delete(`/education/${id}`);
        fetchEducation();
      } catch (error) {
        console.error('Failed to delete education', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      schoolCollege: '',
      boardUniversity: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      gradeType: 'Percentage',
      description: '',
      documents: '',
      level: 'undergraduate',
      status: 'completed',
      featured: false,
    });
    setUploadedFiles([]);
  };

  if (loading) return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 text-white text-center mt-20">Loading...</div>
    </div>
  );

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

      <div className="relative z-10 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Education</h1>
        <button 
          onClick={() => navigate('/portal')}
          className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Edit Education' : 'Add New Education'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">School / College</label>
                <input
                  type="text"
                  name="schoolCollege"
                  value={formData.schoolCollege}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Board / University</label>
                <input
                  type="text"
                  name="boardUniversity"
                  value={formData.boardUniversity}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Field of Study</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Start Year</label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">End Year</label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="high-school" className="text-black">High School</option>
                    <option value="undergraduate" className="text-black">Undergraduate</option>
                    <option value="postgraduate" className="text-black">Postgraduate</option>
                    <option value="certification" className="text-black">Certification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="completed" className="text-black">Completed</option>
                    <option value="in-progress" className="text-black">In Progress</option>
                    <option value="dropped" className="text-black">Dropped</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 p-3 bg-black/20 border border-white/10 rounded-lg">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="featured" className="text-white cursor-pointer text-sm">Featured</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Grade Type</label>
                  <select
                    name="gradeType"
                    value={formData.gradeType}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Percentage" className="text-black">Percentage</option>
                    <option value="GPA" className="text-black">GPA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    {formData.gradeType === 'Percentage' ? 'Percentage (%)' : 'GPA'}
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder={formData.gradeType === 'Percentage' ? 'e.g. 85' : 'e.g. 3.8'}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Documents Upload Section */}
              <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="text-sm font-semibold text-white">📄 Certificates & Documents</h3>
                
                {/* File Upload */}
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">
                    Upload Documents (Degrees, Certificates, etc.)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                  />
                  {uploadedFiles.length > 0 && (
                    <p className="text-green-400 text-xs mt-2">
                      ✓ {uploadedFiles.length} file(s) selected
                    </p>
                  )}
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-gray-400 text-xs">OR</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-2">
                    Paste Document URLs (comma separated)
                  </label>
                  <textarea
                    name="documents"
                    value={formData.documents}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="https://example.com/degree.pdf, https://example.com/certificate.jpg"
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 md:py-2 text-sm md:text-base rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : (editingId ? 'Update' : 'Add')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {education.map((edu) => (
            <div 
              key={edu._id} 
              className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{edu.schoolCollege || edu.school}</h3>
                  <p className="text-sm text-gray-400 mb-1">{edu.boardUniversity}</p>
                  <p className="text-blue-400 font-medium">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-sm text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
                <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-1.5 md:p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(edu._id)}
                    className="p-1.5 md:p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {edu.grade && (
                <div className="mt-3 inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
                  Grade: {edu.grade}
                </div>
              )}
              {edu.documents && edu.documents.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">📄 {edu.documents.length} document(s) attached</p>
                  <div className="flex flex-wrap gap-2">
                    {edu.documents.map((doc: string, idx: number) => (
                      <a
                        key={idx}
                        href={getImageUrl(doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-purple-500/10 text-purple-300 text-xs rounded border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                      >
                        Document {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {edu.description && (
                <p className="text-gray-400 text-sm mt-3 leading-relaxed border-t border-white/5 pt-3">
                  {edu.description}
                </p>
              )}
            </div>
          ))}

          {education.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
              No education history found. Add your first entry!
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default EducationEdit;
