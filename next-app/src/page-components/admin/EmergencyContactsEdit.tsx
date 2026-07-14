"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";

const EmergencyContactsEdit = () => {
  const navigate = useRouter();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relation: "",
    order: 0,
  });
  const [pinData, setPinData] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    api
      .get("/emergency-contacts")
      .then((res) => {
        setContacts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch emergency contacts", err);
        setLoading(false);
      });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.name === "order" ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/emergency-contacts/${editingId}`, formData);
      } else {
        await api.post("/emergency-contacts", formData);
      }
      setEditingId(null);
      setFormData({
        name: "",
        phone: "",
        relation: "",
        order: 0,
      });
      fetchContacts();
    } catch (error) {
      console.error("Failed to save contact", error);
      alert("Failed to save contact. Please check console for details.");
    }
  };

  const handleEdit = (contact: any) => {
    setEditingId(contact._id);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relation: contact.relation,
      order: contact.order || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await api.delete(`/emergency-contacts/${id}`);
        fetchContacts();
      } catch (error) {
        console.error("Failed to delete contact", error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: "",
      phone: "",
      relation: "",
      order: 0,
    });
  };

  const handlePinUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinData.length !== 4) {
      alert("PIN must be exactly 4 digits");
      return;
    }
    
    setPinLoading(true);
    try {
      await api.put("/emergency-contacts/pin", { pin: pinData });
      alert("Emergency PIN updated successfully!");
      setPinData("");
    } catch (error) {
      console.error("Failed to update PIN", error);
      alert("Failed to update PIN. Please check console for details.");
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-3 py-6 md:px-4 md:py-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-white">Manage Emergency Contacts</h1>
          <button
            onClick={() => navigate.push("/portal")}
            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Security Settings for PIN */}
        <div className="mb-6 md:mb-8 bg-red-500/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-red-500/20 shadow-xl w-full">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security Settings
          </h2>
          <form onSubmit={handlePinUpdate} className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[9px] md:text-[10px] font-bold text-red-300 uppercase px-1">Set New 4-Digit PIN</label>
              <input
                type="text"
                value={pinData}
                onChange={(e) => setPinData(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                placeholder="e.g. 1234"
                className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-red-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/80 transition-all font-mono text-sm md:text-base tracking-[0.5em]"
                required
                minLength={4}
                maxLength={4}
              />
            </div>
            <button
              type="submit"
              disabled={pinLoading || pinData.length !== 4}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 md:py-2.5 px-6 rounded-lg md:rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap"
            >
              {pinLoading ? "Updating..." : "Update PIN"}
            </button>
          </form>
          <p className="text-xs text-red-300/70 mt-3">This PIN is required to unlock the emergency contacts screen. Do not share it.</p>
        </div>

        <div className="mb-6 md:mb-8 bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl border border-white/20 shadow-xl w-full">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white border-b border-white/5 pb-3 md:pb-4">
            {editingId ? "Edit Contact" : "Add New Contact"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 90000 00000"
                  pattern="^\+?[0-9\s\-()]{7,15}$"
                  title="Enter a valid mobile number (e.g., +91 90000 00000). Allowed characters: numbers, spaces, +, -, and ()."
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Relation</label>
                <input
                  type="text"
                  name="relation"
                  value={formData.relation}
                  onChange={handleInputChange}
                  placeholder="e.g. Brother, Primary"
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase px-1">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-4 md:gap-6 pt-2">
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

        {/* List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Current Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg md:rounded-xl border border-white/20 hover:border-blue-500/30 transition-all relative group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-blue-400 font-mono text-sm mb-2">
                      {contact.phone}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                      <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{contact.relation}</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">Order: {contact.order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && contacts.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-black/20 rounded-2xl border border-white/5 border-dashed">
              No emergency contacts added yet. Add your first contact above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsEdit;
