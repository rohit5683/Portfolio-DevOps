import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";
import { getImageUrl } from "../../utils/imageUtils";

const CertificationsEdit = () => {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState<any[]>([]);
  const [newCert, setNewCert] = useState({
    name: "",
    issuer: "",
    date: "",
    credentialUrl: "",
    description: "",
    type: "Certification",
    fileUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = () => {
    api
      .get("/certifications")
      .then((res) => setCertifications(res.data))
      .catch(console.error);
  };

  const handleEdit = (cert: any) => {
    setNewCert({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date.split("T")[0],
      credentialUrl: cert.credentialUrl || "",
      description: cert.description || "",
      type: cert.type || "Certification",
      fileUrl: cert.fileUrl || "",
    });
    setEditingId(cert._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setNewCert({
      name: "",
      issuer: "",
      date: "",
      credentialUrl: "",
      description: "",
      type: "Certification",
      fileUrl: "",
    });
    setEditingId(null);
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/certifications/${id}`);
      fetchCertifications();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !editingId) {
      alert("Please select a file");
      return;
    }

    setUploading(true);

    try {
      let fileUrl = newCert.fileUrl; // Keep existing URL if editing and no new file

      // 1. Upload File if selected
      if (selectedFile) {
        console.log("Uploading file:", selectedFile.name);
        const formData = new FormData();
        formData.append("files", selectedFile);

        const uploadRes = await api.post("/upload/certifications", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Upload response:", uploadRes.data);
        
        if (!uploadRes.data.urls || uploadRes.data.urls.length === 0) {
          throw new Error("No file URL returned from upload");
        }

        fileUrl = uploadRes.data.urls[0];
        console.log("File uploaded successfully:", fileUrl);
      }

      // 2. Create or Update Certification
      const certData = {
        name: newCert.name,
        issuer: newCert.issuer,
        date: newCert.date,
        credentialUrl: newCert.credentialUrl,
        description: newCert.description,
        type: newCert.type,
        fileUrl,
      };

      console.log("Saving certification:", certData);

      if (editingId) {
        await api.put(`/certifications/${editingId}`, certData);
        alert("Certification updated successfully!");
      } else {
        await api.post("/certifications", certData);
        alert("Certification added successfully!");
      }

      // Reset form
      handleCancelEdit();
      fetchCertifications();
    } catch (error: any) {
      console.error("Failed to save certification:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save certification";
      alert(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Certifications</h1>
          <button
            onClick={() => navigate("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white">
            {editingId ? "Edit Certification" : "Add New Certification"}
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Certification Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={newCert.name}
                  onChange={(e) =>
                    setNewCert({ ...newCert, name: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Issuer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Web Services"
                  value={newCert.issuer}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issuer: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newCert.date}
                  onChange={(e) =>
                    setNewCert({ ...newCert, date: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Type
                </label>
                <select
                  value={newCert.type}
                  onChange={(e) =>
                    setNewCert({ ...newCert, type: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="Certification" className="bg-gray-800 text-white">Certification</option>
                  <option value="Internship" className="bg-gray-800 text-white">Internship</option>
                  <option value="Course" className="bg-gray-800 text-white">Course</option>
                  <option value="Award" className="bg-gray-800 text-white">Award</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Credential URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={newCert.credentialUrl}
                onChange={(e) =>
                  setNewCert({ ...newCert, credentialUrl: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Brief description..."
                value={newCert.description}
                onChange={(e) =>
                  setNewCert({ ...newCert, description: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors h-24"
              />
            </div>
            
            {/* File Input */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Upload Certificate (Image or PDF) {editingId && "(Leave empty to keep existing)"}
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                onChange={handleFileChange}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
                required={!editingId}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg text-white font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingId ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  editingId ? "Update Certification" : "Add Certification"
                )}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-600 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg text-white font-bold hover:bg-gray-700 transition-colors shadow-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="bg-blue-500/80 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(cert._id)}
                  className="bg-red-500/80 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="h-40 bg-black/20 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                {cert.fileUrl && cert.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={getImageUrl(cert.fileUrl)}
                    alt={cert.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-500">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{cert.name}</h3>
              <p className="text-blue-400 text-sm font-medium mb-2">{cert.issuer}</p>
              <p className="text-gray-400 text-xs mb-3">
                {new Date(cert.date).toLocaleDateString()}
              </p>
              <p className="text-gray-300 text-sm line-clamp-2">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificationsEdit;
