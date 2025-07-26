import React, { useState } from 'react';
import { FaMapMarkerAlt, FaParking, FaUtensils, FaShoppingCart, FaGift, FaBaseballBall, FaInfoCircle, FaDirections, FaPhone, FaGlobe, FaClock } from 'react-icons/fa';

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const locations = {
    fields: [
      {
        id: 'main-stadium',
        name: 'Main Stadium',
        description: 'Championship games and opening ceremonies',
        category: 'fields',
        coordinates: { x: 50, y: 30 },
        icon: FaBaseballBall,
        color: 'bg-hawks-red'
      },
      {
        id: 'field-1',
        name: 'Field 1',
        description: 'Tournament quarterfinal games',
        category: 'fields',
        coordinates: { x: 20, y: 20 },
        icon: FaBaseballBall,
        color: 'bg-hawks-red'
      },
      {
        id: 'field-2',
        name: 'Field 2',
        description: 'Pool play games',
        category: 'fields',
        coordinates: { x: 80, y: 20 },
        icon: FaBaseballBall,
        color: 'bg-hawks-red'
      },
      {
        id: 'field-3',
        name: 'Field 3',
        description: 'Practice and tournament games',
        category: 'fields',
        coordinates: { x: 20, y: 60 },
        icon: FaBaseballBall,
        color: 'bg-hawks-red'
      },
      {
        id: 'field-4',
        name: 'Field 4',
        description: 'Pool play and semifinal games',
        category: 'fields',
        coordinates: { x: 80, y: 60 },
        icon: FaBaseballBall,
        color: 'bg-hawks-red'
      }
    ],
    amenities: [
      {
        id: 'main-office',
        name: 'Main Office',
        description: 'Registration, information, and assistance',
        category: 'amenities',
        coordinates: { x: 50, y: 10 },
        icon: FaInfoCircle,
        color: 'bg-hawks-navy'
      },
      {
        id: 'dining-hall',
        name: 'Dining Hall',
        description: 'Team meals and refreshments',
        category: 'amenities',
        coordinates: { x: 30, y: 40 },
        icon: FaUtensils,
        color: 'bg-green-500'
      },
      {
        id: 'team-room',
        name: 'Team Room',
        description: 'Hawks team meetings and strategy sessions',
        category: 'amenities',
        coordinates: { x: 70, y: 40 },
        icon: FaInfoCircle,
        color: 'bg-hawks-navy'
      },
      {
        id: 'photo-area',
        name: 'Photo Area',
        description: 'Official team and player photos',
        category: 'amenities',
        coordinates: { x: 50, y: 80 },
        icon: FaInfoCircle,
        color: 'bg-purple-500'
      }
    ],
    parking: [
      {
        id: 'main-parking',
        name: 'Main Parking Lot',
        description: 'Primary parking area for teams and families',
        category: 'parking',
        coordinates: { x: 10, y: 50 },
        icon: FaParking,
        color: 'bg-gray-500'
      },
      {
        id: 'overflow-parking',
        name: 'Overflow Parking',
        description: 'Additional parking during peak times',
        category: 'parking',
        coordinates: { x: 90, y: 50 },
        icon: FaParking,
        color: 'bg-gray-500'
      }
    ],
    shopping: [
      {
        id: 'pro-shop',
        name: 'Pro Shop',
        description: 'Baseball equipment and Dreams Park merchandise',
        category: 'shopping',
        coordinates: { x: 40, y: 70 },
        icon: FaShoppingCart,
        color: 'bg-orange-500'
      },
      {
        id: 'pin-trading',
        name: 'Pin Trading Area',
        description: 'Traditional pin trading with other teams',
        category: 'shopping',
        coordinates: { x: 60, y: 70 },
        icon: FaGift,
        color: 'bg-yellow-500'
      }
    ]
  };

  const allLocations = [
    ...locations.fields,
    ...locations.amenities,
    ...locations.parking,
    ...locations.shopping
  ];

  const filteredLocations = activeCategory === 'all' 
    ? allLocations
    : allLocations.filter(location => location.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Locations', icon: FaMapMarkerAlt, color: 'bg-gray-500' },
    { id: 'fields', name: 'Baseball Fields', icon: FaBaseballBall, color: 'bg-hawks-red' },
    { id: 'amenities', name: 'Amenities', icon: FaInfoCircle, color: 'bg-hawks-navy' },
    { id: 'parking', name: 'Parking', icon: FaParking, color: 'bg-gray-500' },
    { id: 'shopping', name: 'Shopping', icon: FaShoppingCart, color: 'bg-orange-500' }
  ];

  const getDirections = (location) => {
    const directions = {
      'main-stadium': 'Located at the center of Dreams Park, accessible from all parking areas',
      'field-1': 'Northwest corner, near main parking lot',
      'field-2': 'Northeast corner, near overflow parking',
      'field-3': 'Southwest corner, near dining hall',
      'field-4': 'Southeast corner, near team room',
      'main-office': 'Front entrance, first building on the left',
      'dining-hall': 'West side, between fields 1 and 3',
      'team-room': 'East side, between fields 2 and 4',
      'photo-area': 'South side, near pro shop',
      'main-parking': 'Northwest entrance, closest to fields 1 and 3',
      'overflow-parking': 'Northeast entrance, closest to fields 2 and 4',
      'pro-shop': 'South side, near photo area',
      'pin-trading': 'South side, between pro shop and photo area'
    };
    return directions[location.id] || 'Ask staff for directions';
  };

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
              Dreams Park Map
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Navigate the historic grounds of Cooperstown Dreams Park. 
              Find fields, amenities, and everything you need for the ultimate baseball experience.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="px-4 mb-8">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-hawks-navy mb-4">Filter by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        activeCategory === category.id
                          ? 'bg-hawks-red text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Map and Locations */}
        <section className="px-4 pb-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Interactive Map */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-hawks-navy mb-6">Dreams Park Layout</h2>
                  
                  <div className="relative bg-green-100 rounded-lg p-8 border-4 border-green-300">
                    {/* Map Background */}
                    <div className="absolute inset-0 bg-green-50 rounded-lg opacity-50"></div>
                    
                    {/* Location Markers */}
                    {filteredLocations.map(location => {
                      const Icon = location.icon;
                      return (
                        <button
                          key={location.id}
                          onClick={() => setSelectedLocation(location)}
                          className={`absolute w-8 h-8 ${location.color} rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                          style={{
                            left: `${location.coordinates.x}%`,
                            top: `${location.coordinates.y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          title={location.name}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}

                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend</h4>
                      <div className="space-y-1 text-xs">
                       {categories.slice(1).map(category => (
                         <div key={category.id} className="flex items-center space-x-2">
                           <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                           <span className="text-gray-600">{category.name}</span>
                         </div>
                       ))}
                      </div>
                    </div>
                  </div>

                  {/* Map Instructions */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">How to Use the Map</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Click on any marker to see location details</li>
                      <li>• Use the category filter to focus on specific areas</li>
                      <li>• All distances are approximate</li>
                      <li>• Ask staff for exact directions if needed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-hawks-navy mb-6">Location Details</h2>
                  
                  {selectedLocation ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${selectedLocation.color} rounded-lg flex items-center justify-center`}>
                          <selectedLocation.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedLocation.name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {selectedLocation.category}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700">
                        {selectedLocation.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FaDirections className="w-4 h-4 text-hawks-red" />
                          <span>{getDirections(selectedLocation)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FaMapMarkerAlt className="w-4 h-4 text-hawks-red" />
                          <span>Coordinates: {selectedLocation.coordinates.x}%, {selectedLocation.coordinates.y}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaMapMarkerAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Click on a map marker to see location details
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-hawks-navy mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-700 hover:text-hawks-red transition-colors"
                    >
                      <FaGlobe className="w-4 h-4" />
                      <span>Google Maps Directions</span>
                    </a>
                    <a
                      href="tel:+1234567890"
                      className="flex items-center space-x-2 text-gray-700 hover:text-hawks-red transition-colors"
                    >
                      <FaPhone className="w-4 h-4" />
                      <span>Dreams Park Office</span>
                    </a>
                    <a
                      href="https://cooperstowndreamspark.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-700 hover:text-hawks-red transition-colors"
                    >
                      <FaGlobe className="w-4 h-4" />
                      <span>Official Website</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="px-4 pb-12">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-hawks-navy mb-6">Park Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Park Hours & Access</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaClock className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Gates open: 7:00 AM daily</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaClock className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Games begin: 8:30 AM</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaClock className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Park closes: 10:00 PM</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaParking className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Free parking for all visitors</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Amenities & Services</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <FaUtensils className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Full-service dining hall</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaShoppingCart className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Pro shop with equipment and souvenirs</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaGift className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Pin trading area</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FaInfoCircle className="w-4 h-4 text-hawks-red mt-1 flex-shrink-0" />
                      <span>Information desk and assistance</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-hawks-red/10 border border-hawks-red/20 rounded-lg">
                <h4 className="font-semibold text-hawks-red mb-2">Important Notes</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• All fields are maintained to professional standards</li>
                  <li>• Restrooms and water fountains available throughout the park</li>
                  <li>• First aid station located near the main office</li>
                  <li>• Lost and found at the main office</li>
                  <li>• Weather updates available at the main office</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MapPage; 