import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Send, Loader } from 'lucide-react';

const ChatInterface = forwardRef(({ style, language, temperature }, ref) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! 👋 I\'m the IIM Indore Assistant. I can help you with questions about admissions, programs, placements, campus facilities, and more. Try asking me something!',
      sender: 'bot',
      timestamp: new Date(),
      source: 'info',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Expose sendMessage method to parent component
  useImperativeHandle(ref, () => ({
    sendMessage: (query) => {
      // Directly send the message without setting input first
      sendMessageDirectly(query);
    },
  }));

  // Helper function to send message directly
  const sendMessageDirectly = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const conversationHistory = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${backendUrl}/api/chat`, {
        message: messageText,
        language,
        style,
        temperature,
        conversationHistory,
      });

      const assistantMessage = {
        id: messages.length + 2,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
        source: response.data.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.id !== userMessage.id)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      const response = await axios.post('/api/chat', {
        message: input,
        language,
        style,
        conversationHistory,
      }, {
        timeout: 30000, // 30 second timeout
      });

      if (!response.data || !response.data.response) {
        throw new Error('Invalid response from server');
      }

      const botMessage = {
        id: messages.length + 2,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
        source: response.data.source,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      let errorText = 'Sorry, I encountered an error. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorText = 'Request timed out. Please try again.';
      } else if (error.response?.status === 400) {
        errorText = 'Invalid request. Please check your input.';
      } else if (error.response?.status === 500) {
        errorText = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorText = 'Network error. Please check your connection.';
      }
      
      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-sm lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                message.sender === 'user'
                  ? 'bg-gray-800 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>

              {/* Message Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-gray-800 text-white rounded-tr-none'
                    : 'bg-gray-50 text-gray-900 rounded-tl-none'
                }`}
              >
                <p className={message.sender === 'user' ? 'text-white' : 'text-gray-900'}>{message.text}</p>
                <span className={`text-xs mt-1.5 block ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                  Just now
                </span>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                🤖
              </div>
              <div className="bg-gray-50 text-gray-900 px-4 py-3 rounded-2xl rounded-tl-none">
                <Loader className="w-4 h-4 animate-spin text-blue-600" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white p-5">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium flex items-center justify-center shadow-md text-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick Actions Below Input - Single Line */}
      <div className="bg-white px-5 pt-2 pb-1">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Quick Actions</p>
      </div>
      <div className="bg-white px-5 pb-3 flex gap-2">
        <button
          onClick={() => {
            sendMessageDirectly('Tell me about the programs offered at IIM Indore');
          }}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition text-xs font-medium border border-gray-200 hover:border-blue-300"
        >
          📚 Programs
        </button>
        <button
          onClick={() => {
            sendMessageDirectly('What are the placement statistics?');
          }}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition text-xs font-medium border border-gray-200 hover:border-blue-300"
        >
          📊 Placements
        </button>
        <button
          onClick={() => {
            sendMessageDirectly('What are the admission requirements?');
          }}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition text-xs font-medium border border-gray-200 hover:border-blue-300"
        >
          ✅ Admissions
        </button>
        <button
          onClick={() => {
            sendMessageDirectly('How can I get more information about IIM Indore?');
          }}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition text-xs font-medium border border-gray-200 hover:border-blue-300"
        >
          💬 Support
        </button>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
