import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import { FiUploadCloud, FiTrash2, FiArrowLeft, FiActivity } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // present if editing
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electrical',
    priority: 'Medium',
    description: ''
  });

  const [images, setImages] = useState([]); // Selected image files
  const [imagePreviews, setImagePreviews] = useState([]); // Preview URIs
  const [existingImages, setExistingImages] = useState([]); // Pre-existing paths if editing
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Live client-side heuristic diagnosis
  const [aiPreview, setAiPreview] = useState('');

  // Categories & Priorities
  const categoriesList = ['Electrical', 'Water', 'Internet', 'Cleaning', 'Furniture', 'Mess', 'Room', 'Security', 'Others'];
  const priorityList = ['Low', 'Medium', 'High'];

  // Load complaint if editing
  useEffect(() => {
    const fetchExistingComplaint = async () => {
      if (!isEdit) return;
      try {
        setFetching(true);
        const res = await api.get(`/complaints/${id}`);
        if (res.data.success) {
          const c = res.data.complaint;
          setFormData({
            title: c.title,
            category: c.category,
            priority: c.priority,
            description: c.description
          });
          setExistingImages(c.images || []);
        }
      } catch (error) {
        toast.error('Failed to load complaint details');
        navigate('/dashboard');
      } finally {
        setFetching(false);
      }
    };

    fetchExistingComplaint();
  }, [id, isEdit]);

  // Client-side AI diagnostic preview
  useEffect(() => {
    const text = `${formData.title} ${formData.description}`.toLowerCase();
    if (!formData.title && !formData.description) {
      setAiPreview('Awaiting details to generate triage diagnostic...');
      return;
    }

    let symptoms = [];
    let urgency = 'Standard';
    let action = 'Assigned staff needs to inspect the issue.';

    if (text.includes('leak') || text.includes('water') || text.includes('overflow') || text.includes('clog')) {
      symptoms.push('Water/Plumbing fault');
      action = 'Requires plumber valve inspection.';
      if (text.includes('flooding')) urgency = 'Urgent Plumbing Response';
    }
    if (text.includes('wire') || text.includes('shock') || text.includes('spark') || text.includes('short') || text.includes('smoke')) {
      symptoms.push('Electrical hazard');
      urgency = 'Immediate Electrician Dispatch';
      action = 'URGENT: Disconnect circuit main breaker.';
    } else if (text.includes('fan') || text.includes('light') || text.includes('switch') || text.includes('power')) {
      symptoms.push('Electrical appliance issue');
      action = 'Electrician fixture check.';
    }
    if (text.includes('wifi') || text.includes('internet') || text.includes('connection')) {
      symptoms.push('Network connectivity fault');
      action = 'IT Admin port trigger.';
    }
    if (text.includes('dust') || text.includes('clean') || text.includes('garbage')) {
      symptoms.push('Housekeeping low standard');
      action = 'Sweeper sweep roster assignment.';
    }
    if (text.includes('bed') || text.includes('chair') || text.includes('table') || text.includes('door') || text.includes('lock')) {
      symptoms.push('Furniture repair');
      action = 'Carpenter carpentry dispatch.';
    }

    if (symptoms.length === 0) {
      symptoms.push('General maintenance');
    }

    setAiPreview(`[Diagnostic] Main Category: ${symptoms.join(', ')} | Urgency Action: ${urgency} (${action})`);
  }, [formData.title, formData.description]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length + existingImages.length > 5) {
      return toast.error('You can upload a maximum of 5 images');
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (url) => {
    setExistingImages(prev => prev.filter(item => item !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      return toast.error('Please enter a title and description');
    }

    setLoading(true);
    const toastId = toast.loading(isEdit ? 'Updating complaint details...' : 'Lodging new complaint...');

    try {
      // Build FormData for file uploads
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('priority', formData.priority);
      data.append('description', formData.description);

      // Append selected file uploads
      images.forEach(img => {
        data.append('images', img);
      });

      // If editing, append existing images array
      if (isEdit) {
        data.append('existingImages', JSON.stringify(existingImages));
      }

      let res;
      if (isEdit) {
        res = await api.put(`/complaints/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/complaints', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        toast.success(isEdit ? 'Complaint updated successfully!' : 'Complaint filed successfully!', { id: toastId });
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="shimmer-bg h-96 rounded-2xl w-full" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Navigation Header */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {isEdit ? 'Modify Complaint' : 'New Complaint Form'}
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Provide ticket details, snap captures, and submit diagnostic details.</p>
          </div>
        </div>

        <GlassCard hoverEffect={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Complaint Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Toilet flush valve leaking water"
                  className="glass-input block w-full px-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Category Group
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="glass-input block w-full px-3 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none appearance-none"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Complaint Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="glass-input block w-full px-3 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none appearance-none"
                  >
                    {priorityList.map(pr => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Full Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Give a thorough details of the issue. E.g. room number, exact block details, since when is the light bulb flickering..."
                className="glass-input block w-full px-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none resize-y"
                required
              />
            </div>

            {/* AI Real-time Triage Bubble */}
            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3">
              <FiActivity className="text-primary-500 w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Triage Assistant</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1 italic">
                  {aiPreview}
                </p>
              </div>
            </div>

            {/* Photo upload inputs */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Attach Snaps / Screenshots (Max 5)
              </label>
              <div className="flex flex-col gap-4">
                
                {/* Drag Drop Area */}
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 rounded-2xl cursor-pointer transition-colors">
                  <FiUploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Click to upload image files</span>
                  <span className="text-[10px] text-slate-400 mt-1">JPEG, JPG, PNG, or WEBP up to 5MB</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Previews Grid */}
                {(imagePreviews.length > 0 || existingImages.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
                    
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative h-20 rounded-xl overflow-hidden border border-slate-200/20 group">
                        <img src={url} alt="Existing Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/50 text-[8px] text-white px-1.5 py-0.5 rounded">Uploaded</span>
                      </div>
                    ))}

                    {/* New Upload Previews */}
                    {imagePreviews.map((url, index) => (
                      <div key={`new-${index}`} className="relative h-20 rounded-xl overflow-hidden border border-slate-200/20 group">
                        <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            </div>

            {/* Actions Submit */}
            <div className="pt-4 flex justify-end gap-3.5 border-t border-slate-200/10">
              <Link to="/dashboard" className="btn-glass px-6 py-3">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-neon-primary px-8 py-3"
              >
                {loading ? 'Submitting...' : isEdit ? 'Update Ticket' : 'Lodge Complaint'}
              </button>
            </div>

          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintForm;
