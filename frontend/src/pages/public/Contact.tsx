import { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaLinkedin, 
  FaGithub, 
  FaPhone, 
  FaTwitter,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import Skeleton from '../../components/common/Skeleton';

const Contact = () => {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Fetch profile data
    api.get('/profile')
      .then(res => {
        setProfile(res.data);
        setPageLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch profile', err);
        setPageLoading(false);
      });

    // Update time
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setErrorMessage('');
      
      try {
        await api.post('/contact', formData);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
          setErrors({});
        }, 5000);
      } catch (error: any) {
        console.error('Failed to send message:', error);
        setErrorMessage(
          error.response?.data?.message || 
          'Failed to send message. Please try again or contact me directly via email.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const contactMethods = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: profile?.contact?.email || 'rohit.vishwakarma@example.com',
      href: `mailto:${profile?.contact?.email || 'rohit.vishwakarma@example.com'}`,
      color: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30',
      hoverColor: 'hover:border-red-500/50',
      copyable: true
    },
    {
      icon: FaLinkedin,
      label: 'LinkedIn',
      value: profile?.contact?.linkedin ? new URL(profile.contact.linkedin).pathname : '/in/rohit-vishwakarma',
      href: profile?.contact?.linkedin || 'https://linkedin.com/in/rohit-vishwakarma',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      hoverColor: 'hover:border-blue-500/50',
      copyable: false
    },
    {
      icon: FaGithub,
      label: 'GitHub',
      value: profile?.contact?.github ? new URL(profile.contact.github).pathname.replace('/', '@') : '@rohit-vishwakarma',
      href: profile?.contact?.github || 'https://github.com/rohit-vishwakarma',
      color: 'from-gray-500/20 to-gray-600/20',
      borderColor: 'border-gray-500/30',
      hoverColor: 'hover:border-gray-500/50',
      copyable: false
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: profile?.contact?.phone || '+91 XXX XXX XXXX',
      href: `tel:${profile?.contact?.phone?.replace(/\s/g, '') || '+91XXXXXXXXXX'}`,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      hoverColor: 'hover:border-green-500/50',
      copyable: true
    },
    {
      icon: FaTwitter,
      label: 'Twitter',
      value: profile?.contact?.twitter ? new URL(profile.contact.twitter).pathname.replace('/', '@') : '@rohitvishwa',
      href: profile?.contact?.twitter || 'https://twitter.com/rohitvishwa',
      color: 'from-sky-500/20 to-blue-400/20',
      borderColor: 'border-sky-500/30',
      hoverColor: 'hover:border-sky-500/50',
      copyable: false
    }
  ];

  const getIndiaTime = () => {
    return currentTime.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <SEO 
        title="Contact"
        description="Get in touch with me for freelance projects, job opportunities, or collaboration."
        keywords={['Contact', 'Hire DevOps Engineer', 'Freelance']}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Let's connect and discuss how we can work together
          </p>
          
          {/* Timezone Display */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-400 text-sm font-semibold">
              🇮🇳 India Time: {getIndiaTime()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Contact Methods */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Connect With Me</h2>
            
            {pageLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Skeleton width={48} height={48} variant="circular" />
                    <div className="flex-1">
                      <Skeleton width={80} height={16} className="mb-2" />
                      <Skeleton width={150} height={12} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              contactMethods.map((method) => (
                <div
                  key={method.label}
                  className={`bg-gradient-to-br ${method.color} backdrop-blur-xl p-4 rounded-xl border ${method.borderColor} ${method.hoverColor} shadow-lg transition-all group`}
                >
                  <div className="flex items-center justify-between">
                    <a
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white">{method.label}</h3>
                        <p className="text-gray-300 text-xs break-all">{method.value}</p>
                      </div>
                    </a>
                    
                    {method.copyable && (
                      <button
                        onClick={() => copyToClipboard(method.value, method.label)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedField === method.label ? (
                          <FaCheck className="w-4 h-4 text-green-400" />
                        ) : (
                          <FaCopy className="w-4 h-4 text-gray-400 hover:text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Quick Info */}
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span> Quick Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">●</span>
                  <span className="text-gray-300">Usually responds within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">●</span>
                  <span className="text-gray-300">Available for freelance projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">●</span>
                  <span className="text-gray-300">Open to remote opportunities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Send Me a Message</h2>
              
              {submitted && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 animate-fadeIn">
                  <FaCheck className="w-5 h-5" />
                  <span>Thank you! Your message has been sent successfully. I'll get back to you soon!</span>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 animate-fadeIn">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full p-3 rounded-lg bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Your Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full p-3 rounded-lg bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full p-3 rounded-lg bg-white/5 border ${errors.subject ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                    placeholder="Project Inquiry / Collaboration / Just saying hi"
                  />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full p-3 rounded-lg bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors h-40 resize-none`}
                    placeholder="Tell me about your project, ask a question, or just say hi..."
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.message.length} characters (minimum 10)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">💼 Are you available for freelance work?</h3>
              <p className="text-gray-300 text-sm">Yes! I'm open to freelance DevOps and cloud infrastructure projects. Feel free to reach out with your requirements.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">⏱️ What's your typical response time?</h3>
              <p className="text-gray-300 text-sm">I usually respond within 24 hours during weekdays. For urgent matters, please mention it in your message subject.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">🌍 Do you work remotely?</h3>
              <p className="text-gray-300 text-sm">Absolutely! I'm experienced in remote collaboration and have worked with teams across different time zones.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">🤝 What kind of projects do you take?</h3>
              <p className="text-gray-300 text-sm">I specialize in cloud infrastructure, CI/CD pipelines, containerization, and DevOps automation projects.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;
