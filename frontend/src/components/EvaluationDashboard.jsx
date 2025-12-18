import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function EvaluationDashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await axios.get('/api/evaluations');
      setEvaluations(response.data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
        <p className="text-slate-300">No evaluations yet. Be the first to provide feedback!</p>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    totalEvaluations: evaluations.length,
    avgResponseQuality: (evaluations.reduce((sum, e) => sum + parseInt(e.responseQuality), 0) / evaluations.length).toFixed(1),
    avgLanguageAccuracy: (evaluations.reduce((sum, e) => sum + parseInt(e.languageAccuracy), 0) / evaluations.length).toFixed(1),
    avgUserExperience: (evaluations.reduce((sum, e) => sum + parseInt(e.userExperience), 0) / evaluations.length).toFixed(1),
    avgMultilingualSupport: (evaluations.reduce((sum, e) => sum + parseInt(e.multilingualSupport), 0) / evaluations.length).toFixed(1),
  };

  // Language distribution
  const languageData = Object.entries(
    evaluations.reduce((acc, e) => {
      acc[e.language] = (acc[e.language] || 0) + 1;
      return acc;
    }, {})
  ).map(([language, count]) => ({
    name: language.toUpperCase(),
    value: count,
  }));

  // Style distribution
  const styleData = Object.entries(
    evaluations.reduce((acc, e) => {
      acc[e.style] = (acc[e.style] || 0) + 1;
      return acc;
    }, {})
  ).map(([style, count]) => ({
    name: style.charAt(0).toUpperCase() + style.slice(1),
    value: count,
  }));

  // Average ratings by language
  const ratingsByLanguage = Object.entries(
    evaluations.reduce((acc, e) => {
      if (!acc[e.language]) {
        acc[e.language] = { count: 0, quality: 0, accuracy: 0, ux: 0, multilingual: 0 };
      }
      acc[e.language].count += 1;
      acc[e.language].quality += parseInt(e.responseQuality);
      acc[e.language].accuracy += parseInt(e.languageAccuracy);
      acc[e.language].ux += parseInt(e.userExperience);
      acc[e.language].multilingual += parseInt(e.multilingualSupport);
      return acc;
    }, {})
  ).map(([language, data]) => ({
    language: language.toUpperCase(),
    'Response Quality': (data.quality / data.count).toFixed(1),
    'Language Accuracy': (data.accuracy / data.count).toFixed(1),
    'User Experience': (data.ux / data.count).toFixed(1),
  }));

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Evaluations', value: stats.totalEvaluations },
          { label: 'Avg Response Quality', value: stats.avgResponseQuality },
          { label: 'Avg Language Accuracy', value: stats.avgLanguageAccuracy },
          { label: 'Avg User Experience', value: stats.avgUserExperience },
          { label: 'Avg Multilingual Support', value: stats.avgMultilingualSupport },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Style Distribution */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Style Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={styleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ratings by Language */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Average Ratings by Language</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ratingsByLanguage}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="language" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 10]} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            <Legend />
            <Line type="monotone" dataKey="Response Quality" stroke="#3b82f6" />
            <Line type="monotone" dataKey="Language Accuracy" stroke="#10b981" />
            <Line type="monotone" dataKey="User Experience" stroke="#f59e0b" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Feedback */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Feedback</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {evaluations.slice(-10).reverse().map((evaluation, idx) => (
            <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-white">{evaluation.name}</p>
                  <p className="text-sm text-slate-400">{evaluation.language.toUpperCase()} • {evaluation.style}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(evaluation.timestamp).toLocaleDateString()}
                </span>
              </div>
              {evaluation.comments && (
                <p className="text-sm text-slate-300 mt-2">{evaluation.comments}</p>
              )}
              <div className="flex gap-4 mt-3 text-xs text-slate-400">
                <span>Quality: {evaluation.responseQuality}/10</span>
                <span>Accuracy: {evaluation.languageAccuracy}/10</span>
                <span>UX: {evaluation.userExperience}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
