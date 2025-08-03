import React, { useState, useEffect } from 'react';
import { FaHeart, FaSmile, FaThumbsUp, FaUser, FaComment, FaPaperPlane } from 'react-icons/fa';
import { useFirebase } from '../hooks/useFirebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, doc, getDoc, updateDoc } from 'firebase/firestore';

const ParentMessages = () => {
  const { db, auth } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    message: ''
  });

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'parentMessages'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.parentName.trim() || !formData.message.trim()) {
      alert('Please enter both your name and a message.');
      return;
    }

    setSubmitting(true);
    try {
      const messageData = {
        parentName: formData.parentName.trim(),
        message: formData.message.trim(),
        timestamp: new Date(),
        userEmail: auth?.currentUser?.email || 'Anonymous',
        reactions: []
      };

      await addDoc(collection(db, 'parentMessages'), messageData);
      
      // Reset form
      setFormData({ parentName: '', message: '' });
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addReaction = async (messageId, reaction) => {
    try {
      const messageRef = doc(db, 'parentMessages', messageId);
      const messageDoc = await getDoc(messageRef);
      
      if (messageDoc.exists()) {
        const currentReactions = messageDoc.data().reactions || [];
        const updatedReactions = [...currentReactions, reaction];
        
        await updateDoc(messageRef, {
          reactions: updatedReactions
        });
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hawks-red mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Messages from Parents
          </h2>
          <p className="text-white/80 text-sm sm:text-base">
            Share your thoughts, memories, and messages with the team and families
          </p>
        </div>
      </div>

      {/* Message Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-hawks-navy mb-4">
          Share Your Message
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="parentName"
              value={formData.parentName}
              onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent min-h-[48px]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share a memory, thought, or message for the team..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawks-red focus:border-transparent resize-none min-h-[80px]"
              rows="3"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-hawks-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-hawks-red-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[48px]"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaPaperPlane className="w-4 h-4" />
                <span>Share Message</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Messages Wall */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Messages ({messages.length})
        </h3>
        
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white/10 rounded-xl p-6 max-w-md mx-auto">
              <FaComment className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">No Messages Yet</h4>
              <p className="text-white/70 text-sm">
                Be the first to share a message with the team!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4 text-hawks-red" />
                    <span className="font-semibold text-gray-800">
                      {message.parentName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-700 text-base mb-4 leading-relaxed">
                  {message.message}
                </p>
                
                {/* Reactions */}
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addReaction(message.id, '❤️')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Add heart reaction"
                    >
                      <FaHeart className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      onClick={() => addReaction(message.id, '😊')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Add smile reaction"
                    >
                      <FaSmile className="w-4 h-4 text-yellow-500" />
                    </button>
                    <button
                      onClick={() => addReaction(message.id, '👍')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Add thumbs up reaction"
                    >
                      <FaThumbsUp className="w-4 h-4 text-blue-500" />
                    </button>
                  </div>

                  {/* Display Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex space-x-1">
                      {message.reactions.map((reaction, index) => (
                        <span key={index} className="text-lg">
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentMessages; 