import React from 'react';
import { FaBaseballBall, FaTrophy, FaHeart, FaStar, FaUsers, FaCamera, FaShare, FaFlag, FaAward } from 'react-icons/fa';

const AboutPage = () => {
  const teamValues = [
    {
      icon: FaTrophy,
      title: 'Excellence',
      description: 'Striving for greatness in every game and practice'
    },
    {
      icon: FaHeart,
      title: 'Sportsmanship',
      description: 'Playing with respect, integrity, and honor'
    },
    {
      icon: FaUsers,
      title: 'Teamwork',
      description: 'Supporting each other on and off the field'
    },
    {
      icon: FaStar,
      title: 'Character',
      description: 'Building strong character through baseball'
    }
  ];

  const dreamsParkValues = [
    {
      icon: FaFlag,
      title: 'Tradition',
      description: 'Honoring the legacy of America\'s pastime'
    },
    {
      icon: FaHeart,
      title: 'Faith',
      description: 'Emphasizing values of faith and community'
    },
    {
      icon: FaStar,
      title: 'Country',
      description: 'Celebrating patriotism and national pride'
    },
    {
      icon: FaAward,
      title: 'Accomplishment',
      description: 'Building pride, dignity, and achievement'
    }
  ];

  const platformFeatures = [
    {
      icon: FaCamera,
      title: 'Photo Sharing',
      description: 'Upload and share memories from our Cooperstown journey'
    },
    {
      icon: FaShare,
      title: 'Team Collaboration',
      description: 'Work together to document our tournament experience'
    },
    {
      icon: FaUsers,
      title: 'Player Tagging',
      description: 'Tag teammates and celebrate individual moments'
    },
    {
      icon: FaStar,
      title: 'Memory Preservation',
      description: 'Create lasting memories for players and families'
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
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About the Hawks
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Learn about our team, the Cooperstown Dreams Park experience, 
              and how this platform helps us capture and share our memories.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-4 py-12">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-hawks-red rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBaseballBall className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-hawks-navy mb-4">
                  Hawks Baseball - 12U Team
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  The Hawks are a dedicated 12U baseball team competing in the prestigious 
                  Cooperstown Dreams Park tournament. Our journey represents more than just 
                  baseball - it's about building character, creating memories, and honoring 
                  the traditions of America's pastime.
                </p>
              </div>

              {/* Team Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {teamValues.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-hawks-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-2xl text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-hawks-navy mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Team Roster */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hawks-navy mb-4">Team Roster</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="text-center">
                      <div className="w-12 h-12 bg-hawks-navy rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">{i + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Player {i + 1}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Coaches: Coach 1, Coach 2
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dreams Park Section */}
        <section className="px-4 py-12">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-hawks-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFlag className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-hawks-navy mb-4">
                  Cooperstown Dreams Park
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Cooperstown Dreams Park is more than just a baseball tournament - it's a 
                  life-enriching experience that emphasizes tradition, values of faith and 
                  country, and an appreciation for baseball. Players leave with a sense of 
                  pride, dignity, and accomplishment.
                </p>
              </div>

              {/* Dreams Park Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dreamsParkValues.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-hawks-navy rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-2xl text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-hawks-navy mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Tournament Experience */}
              <div className="mt-8 bg-hawks-red/10 border border-hawks-red/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-hawks-red mb-4">Tournament Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What Makes It Special</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-start space-x-2">
                        <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Professional-grade baseball fields</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Opening ceremonies and team parades</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Skills competitions and awards</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Pin trading tradition</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Life Lessons</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-start space-x-2">
                        <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Sportsmanship and respect</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Teamwork and collaboration</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Perseverance and dedication</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                        <span>Pride in representing your team</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Section */}
        <section className="px-4 py-12">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-hawks-red rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCamera className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-hawks-navy mb-4">
                  Photo Sharing Platform
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  This platform was created specifically for the Hawks Baseball team to 
                  capture, share, and preserve our Cooperstown Dreams Park memories. 
                  It's designed to bring families together and celebrate our journey.
                </p>
              </div>

              {/* Platform Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {platformFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-hawks-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-2xl text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-hawks-navy mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Platform Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-hawks-navy mb-4">For Players</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Share your best moments with teammates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Tag yourself in action shots</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Create lasting memories of your tournament</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Celebrate team achievements together</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-hawks-navy mb-4">For Families</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Stay connected with the team experience</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Share photos with extended family</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Preserve precious tournament memories</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaHeart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Support your player's journey</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 py-12">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-hawks-navy mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Have questions about the Hawks team, the tournament, or this platform? 
                We'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-hawks-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-hawks-red-dark transition-colors">
                  Contact Coaches
                </button>
                <button className="bg-hawks-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-hawks-navy-dark transition-colors">
                  Platform Support
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage; 