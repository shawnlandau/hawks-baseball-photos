import React, { useState } from 'react';
import { FaCamera, FaVideo } from 'react-icons/fa';
import PhotoUpload from './PhotoUpload';
import VideoUpload from './VideoUpload';

const UploadPage = () => {
  const [activeTab, setActiveTab] = useState('photos');

  const tabs = [
    {
      id: 'photos',
      label: 'Upload Photos',
      icon: FaCamera,
      description: 'Share your favorite moments from Cooperstown',
      color: 'bg-hawks-red'
    },
    {
      id: 'videos',
      label: 'Upload Videos',
      icon: FaVideo,
      description: 'Share video highlights and celebrations',
      color: 'bg-hawks-navy'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hawks-navy via-hawks-navy-dark to-hawks-red">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-white/20 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-hawks-navy mb-2">
                Share Your Memories
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload photos and videos from our Cooperstown Dreams Park journey. 
                Tag players, add captions, and organize by albums.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 mx-2 mb-4 min-h-[64px] ${
                    activeTab === tab.id
                      ? `${tab.color} text-white shadow-lg transform scale-105`
                      : 'bg-white/25 text-hawks-navy hover:bg-white/35 hover:shadow-md border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'photos' && (
              <div className="animate-fade-in">
                <PhotoUpload onUploadSuccess={() => {}} />
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="animate-fade-in">
                <VideoUpload onUploadSuccess={() => {}} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage; 