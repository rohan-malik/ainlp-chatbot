import { useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

export default function EvaluationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'en',
    style: 'professional',
    responseQuality: 5,
    languageAccuracy: 5,
    userExperience: 5,
    multilingualSupport: 5,
    comments: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/evaluate', formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          language: 'en',
          style: 'professional',
          responseQuality: 5,
          languageAccuracy: 5,
          userExperience: 5,
          multilingualSupport: 5,
          comments: '',
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-300 mb-2">Thank You!</h2>
          <p className="text-green-200">Your feedback has been recorded successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Share Your Feedback</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Language and Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Language Tested
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Style Tested
              </label>
              <select
                name="style"
                value={formData.style}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-4">
            {[
              { key: 'responseQuality', label: 'Response Quality (1-10)' },
              { key: 'languageAccuracy', label: 'Language Accuracy (1-10)' },
              { key: 'userExperience', label: 'User Experience (1-10)' },
              { key: 'multilingualSupport', label: 'Multilingual Support (1-10)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {label}
                </label>
                <input
                  type="range"
                  name={key}
                  min="1"
                  max="10"
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="text-right text-sm text-slate-400 mt-1">
                  {formData[key]}/10
                </div>
              </div>
            ))}
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Additional Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              placeholder="Share your thoughts, suggestions, or issues..."
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
