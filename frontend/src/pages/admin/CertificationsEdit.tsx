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
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-3 py-6 md:px-4 md:py-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-white">Manage Certifications</h1>
          <button
            onClick={() => navigate("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-6 md:mb-8 bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg md:rounded-xl border border-white/20 shadow-xl">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white border-b border-white/5 pb-2 md:pb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            {editingId ? "Edit Certification" : "Add New Certification"}
          </h2>
          <form onSubmit={handleCreate} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] md:text-xs font-bold uppercase px-1">
                  Certification Name
                </label>
                <input
                  type="text"
                  placeholder="AWS Solutions Architect"
                  value={newCert.name}
                  onChange={(e) =>
                    setNewCert({ ...newCert, name: e.target.value })
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white text-xs md:text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-600"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] md:text-xs font-bold uppercase px-1">
                  Issuer
                </label>
                <input
                  type="text"
                  placeholder="Amazon Web Services"
                  value={newCert.issuer}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issuer: e.target.value })
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white text-xs md:text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] md:text-xs font-bold uppercase px-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newCert.date}
                  onChange={(e) =>
                    setNewCert({ ...newCert, date: e.target.value })
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white text-xs md:text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] md:text-xs font-bold uppercase px-1">
                  Type
                </label>
                <select
                  value={newCert.type}
                  onChange={(e) =>
                    setNewCert({ ...newCert, type: e.target.value })
                  }
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white text-xs md:text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="Certification">Certification</option>
                  <option value="Internship">Internship</option>
                  <option value="Course">Course</option>
                  <option value="Award">Award</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-400 text-[10px] md:text-xs font-bold uppercase px-1">
                Credential URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={newCert.credentialUrl}
                onChange={(e) =>
                  setNewCert({ ...newCert, credentialUrl: e.target.value })
                }
                className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white text-xs md:text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-400 text-[10px] md:text-xs font-bold uppercase px-1">
                Description
              </label>
              <textarea
                placeholder="Brief description..."
                value={newCert.description}
                onChange={(e) =>
                  setNewCert({ ...newCert, description: e.target.value })
                }
                className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white text-xs md:text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-600 h-24"
              />
            </div>
            
            {/* File Input */}
            <div className="space-y-1.5">
              <label className="block text-gray-400 text-[10px] md:text-xs font-bold uppercase px-1">
                Upload Certificate {editingId && "(Optional)"}
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                onChange={handleFileChange}
                className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white text-xs md:text-sm file:mr-3 md:file:mr-4 file:py-1 file:px-3 md:file:py-1.5 md:file:px-4 file:rounded-md md:file:rounded-lg file:border-0 file:text-[10px] md:file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
                required={!editingId}
              />
            </div>

            <div className="flex gap-3 md:gap-4 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] text-xs md:text-sm disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingId ? "Update Certification" : "Add Certification"
                )}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 md:px-6 md:py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl border border-white/10 transition-all active:scale-95"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg md:rounded-xl border border-white/20 shadow-lg hover:bg-white/15 transition-all relative group"
            >
              <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 md:gap-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="bg-blue-500/80 text-white p-1.5 md:p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(cert._id)}
                  className="bg-red-500/80 text-white p-1.5 md:p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="h-32 md:h-40 bg-black/20 rounded-lg mb-4 overflow-hidden flex items-center justify-center border border-white/5">
                {cert.fileUrl && cert.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={getImageUrl(cert.fileUrl)}
                    alt={cert.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-gray-600">
                    <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="text-sm md:text-lg font-bold text-white mb-0.5 md:mb-1 truncate">{cert.name}</h3>
              <p className="text-blue-400 text-xs md:text-sm font-medium mb-1.5 md:mb-2">{cert.issuer}</p>
              <p className="text-gray-500 text-[10px] md:text-xs mb-2 md:mb-3 font-semibold">
                {new Date(cert.date).toLocaleDateString()}
              </p>
              <p className="text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificationsEdit;
