import { useState, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import StyleSelector from './components/StyleSelector';
import EvaluationForm from './components/EvaluationForm';
import EvaluationDashboard from './components/EvaluationDashboard';
import { MessageCircle, BarChart3, Settings, BookOpen, HelpCircle, Award } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [style, setStyle] = useState('professional');
  const [language, setLanguage] = useState('auto');
  const [temperature, setTemperature] = useState(0.7);
  const chatInterfaceRef = useRef(null);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main Container Card */}
      <div className="w-full max-w-6xl">
        {currentView === 'chat' && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">IIM Indore</h1>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentView('chat')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                      currentView === 'chat'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Sidebar */}
              <div className="lg:col-span-1 border-r border-gray-100 bg-gray-50">
                <StyleSelector 
                  style={style} 
                  setStyle={setStyle}
                  language={language}
                  setLanguage={setLanguage}
                  temperature={temperature}
                  setTemperature={setTemperature}
                />
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-4">
                <ChatInterface 
                  ref={chatInterfaceRef} 
                  style={style} 
                  language={language}
                  temperature={temperature}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
