import React, { useState, useEffect } from 'react';
import { FaHeart, FaSmile, FaThumbsUp, FaUser, FaComment, FaPaperPlane } from 'react-icons/fa';
import { useFirebase } from '../hooks/useFirebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, doc, getDoc, updateDoc } from 'firebase/firestore';

const ParentMessages = () => {
  const { db, auth } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    message: ''
  });

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError('Database not available');
      return;
    }

    try {
      const q = query(collection(db, 'parentMessages'), orderBy('timestamp', 'desc'), limit(50));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const messageList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(messageList);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Error fetching messages:', error);
          setError('Failed to load messages. Please try again.');
          setLoading(false);
        }
      );

      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('Loading timeout. Please refresh the page.');
        }
      }, 10000); // 10 second timeout

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } catch (error) {
      console.error('Error setting up messages listener:', error);
      setError('Failed to connect to messages. Please try again.');
      setLoading(false);
    }
  }, [db, loading]);

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
    if (!date) return 'Unknown date';
    
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hawks-red mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Unable to Load Messages</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-hawks-red text-white px-4 py-2 rounded-lg hover:bg-hawks-red-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-hawks-navy mb-4">
            Messages from Parents
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Share your thoughts, memories, and messages with the team and families
          </p>
        </div>
      </div>

      {/* Message Form */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <h3 className="text-2xl font-semibold text-hawks-navy mb-6">
          Share Your Message
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="parentName" className="block text-base font-semibold text-gray-700 mb-3">
              Your Name
            </label>
            <input
              type="text"
              id="parentName"
              value={formData.parentName}
              onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
              placeholder="Enter your name"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-hawks-red focus:border-transparent min-h-[56px] text-base transition-all duration-200 hover:border-gray-400"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-3">
              Your Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share a memory, thought, or message for the team..."
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-hawks-red focus:border-transparent resize-none min-h-[120px] text-base transition-all duration-200 hover:border-gray-400"
              rows="4"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-hawks-red to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 min-h-[56px] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaPaperPlane className="w-5 h-5" />
                <span>Share Message</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Messages Wall */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-hawks-navy mb-6">
          Recent Messages ({messages.length})
        </h3>
        
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-auto border border-gray-100">
              <FaComment className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-gray-700 mb-4">No Messages Yet</h4>
              <p className="text-gray-500 text-lg leading-relaxed">
                Be the first to share a message with the team!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="w-5 h-5 text-hawks-red" />
                    <span className="font-semibold text-gray-800 text-lg">
                      {message.parentName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {message.message}
                </p>
                
                {/* Reactions */}
                <div className="flex items-center space-x-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => addReaction(message.id, '❤️')}
                      className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center shadow-md hover:shadow-lg"
                      aria-label="Add heart reaction"
                    >
                      <FaHeart className="w-5 h-5 text-red-500" />
                    </button>
                    <button
                      onClick={() => addReaction(message.id, '😊')}
                      className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center shadow-md hover:shadow-lg"
                      aria-label="Add smile reaction"
                    >
                      <FaSmile className="w-5 h-5 text-yellow-500" />
                    </button>
                    <button
                      onClick={() => addReaction(message.id, '👍')}
                      className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center shadow-md hover:shadow-lg"
                      aria-label="Add thumbs up reaction"
                    >
                      <FaThumbsUp className="w-5 h-5 text-blue-500" />
                    </button>
                  </div>

                  {/* Display Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex space-x-2">
                      {message.reactions.map((reaction, index) => (
                        <span key={index} className="text-2xl">
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