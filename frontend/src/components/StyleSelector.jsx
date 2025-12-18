import { Settings } from 'lucide-react';

const styles = [
  { id: 'professional', name: 'Professional', description: 'Formal & Solution-Oriented' },
  { id: 'casual', name: 'Casual', description: 'Friendly & Conversational' },
  { id: 'bollywood', name: '🎬 Bollywood', description: 'Dramatic & Filmy!' },
];

const languages = [
  { code: 'auto', name: 'Auto-Detect' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

export default function StyleSelector({ style, setStyle, language, setLanguage, temperature, setTemperature }) {

  return (
    <div className="space-y-3 p-6 bg-gray-50 h-[600px] flex flex-col">
      {/* Language Selection */}
      <div>
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Temperature Control with Buttons */}
      <div>
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">Temperature</label>
        <div className="flex gap-1">
          <button
            onClick={() => setTemperature(0.3)}
            className={`flex-1 px-1.5 py-1.5 rounded text-xs font-medium transition ${
              temperature === 0.3
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            Factual
          </button>
          <button
            onClick={() => setTemperature(0.7)}
            className={`flex-1 px-1.5 py-1.5 rounded text-xs font-medium transition ${
              temperature === 0.7
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            Balanced
          </button>
          <button
            onClick={() => setTemperature(1.0)}
            className={`flex-1 px-1.5 py-1.5 rounded text-xs font-medium transition ${
              temperature === 1.0
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            Creative
          </button>
        </div>
      </div>

      {/* Chat Style */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">Chat Style</label>
        <div className="space-y-2">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`w-full px-3 py-2.5 rounded-lg text-left transition text-sm ${
                style === s.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="font-semibold text-sm">{s.name}</div>
              <div className={`text-xs mt-0.5 ${style === s.id ? 'text-blue-100' : 'text-gray-600'}`}>
                {s.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
