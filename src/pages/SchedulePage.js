import React, { useState } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaTrophy, FaFlag, FaUsers, FaBaseballBall, FaStar, FaUtensils, FaCamera, FaFire, FaDownload, FaPlus } from 'react-icons/fa';

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState('all');
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const schedule = {
    'Day 1 - Thursday, July 31': [
      {
        time: '2:30 PM - 8:00 PM',
        event: 'Team Arrival, Check-In & Registration',
        location: 'Main Office',
        description: 'Team arrival, check-in, registration, and team photos',
        type: 'registration'
      },
      {
        time: '3:30 PM',
        event: 'Hawks Baseball vs Burlington Bulldogs',
        location: 'Field 14',
        description: 'Pool Play Game 1 - Hawks Baseball (CA) vs Burlington Bulldogs (CT)',
        type: 'game',
        gameId: '373102',
        homeTeam: 'Burlington Bulldogs',
        awayTeam: 'Hawks Baseball'
      },
      {
        time: '4:00 PM - 7:30 PM',
        event: 'Dinner',
        location: 'Dining Hall',
        description: 'Team dinner service',
        type: 'meal'
      },
      {
        time: '8:00 PM',
        event: 'Umpire Orientation',
        location: 'Meeting Hall',
        description: 'Umpire orientation and briefing',
        type: 'meeting'
      },
      {
        time: '8:30 PM',
        event: 'Head Coach/Umpire Tournament Rules Meeting',
        location: 'Meeting Hall',
        description: 'Mandatory tournament rules meeting for coaches and umpires',
        type: 'meeting'
      }
    ],
    'Day 2 - Friday, August 1': [
      {
        time: '6:00 AM - 8:30 AM',
        event: 'Breakfast',
        location: 'Dining Hall',
        description: 'Team breakfast service',
        type: 'meal'
      },
      {
        time: '8:45 AM - 9:15 AM',
        event: 'Fire Drill and Team Opening Ceremony Lineup',
        location: 'Main Stadium',
        description: 'Safety drill and ceremony preparation',
        type: 'ceremony'
      },
      {
        time: '9:30 AM',
        event: 'Opening Ceremony/Skills Competitions',
        location: 'Main Stadium',
        description: 'Official opening ceremony and skills competitions',
        type: 'ceremony'
      },
      {
        time: '11:30 AM',
        event: 'Hawks Baseball vs Premier Sports Baseball',
        location: 'Field 15',
        description: 'Pool Play Game 2 - Hawks Baseball (CA) vs Premier Sports Baseball (NY)',
        type: 'game',
        gameId: '373179',
        homeTeam: 'Premier Sports Baseball',
        awayTeam: 'Hawks Baseball'
      },
      {
        time: '12:00 PM - 3:30 PM',
        event: 'Lunch',
        location: 'Dining Hall',
        description: 'Team lunch service',
        type: 'meal'
      },
      {
        time: '4:30 PM',
        event: 'Massachusetts Marauders vs Hawks Baseball',
        location: 'Field 11',
        description: 'Pool Play Game 3 - Massachusetts Marauders (MA) vs Hawks Baseball (CA)',
        type: 'game',
        gameId: '373217',
        homeTeam: 'Massachusetts Marauders',
        awayTeam: 'Hawks Baseball'
      },
      {
        time: '4:30 PM - 9:00 PM',
        event: 'Dinner',
        location: 'Dining Hall',
        description: 'Team dinner service',
        type: 'meal'
      }
    ],
    'Day 3 - Saturday, August 2': [
      {
        time: '6:30 AM - 9:30 AM',
        event: 'Breakfast',
        location: 'Dining Hall',
        description: 'Team breakfast service',
        type: 'meal'
      },
      {
        time: '9:00 AM, 11:30 AM, 2:00 PM, 4:30 PM & 7:00 PM',
        event: 'Pool Play Games',
        location: 'Various Fields',
        description: 'Pool play tournament games',
        type: 'game'
      },
      {
        time: '11:30 AM',
        event: 'Hawks Baseball vs Texas Smoke',
        location: 'Field 17',
        description: 'Tournament Game - Hawks Baseball (CA) vs Texas Smoke (TX)',
        type: 'game',
        gameId: '373285',
        homeTeam: 'Texas Smoke',
        awayTeam: 'Hawks Baseball'
      },
      {
        time: '11:00 AM - 2:30 PM',
        event: 'Lunch',
        location: 'Dining Hall',
        description: 'Team lunch service',
        type: 'meal'
      },
      {
        time: '7:00 PM',
        event: 'Great Bay All Stars vs Hawks Baseball',
        location: 'Field 1',
        description: 'Tournament Game - Great Bay All Stars (NH) vs Hawks Baseball (CA)',
        type: 'game',
        gameId: '373332',
        homeTeam: 'Great Bay All Stars',
        awayTeam: 'Hawks Baseball'
      },
      {
        time: '5:00 PM - 8:30 PM',
        event: 'Dinner',
        location: 'Dining Hall',
        description: 'Team dinner service',
        type: 'meal'
      }
    ],
    'Day 4 - Sunday, August 3': [
      {
        time: '6:30 AM - 9:30 AM',
        event: 'Breakfast',
        location: 'Dining Hall',
        description: 'Team breakfast service',
        type: 'meal'
      },
      {
        time: '9:00 AM, 11:30 AM, 2:00 PM, 4:30 PM & 7:00 PM',
        event: 'Pool Play Games',
        location: 'Various Fields',
        description: 'Pool play tournament games',
        type: 'game'
      },
      {
        time: '11:00 AM - 2:30 PM',
        event: 'Lunch',
        location: 'Dining Hall',
        description: 'Team lunch service',
        type: 'meal'
      },
      {
        time: '5:00 PM - 8:30 PM',
        event: 'Dinner',
        location: 'Dining Hall',
        description: 'Team dinner service',
        type: 'meal'
      }
    ],
    'Day 5 - Monday, August 4': [
      {
        time: '6:30 AM - 9:30 AM',
        event: 'Breakfast',
        location: 'Dining Hall',
        description: 'Team breakfast service',
        type: 'meal'
      },
      {
        time: '9:00 AM, 11:30 AM, 2:00 PM, 4:30 PM & 7:00 PM',
        event: 'Single Elimination Tournament Games',
        location: 'Various Fields',
        description: 'Single elimination tournament games',
        type: 'game'
      },
      {
        time: '11:00 AM - 2:30 PM',
        event: 'Lunch',
        location: 'Dining Hall',
        description: 'Team lunch service',
        type: 'meal'
      },
      {
        time: '5:00 PM - 8:30 PM',
        event: 'Dinner',
        location: 'Dining Hall',
        description: 'Team dinner service',
        type: 'meal'
      }
    ],
    'Day 6 - Tuesday, August 5': [
      {
        time: '6:30 AM - 9:30 AM',
        event: 'Breakfast',
        location: 'Dining Hall',
        description: 'Team breakfast service',
        type: 'meal'
      },
      {
        time: '9:00 AM',
        event: 'Sweet Sixteen',
        location: 'Various Fields',
        description: 'Sweet Sixteen tournament games',
        type: 'game'
      },
      {
        time: '12:00 PM',
        event: 'Elite Eight',
        location: 'Various Fields',
        description: 'Elite Eight tournament games',
        type: 'game'
      },
      {
        time: '3:00 PM',
        event: 'Final Four',
        location: 'Various Fields',
        description: 'Final Four tournament games',
        type: 'game'
      },
      {
        time: '11:00 AM - 2:30 PM',
        event: 'Lunch',
        location: 'Dining Hall',
        description: 'Team lunch service',
        type: 'meal'
      },
      {
        time: '4:00 PM - 5:30 PM',
        event: 'Dinner',
        location: 'Dining Hall',
        description: 'Team dinner service',
        type: 'meal'
      },
      {
        time: '5:45 PM',
        event: 'Team Line Up',
        location: 'Main Stadium',
        description: 'Teams line up for closing ceremony',
        type: 'ceremony'
      },
      {
        time: '6:00 PM',
        event: 'Closing Ceremony',
        location: 'Main Stadium',
        description: 'Official closing ceremony',
        type: 'ceremony'
      },
      {
        time: '9:00 PM',
        event: 'Fireworks',
        location: 'Main Stadium',
        description: 'Fireworks display',
        type: 'activity'
      },
      {
        time: '9:15 PM',
        event: 'Championship Game',
        location: 'Main Stadium',
        description: 'Tournament championship game',
        type: 'game'
      }
    ],
    'Day 7 - Wednesday, August 6': [
      {
        time: '6:00 AM - 9:00 AM',
        event: 'Team Check-Out',
        location: 'Main Office',
        description: 'Team check-out and departure',
        type: 'registration'
      }
    ]
  };

  const eventTypes = {
    game: { icon: FaBaseballBall, color: 'bg-hawks-red', textColor: 'text-white' },
    ceremony: { icon: FaFlag, color: 'bg-hawks-navy', textColor: 'text-white' },
    practice: { icon: FaUsers, color: 'bg-green-500', textColor: 'text-white' },
    meal: { icon: FaUtensils, color: 'bg-yellow-500', textColor: 'text-white' },
    registration: { icon: FaCalendar, color: 'bg-purple-500', textColor: 'text-white' },
    photo: { icon: FaCamera, color: 'bg-pink-500', textColor: 'text-white' },
    competition: { icon: FaTrophy, color: 'bg-orange-500', textColor: 'text-white' },
    meeting: { icon: FaUsers, color: 'bg-blue-500', textColor: 'text-white' },
    tour: { icon: FaMapMarkerAlt, color: 'bg-teal-500', textColor: 'text-white' },
    activity: { icon: FaFire, color: 'bg-indigo-500', textColor: 'text-white' },
    free: { icon: FaStar, color: 'bg-gray-500', textColor: 'text-white' }
  };

  const getEventType = (type) => {
    return eventTypes[type] || eventTypes.game;
  };

  // Calendar sync functions
  const formatTimeForCalendar = (timeStr) => {
    // Convert time strings to proper format for calendar
    const time = timeStr.split(' ')[0]; // Get just the time part
    const isPM = timeStr.includes('PM');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getEventDate = (dayKey) => {
    const dateMap = {
      'Day 1 - Thursday, July 31': '2025-07-31',
      'Day 2 - Friday, August 1': '2025-08-01',
      'Day 3 - Saturday, August 2': '2025-08-02',
      'Day 4 - Sunday, August 3': '2025-08-03',
      'Day 5 - Monday, August 4': '2025-08-04',
      'Day 6 - Tuesday, August 5': '2025-08-05',
      'Day 7 - Wednesday, August 6': '2025-08-06'
    };
    return dateMap[dayKey];
  };

  const addToCalendar = (event, dayKey) => {
    const eventDate = getEventDate(dayKey);
    const time = formatTimeForCalendar(event.time);
    const startTime = `${eventDate}T${time}:00`;
    
    // For events with time ranges, use the start time
    const endTime = event.time.includes('-') 
      ? `${eventDate}T${formatTimeForCalendar(event.time.split('-')[1].trim())}:00`
      : `${eventDate}T${time.split(':')[0]}:${(parseInt(time.split(':')[1]) + 30).toString().padStart(2, '0')}:00`;

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.event)}&dates=${startTime.replace(/[-:]/g, '')}/${endTime.replace(/[-:]/g, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    window.open(calendarUrl, '_blank');
  };

  const downloadFullCalendar = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hawks Baseball//Cooperstown Tournament//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Hawks Baseball - Cooperstown Tournament
X-WR-CALDESC:Tournament #12 - July 30, 2025 • Cooperstown Dreams Park
X-PUBLISHED-TTL:PT1H
`;

    Object.entries(schedule).forEach(([dayKey, events]) => {
      const eventDate = getEventDate(dayKey);
      
      events.forEach((event, index) => {
        const time = formatTimeForCalendar(event.time);
        const startTime = `${eventDate}T${time}:00`;
        const endTime = event.time.includes('-') 
          ? `${eventDate}T${formatTimeForCalendar(event.time.split('-')[1].trim())}:00`
          : `${eventDate}T${time.split(':')[0]}:${(parseInt(time.split(':')[1]) + 30).toString().padStart(2, '0')}:00`;

        icsContent += `BEGIN:VEVENT
UID:${event.gameId || `hawks-${dayKey}-${index}`}@hawksbaseball.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startTime.replace(/[-:]/g, '')}Z
DTEND:${endTime.replace(/[-:]/g, '')}Z
SUMMARY:${event.event}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
      });
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hawks-cooperstown-tournament.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
         URL.revokeObjectURL(url);
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
              Tournament #12 - July 30, 2025 • Cooperstown Dreams Park
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mt-2">
              Complete tournament itinerary with Hawks games highlighted. Every moment is an opportunity to create lasting memories.
            </p>
          </div>
        </section>

        {/* Calendar Sync Options */}
        <section className="px-4 mb-6">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                 <div>
                   <h2 className="text-xl font-semibold text-hawks-navy mb-2">Sync to Calendar</h2>
                   <p className="text-gray-600">Add tournament events to your calendar</p>
                 </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                    className="bg-hawks-red text-white px-4 py-2 rounded-lg font-medium hover:bg-hawks-red-dark transition-colors flex items-center space-x-2"
                  >
                    <FaCalendar className="w-4 h-4" />
                    <span>Calendar Options</span>
                  </button>
                  <button
                    onClick={downloadFullCalendar}
                    className="bg-hawks-navy text-white px-4 py-2 rounded-lg font-medium hover:bg-hawks-navy-dark transition-colors flex items-center space-x-2"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Download All Events</span>
                  </button>
                </div>
              </div>
              
                             {showCalendarOptions && (
                 <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                   <h3 className="font-semibold text-gray-800 mb-3">Calendar Sync Options</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                     <div>
                       <h4 className="font-medium text-gray-700 mb-2">Individual Events</h4>
                       <p className="text-gray-600 mb-3">Click the calendar icon next to any event to add it to your calendar</p>
                     </div>
                     <div>
                       <h4 className="font-medium text-gray-700 mb-2">Download All Events</h4>
                       <p className="text-gray-600 mb-3">Download the complete tournament schedule as an .ics file for any calendar app</p>
                     </div>
                     <div>
                       <h4 className="font-medium text-gray-700 mb-2">Supported Platforms</h4>
                       <p className="text-gray-600 mb-3">Works with Google Calendar, Apple Calendar, Outlook, and all major calendar apps</p>
                     </div>
                   </div>
                 </div>
               )}
            </div>
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
                      
                      return (
                        <div key={index} className={`p-6 hover:bg-gray-50 transition-colors ${event.gameId ? 'bg-hawks-red/5 border-l-4 border-hawks-red' : ''}`}>
                          <div className="flex items-start space-x-4">
                            {/* Event Icon */}
                            <div className={`w-12 h-12 ${eventType.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              {(() => {
                                switch(event.type) {
                                  case 'game': return <FaBaseballBall className={`w-6 h-6 ${eventType.textColor}`} />;
                                  case 'ceremony': return <FaFlag className={`w-6 h-6 ${eventType.textColor}`} />;
                                  case 'meal': return <FaUtensils className={`w-6 h-6 ${eventType.textColor}`} />;
                                  case 'registration': return <FaCalendar className={`w-6 h-6 ${eventType.textColor}`} />;
                                  case 'photo': return <FaCamera className={`w-6 h-6 ${eventType.textColor}`} />;
                                  case 'competition': return <FaTrophy className={`w-6 h-6 ${eventType.textColor}`} />;
                                  case 'meeting': return <FaUsers className={`w-6 h-6 ${eventType.textColor}`} />;
                                  case 'activity': return <FaFire className={`w-6 h-6 ${eventType.textColor}`} />;
                                  default: return <FaStar className={`w-6 h-6 ${eventType.textColor}`} />;
                                }
                              })()}
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

                                {/* Event Type Badge and Calendar Button */}
                                <div className="ml-4 flex flex-col items-end space-y-2">
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${eventType.color} ${eventType.textColor}`}>
                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                  </span>
                                  {event.gameId && (
                                    <div className="text-right">
                                      <span className="text-xs text-gray-500">ID: {event.gameId}</span>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => addToCalendar(event, day)}
                                    className="text-hawks-red hover:text-hawks-red-dark transition-colors"
                                    title="Add to Calendar"
                                  >
                                    <FaPlus className="w-4 h-4" />
                                  </button>
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tournament Details</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaCalendar className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Tournament #12 - July 30, 2025</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaUsers className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Hawks Baseball (CA) - 5 games scheduled</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Cooperstown Dreams Park, NY</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaClock className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>All times Eastern Standard Time</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Notes</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaClock className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Arrive 30 minutes before game time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Check field assignments at Dreams Park</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaUsers className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Team meetings before each game</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaTrophy className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Tournament awards ceremony TBD</span>
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

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Official Tournament Information</h4>
                <p className="text-gray-700 text-sm mb-2">
                  This schedule incorporates the official tournament itinerary from <a href="https://www.cooperstowndreamspark.com/tournament-itinerary/" className="text-blue-600 hover:underline">Cooperstown Dreams Park</a>. 
                  Games have no time limits and all times are subject to change and weather dependent.
                </p>
                <p className="text-gray-700 text-sm">
                  Participate in daily Cooperstown Dreams Park Baseball Pin Trading events throughout the tournament.
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