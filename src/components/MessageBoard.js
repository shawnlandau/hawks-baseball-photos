import React, { useState } from 'react';
import { FaHeart, FaStar, FaTrophy, FaUser, FaCalendar, FaEdit } from 'react-icons/fa';

const MessageBoard = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'Mom of #11',
      message: 'Watching you boys play with such heart and determination has been incredible. You make us all proud! 🏆',
      timestamp: new Date('2025-07-31T14:30:00'),
      type: 'encouragement'
    },
    {
      id: 2,
      author: 'Dad of #7',
      message: 'The way you support each other on and off the field shows what true teamwork looks like. Keep it up! 💪',
      timestamp: new Date('2025-08-01T09:15:00'),
      type: 'teamwork'
    },
    {
      id: 3,
      author: 'Coach Mike',
      message: 'This team has shown incredible growth and character. You\'ve made memories that will last a lifetime. Proud to be your coach! ⚾',
      timestamp: new Date('2025-08-02T16:45:00'),
      type: 'coach'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [authorName, setAuthorName] = useState('');

  const addMessage = () => {
    if (newMessage.trim() && authorName.trim()) {
      const message = {
        id: Date.now(),
        author: authorName,
        message: newMessage,
        timestamp: new Date(),
        type: 'parent'
      };
      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      setAuthorName('');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'encouragement':
        return <FaHeart className="w-4 h-4 text-red-500" />;
      case 'teamwork':
        return <FaStar className="w-4 h-4 text-yellow-500" />;
      case 'coach':
        return <FaTrophy className="w-4 h-4 text-hawks-red" />;
      default:
        return <FaUser className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Messages to the Team
          </h2>
          <p className="text-white/80 text-sm sm:text-base">
            Share your encouragement, memories, and messages of support for our amazing team
          </p>
        </div>
      </div>

      {/* Add Message Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-hawks-navy mb-4 flex items-center">
          <FaEdit className="w-4 h-4 mr-2" />
          Leave a Message
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (optional)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g., Mom of #11, Dad of #7"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your encouragement, memories, or words of support..."
              rows="4"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent resize-none"
            />
          </div>
          
          <button
            onClick={addMessage}
            disabled={!newMessage.trim()}
            className="w-full bg-hawks-red text-white py-3 px-4 rounded-lg font-medium hover:bg-hawks-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[48px]"
          >
            <FaHeart className="w-4 h-4" />
            <span>Share Message</span>
          </button>
        </div>
      </div>

      {/* Messages Display */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-hawks-red/10 rounded-full flex items-center justify-center">
                  {getMessageIcon(message.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-hawks-navy">
                    {message.author}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <FaCalendar className="w-3 h-3" />
                    <span>{formatDate(message.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Messages Yet</h3>
            <p className="text-white/70 text-sm mb-4">
              Be the first to leave a message of encouragement for the team!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBoard; 