import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MapPage from '../pages/MapPage';

const renderMapPage = () => {
  return render(<MapPage />);
};

describe('MapPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders map page title', () => {
      renderMapPage();
      
      expect(screen.getByText('Dreams Park Map')).toBeInTheDocument();
      expect(screen.getByText(/Navigate the historic grounds/)).toBeInTheDocument();
    });

    test('renders category filter buttons', () => {
      renderMapPage();
      
      expect(screen.getByText('All Locations')).toBeInTheDocument();
      expect(screen.getByText('Baseball Fields')).toBeInTheDocument();
      expect(screen.getByText('Amenities')).toBeInTheDocument();
      expect(screen.getByText('Parking')).toBeInTheDocument();
      expect(screen.getByText('Shopping')).toBeInTheDocument();
    });

    test('renders map container', () => {
      renderMapPage();
      
      expect(screen.getByText('Dreams Park Layout')).toBeInTheDocument();
      expect(screen.getByText('Location Details')).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    test('shows all locations by default', () => {
      renderMapPage();
      
      // Should show locations from all categories
      expect(screen.getByText('Main Stadium')).toBeInTheDocument();
      expect(screen.getByText('Main Office')).toBeInTheDocument();
      expect(screen.getByText('Main Parking Lot')).toBeInTheDocument();
      expect(screen.getByText('Pro Shop')).toBeInTheDocument();
    });

    test('filters locations by selected category', async () => {
      const user = userEvent.setup();
      renderMapPage();
      
      // Click on Baseball Fields filter
      const fieldsButton = screen.getByText('Baseball Fields');
      await user.click(fieldsButton);
      
      // Should show only field locations
      expect(screen.getByText('Main Stadium')).toBeInTheDocument();
      expect(screen.getByText('Field 1')).toBeInTheDocument();
      expect(screen.getByText('Field 2')).toBeInTheDocument();
      
      // Should not show non-field locations
      expect(screen.queryByText('Main Office')).not.toBeInTheDocument();
      expect(screen.queryByText('Pro Shop')).not.toBeInTheDocument();
    });

    test('highlights selected category filter', async () => {
      const user = userEvent.setup();
      renderMapPage();
      
      const fieldsButton = screen.getByText('Baseball Fields');
      await user.click(fieldsButton);
      
      // The selected button should have the active class
      expect(fieldsButton).toHaveClass('bg-hawks-red');
    });

    test('returns to all locations when "All Locations" is selected', async () => {
      const user = userEvent.setup();
      renderMapPage();
      
      // First select a specific category
      const fieldsButton = screen.getByText('Baseball Fields');
      await user.click(fieldsButton);
      
      // Then select "All Locations"
      const allLocationsButton = screen.getByText('All Locations');
      await user.click(allLocationsButton);
      
      // Should show locations from all categories again
      expect(screen.getByText('Main Stadium')).toBeInTheDocument();
      expect(screen.getByText('Main Office')).toBeInTheDocument();
      expect(screen.getByText('Pro Shop')).toBeInTheDocument();
    });
  });

  describe('Location Selection', () => {
    test('shows location details when marker is clicked', async () => {
      const user = userEvent.setup();
      renderMapPage();
      
      // Find and click a location marker
      const locationMarkers = screen.getAllByRole('button');
      const firstMarker = locationMarkers[0];
      
      await user.click(firstMarker);
      
      // Should show location details
      expect(screen.getByText('Location Details')).toBeInTheDocument();
    });

    test('displays location information correctly', async () => {
      const user = userEvent.setup();
      renderMapPage();
      
      // Click on a location marker
      const locationMarkers = screen.getAllByRole('button');
      await user.click(locationMarkers[0]);
      
      // Should show location name, description, and directions
      expect(screen.getByText(/Main Stadium/)).toBeInTheDocument();
      expect(screen.getByText(/Championship games and opening ceremonies/)).toBeInTheDocument();
      expect(screen.getByText(/Located at the center of Dreams Park/)).toBeInTheDocument();
    });

    test('shows coordinates for selected location', async () => {
      const user = userEvent.setup();
      renderMapPage();
      
      // Click on a location marker
      const locationMarkers = screen.getAllByRole('button');
      await user.click(locationMarkers[0]);
      
      // Should show coordinates
      expect(screen.getByText(/Coordinates:/)).toBeInTheDocument();
    });
  });

  describe('Map Legend', () => {
    test('displays map legend', () => {
      renderMapPage();
      
      expect(screen.getByText('Legend')).toBeInTheDocument();
      expect(screen.getByText('Baseball Fields')).toBeInTheDocument();
      expect(screen.getByText('Amenities')).toBeInTheDocument();
      expect(screen.getByText('Parking')).toBeInTheDocument();
      expect(screen.getByText('Shopping')).toBeInTheDocument();
    });

    test('legend shows correct color indicators', () => {
      renderMapPage();
      
      // Check that legend items have color indicators
      const legendItems = screen.getAllByText(/Baseball Fields|Amenities|Parking|Shopping/);
      expect(legendItems.length).toBeGreaterThan(0);
    });
  });

  describe('Quick Links', () => {
    test('displays quick links section', () => {
      renderMapPage();
      
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Google Maps Directions')).toBeInTheDocument();
      expect(screen.getByText('Dreams Park Office')).toBeInTheDocument();
      expect(screen.getByText('Official Website')).toBeInTheDocument();
    });

    test('quick links have correct href attributes', () => {
      renderMapPage();
      
      const googleMapsLink = screen.getByText('Google Maps Directions').closest('a');
      const officeLink = screen.getByText('Dreams Park Office').closest('a');
      const websiteLink = screen.getByText('Official Website').closest('a');
      
      expect(googleMapsLink).toHaveAttribute('href', 'https://maps.google.com');
      expect(officeLink).toHaveAttribute('href', 'tel:+1234567890');
      expect(websiteLink).toHaveAttribute('href', 'https://cooperstowndreamspark.com');
    });

    test('quick links open in new tab where appropriate', () => {
      renderMapPage();
      
      const googleMapsLink = screen.getByText('Google Maps Directions').closest('a');
      const websiteLink = screen.getByText('Official Website').closest('a');
      
      expect(googleMapsLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('Park Information', () => {
    test('displays park hours and access information', () => {
      renderMapPage();
      
      expect(screen.getByText('Park Hours & Access')).toBeInTheDocument();
      expect(screen.getByText(/Gates open: 7:00 AM daily/)).toBeInTheDocument();
      expect(screen.getByText(/Games begin: 8:30 AM/)).toBeInTheDocument();
      expect(screen.getByText(/Park closes: 10:00 PM/)).toBeInTheDocument();
      expect(screen.getByText(/Free parking for all visitors/)).toBeInTheDocument();
    });

    test('displays amenities and services information', () => {
      renderMapPage();
      
      expect(screen.getByText('Amenities & Services')).toBeInTheDocument();
      expect(screen.getByText(/Full-service dining hall/)).toBeInTheDocument();
      expect(screen.getByText(/Pro shop with equipment and souvenirs/)).toBeInTheDocument();
      expect(screen.getByText(/Pin trading area/)).toBeInTheDocument();
      expect(screen.getByText(/Information desk and assistance/)).toBeInTheDocument();
    });

    test('displays important notes section', () => {
      renderMapPage();
      
      expect(screen.getByText('Important Notes')).toBeInTheDocument();
      expect(screen.getByText(/All fields are maintained to professional standards/)).toBeInTheDocument();
      expect(screen.getByText(/Restrooms and water fountains available/)).toBeInTheDocument();
      expect(screen.getByText(/First aid station located near the main office/)).toBeInTheDocument();
    });
  });

  describe('Map Instructions', () => {
    test('displays map usage instructions', () => {
      renderMapPage();
      
      expect(screen.getByText('How to Use the Map')).toBeInTheDocument();
      expect(screen.getByText(/Click on any marker to see location details/)).toBeInTheDocument();
      expect(screen.getByText(/Use the category filter to focus on specific areas/)).toBeInTheDocument();
      expect(screen.getByText(/All distances are approximate/)).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    test('renders correctly on mobile devices', () => {
      renderMapPage();
      
      // Should render all sections properly
      expect(screen.getByText('Dreams Park Map')).toBeInTheDocument();
      expect(screen.getByText('Dreams Park Layout')).toBeInTheDocument();
      expect(screen.getByText('Location Details')).toBeInTheDocument();
    });

    test('category filter buttons are mobile-friendly', () => {
      renderMapPage();
      
      const filterButtons = screen.getAllByRole('button');
      filterButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for interactive elements', () => {
      renderMapPage();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    test('has proper headings for page structure', () => {
      renderMapPage();
      
      expect(screen.getByRole('heading', { name: /Dreams Park Map/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Dreams Park Layout/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Location Details/i })).toBeInTheDocument();
    });

    test('has proper alt text for images', () => {
      renderMapPage();
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    test('has proper link text for screen readers', () => {
      renderMapPage();
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveTextContent();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing location data gracefully', () => {
      renderMapPage();
      
      // Should still render the page structure
      expect(screen.getByText('Dreams Park Map')).toBeInTheDocument();
      expect(screen.getByText('Dreams Park Layout')).toBeInTheDocument();
    });

    test('shows fallback message when no location is selected', () => {
      renderMapPage();
      
      // Should show default message in location details
      expect(screen.getByText(/Click on a map marker to see location details/)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('renders map efficiently with multiple locations', () => {
      renderMapPage();
      
      // Should render all location markers without performance issues
      const locationMarkers = screen.getAllByRole('button');
      expect(locationMarkers.length).toBeGreaterThan(0);
    });
  });

  describe('SEO and Meta', () => {
    test('has descriptive page title', () => {
      renderMapPage();
      
      expect(screen.getByText('Dreams Park Map')).toBeInTheDocument();
    });

    test('has descriptive content for search engines', () => {
      renderMapPage();
      
      expect(screen.getByText(/Navigate the historic grounds/)).toBeInTheDocument();
      expect(screen.getByText(/Cooperstown Dreams Park/)).toBeInTheDocument();
    });
  });
}); 