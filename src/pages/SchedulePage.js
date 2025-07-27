import React, { useState } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaTrophy, FaFlag, FaUsers, FaBaseballBall, FaStar } from 'react-icons/fa';

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState('all');

  const schedule = {
    'Day 1 - Opening Ceremonies': [
      {
        time: '8:00 AM',
        event: 'Team Check-in & Registration',
        location: 'Dreams Park Main Office',
        description: 'Official team registration and welcome packet pickup',
        type: 'registration'
      },
      {
        time: '10:00 AM',
        event: 'Opening Ceremonies',
        location: 'Main Stadium',
        description: 'Parade of teams, national anthem, and welcome speeches',
        type: 'ceremony'
      },
      {
        time: '12:00 PM',
        event: 'Team Photo Session',
        location: 'Photo Area',
        description: 'Official team and individual player photos',
        type: 'photo'
      },
      {
        time: '2:00 PM',
        event: 'Practice Session',
        location: 'Field 3',
        description: 'Team practice and field familiarization',
        type: 'practice'
      },
      {
        time: '6:00 PM',
        event: 'Welcome Dinner',
        location: 'Dining Hall',
        description: 'Team dinner and tournament briefing',
        type: 'meal'
      }
    ],
    'Day 2 - Pool Play': [
      {
        time: '8:30 AM',
        event: 'Pool Play Game 1',
        location: 'Field 2',
        description: 'First pool play game of the tournament',
        type: 'game'
      },
      {
        time: '11:00 AM',
        event: 'Pool Play Game 2',
        location: 'Field 4',
        description: 'Second pool play game of the tournament',
        type: 'game'
      },
      {
        time: '2:30 PM',
        event: 'Skills Competition',
        location: 'Main Stadium',
        description: 'Home run derby and fastest runner contest',
        type: 'competition'
      },
      {
        time: '5:00 PM',
        event: 'Team Meeting',
        location: 'Team Room',
        description: 'Game review and strategy session',
        type: 'meeting'
      }
    ],
    'Day 3 - Tournament Games': [
      {
        time: '9:00 AM',
        event: 'Tournament Quarterfinal',
        location: 'Field 1',
        description: 'Quarterfinal round game',
        type: 'game'
      },
      {
        time: '12:30 PM',
        event: 'Tournament Semifinal',
        location: 'Field 3',
        description: 'Semifinal round game',
        type: 'game'
      },
      {
        time: '4:00 PM',
        event: 'Championship Game',
        location: 'Main Stadium',
        description: 'Tournament championship game',
        type: 'game'
      },
      {
        time: '6:30 PM',
        event: 'Awards Ceremony',
        location: 'Main Stadium',
        description: 'Tournament awards and recognition',
        type: 'ceremony'
      }
    ],
    'Day 4 - Dreams Park Tour': [
      {
        time: '9:00 AM',
        event: 'Cooperstown Tour',
        location: 'Downtown Cooperstown',
        description: 'Visit to Baseball Hall of Fame and local attractions',
        type: 'tour'
      },
      {
        time: '12:00 PM',
        event: 'Lunch & Shopping',
        location: 'Main Street',
        description: 'Free time for lunch and souvenir shopping',
        type: 'free'
      },
      {
        time: '2:00 PM',
        event: 'Pin Trading',
        location: 'Pin Trading Area',
        description: 'Traditional pin trading with other teams',
        type: 'activity'
      },
      {
        time: '4:00 PM',
        event: 'Farewell Ceremony',
        location: 'Main Stadium',
        description: 'Closing ceremonies and team photos',
        type: 'ceremony'
      }
    ]
  };

  const eventTypes = {
    game: { icon: FaBaseballBall, color: 'bg-hawks-red', textColor: 'text-white' },
    ceremony: { icon: FaFlag, color: 'bg-hawks-navy', textColor: 'text-white' },
    practice: { icon: FaUsers, color: 'bg-green-500', textColor: 'text-white' },
    meal: { icon: FaStar, color: 'bg-yellow-500', textColor: 'text-white' },
    registration: { icon: FaCalendar, color: 'bg-purple-500', textColor: 'text-white' },
    photo: { icon: FaStar, color: 'bg-pink-500', textColor: 'text-white' },
    competition: { icon: FaTrophy, color: 'bg-orange-500', textColor: 'text-white' },
    meeting: { icon: FaUsers, color: 'bg-blue-500', textColor: 'text-white' },
    tour: { icon: FaMapMarkerAlt, color: 'bg-teal-500', textColor: 'text-white' },
    activity: { icon: FaStar, color: 'bg-indigo-500', textColor: 'text-white' },
    free: { icon: FaStar, color: 'bg-gray-500', textColor: 'text-white' }
  };

  const getEventType = (type) => {
    return eventTypes[type] || eventTypes.game;
  };

  const filteredSchedule = selectedDay === 'all' 
    ? Object.entries(schedule)
    : Object.entries(schedule).filter(([day]) => day.includes(selectedDay));

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
              Tournament Schedule
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Follow the Hawks' journey through Cooperstown Dreams Park 2025. 
              Every moment is an opportunity to create lasting memories.
            </p>
          </div>
        </section>

        {/* Day Filter */}
        <section className="px-4 mb-8">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-hawks-navy mb-4">Filter by Day</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDay('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDay === 'all'
                      ? 'bg-hawks-red text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Days
                </button>
                {Object.keys(schedule).map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day.split(' - ')[0])}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDay === day.split(' - ')[0]
                        ? 'bg-hawks-red text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {day.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="px-4 pb-12">
          <div className="container mx-auto">
            {filteredSchedule.map(([day, events]) => (
              <div key={day} className="mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Day Header */}
                  <div className="bg-hawks-navy text-white p-6">
                    <h2 className="text-2xl font-bold mb-2">{day}</h2>
                    <p className="text-white/80">
                      {events.length} event{events.length !== 1 ? 's' : ''} scheduled
                    </p>
                  </div>

                  {/* Events */}
                  <div className="divide-y divide-gray-200">
                    {events.map((event, index) => {
                      const eventType = getEventType(event.type);
                      const Icon = eventType.icon;
                      
                      return (
                        <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-4">
                            {/* Event Icon */}
                            <div className={`w-12 h-12 ${eventType.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-6 h-6 ${eventType.textColor}`} />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {event.event}
                                  </h3>
                                  <p className="text-gray-600 mb-2">
                                    {event.description}
                                  </p>
                                  
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <FaClock className="w-4 h-4" />
                                      <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <FaMapMarkerAlt className="w-4 h-4" />
                                      <span>{event.location}</span>
                                    </div>
                                    {event.type === 'game' && (
                                      <div className="flex items-center space-x-1">
                                        <FaBaseballBall className="w-4 h-4" />
                                        <span>Game</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Event Type Badge */}
                                <div className="ml-4">
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${eventType.color} ${eventType.textColor}`}>
                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tournament Info */}
        <section className="px-4 pb-12">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-hawks-navy mb-6">Tournament Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Dreams Park Values</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Emphasis on tradition, faith, and country</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Life-enriching experience for all players</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Building pride, dignity, and accomplishment</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaStar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Honoring the legacy of America's pastime</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Notes</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaClock className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>All times are Eastern Standard Time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Check field assignments 30 minutes before games</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaUsers className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Team meetings are mandatory for all players</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaTrophy className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Awards ceremony open to all families</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-hawks-red/10 border border-hawks-red/20 rounded-lg">
                <h4 className="font-semibold text-hawks-red mb-2">Tournament Rules & Sportsmanship</h4>
                <p className="text-gray-700 text-sm">
                  Cooperstown Dreams Park emphasizes the values of sportsmanship, respect, and fair play. 
                  All players are expected to conduct themselves with dignity and honor both on and off the field. 
                  Remember, this is about creating memories and building character through the great game of baseball.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SchedulePage; 