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
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 shadow-2xl">
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-hawks-navy mb-4">
                Share Your Memories
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Upload photos and videos from our Cooperstown Dreams Park journey. 
                Tag players, add captions, and organize by albums.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap justify-center mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-4 px-10 py-6 rounded-2xl font-bold transition-all duration-300 mx-3 mb-6 min-h-[80px] ${
                    activeTab === tab.id
                      ? `${tab.color} text-white shadow-2xl transform scale-105`
                      : 'bg-white/25 text-hawks-navy hover:bg-white/35 hover:shadow-xl border-2 border-gray-200'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                  <div className="text-left">
                    <div className="text-lg font-bold">{tab.label}</div>
                    <div className="text-sm opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="max-w-5xl mx-auto">
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