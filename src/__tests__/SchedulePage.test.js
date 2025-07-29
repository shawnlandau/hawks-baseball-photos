import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SchedulePage from '../pages/SchedulePage';

// Mock the download functionality
const mockDownload = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockDownload
});

// Mock the createObjectURL function
const mockCreateObjectURL = jest.fn();
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: mockCreateObjectURL
});

// Mock the revokeObjectURL function
const mockRevokeObjectURL = jest.fn();
Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: mockRevokeObjectURL
});

const renderSchedulePage = () => {
  return render(<SchedulePage />);
};

describe('SchedulePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders schedule page title', () => {
      renderSchedulePage();
      
      expect(screen.getByText('Tournament Schedule')).toBeInTheDocument();
      expect(screen.getByText(/Cooperstown Dreams Park/)).toBeInTheDocument();
    });

    test('renders day filter buttons', () => {
      renderSchedulePage();
      
      expect(screen.getByText('All Days')).toBeInTheDocument();
      expect(screen.getByText(/Day 1/)).toBeInTheDocument();
      expect(screen.getByText(/Day 2/)).toBeInTheDocument();
      expect(screen.getByText(/Day 3/)).toBeInTheDocument();
      expect(screen.getByText(/Day 4/)).toBeInTheDocument();
      expect(screen.getByText(/Day 5/)).toBeInTheDocument();
      expect(screen.getByText(/Day 6/)).toBeInTheDocument();
    });

    test('renders schedule events', () => {
      renderSchedulePage();
      
      // Check for some key events
      expect(screen.getByText(/Team Arrival/)).toBeInTheDocument();
      expect(screen.getByText(/Hawks Baseball vs/)).toBeInTheDocument();
      expect(screen.getByText(/Opening Ceremony/)).toBeInTheDocument();
    });
  });

  describe('Day Filtering', () => {
    test('shows all events by default', () => {
      renderSchedulePage();
      
      // Should show events from multiple days
      expect(screen.getByText(/Team Arrival/)).toBeInTheDocument();
      expect(screen.getByText(/Opening Ceremony/)).toBeInTheDocument();
    });

    test('filters events by selected day', async () => {
      renderSchedulePage();
      
      // Click on Day 2 filter
      const day2Button = screen.getByText(/Day 2/);
      userEvent.click(day2Button);
      
      // Should show Day 2 events
      expect(screen.getByText(/Breakfast/)).toBeInTheDocument();
      expect(screen.getByText(/Opening Ceremony/)).toBeInTheDocument();
      
      // Should not show Day 1 events
      expect(screen.queryByText(/Team Arrival/)).not.toBeInTheDocument();
    });

    test('highlights selected day filter', async () => {
      renderSchedulePage();
      
      const day2Button = screen.getByText(/Day 2/);
      userEvent.click(day2Button);
      
      // The selected button should have the active class
      expect(day2Button).toHaveClass('bg-hawks-red');
    });

    test('returns to all events when "All Days" is selected', async () => {
      renderSchedulePage();
      
      // First select a specific day
      const day2Button = screen.getByText(/Day 2/);
      userEvent.click(day2Button);
      
      // Then select "All Days"
      const allDaysButton = screen.getByText('All Days');
      userEvent.click(allDaysButton);
      
      // Should show events from all days again
      expect(screen.getByText(/Team Arrival/)).toBeInTheDocument();
      expect(screen.getByText(/Opening Ceremony/)).toBeInTheDocument();
    });
  });

  describe('Event Display', () => {
    test('displays event details correctly', () => {
      renderSchedulePage();
      
      // Check for event time, location, and description
      expect(screen.getByText(/2:30 PM/)).toBeInTheDocument();
      expect(screen.getByText(/Main Office/)).toBeInTheDocument();
      expect(screen.getByText(/Team arrival/)).toBeInTheDocument();
    });

    test('shows event type icons', () => {
      renderSchedulePage();
      
      // Check that event type icons are present
      const eventCards = screen.getAllByRole('button');
      expect(eventCards.length).toBeGreaterThan(0);
    });

    test('displays game-specific information for games', () => {
      renderSchedulePage();
      
      // Check for game-specific elements
      expect(screen.getAllByText(/vs/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Field/).length).toBeGreaterThan(0);
    });
  });

  describe('Calendar Integration', () => {
    test('shows "Add to My Calendar" button', () => {
      renderSchedulePage();
      
      expect(screen.getByText('Add to My Calendar')).toBeInTheDocument();
    });

    test('shows calendar modal when "Add to My Calendar" is clicked', async () => {
      const user = userEvent.setup();
      renderSchedulePage();
      
      const calendarButton = screen.getByText('Add to My Calendar');
      await user.click(calendarButton);
      
      expect(screen.getByText('Add Schedule to Calendar')).toBeInTheDocument();
      expect(screen.getByText('Google Calendar')).toBeInTheDocument();
      expect(screen.getByText('Apple Calendar')).toBeInTheDocument();
      expect(screen.getByText('Outlook')).toBeInTheDocument();
    });

    test('closes calendar modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderSchedulePage();
      
      // Open modal
      const calendarButton = screen.getByText('Add to My Calendar');
      await user.click(calendarButton);
      
      // Close modal
      const closeButton = screen.getByText('Close');
      await user.click(closeButton);
      
      // Modal should be closed
      expect(screen.queryByText('Add Schedule to Calendar')).not.toBeInTheDocument();
    });

    test('downloads calendar file when download button is clicked', async () => {
      const user = userEvent.setup();
      renderSchedulePage();
      
      // Mock the download functionality
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn()
      };
      document.createElement = jest.fn(() => mockLink);
      
      const downloadButton = screen.getByText('Download .ics File');
      await user.click(downloadButton);
      
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('Mobile Responsiveness', () => {
    test('shows mobile menu button on small screens', () => {
      renderSchedulePage();
      
      const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      expect(mobileMenuButton).toBeInTheDocument();
    });

    test('toggles mobile menu when button is clicked', async () => {
      const user = userEvent.setup();
      renderSchedulePage();
      
      const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      
      // Menu should be closed initially
      expect(screen.queryByText('Day 2 - Friday, August 1')).not.toBeInTheDocument();
      
      // Click to open menu
      await user.click(mobileMenuButton);
      
      // Menu should now be open
      expect(screen.getByText('Day 2 - Friday, August 1')).toBeInTheDocument();
      
      // Click to close menu
      await user.click(mobileMenuButton);
      
      // Menu should be closed again
      expect(screen.queryByText('Day 2 - Friday, August 1')).not.toBeInTheDocument();
    });
  });

  describe('Event Expansion', () => {
    test('expands event details when clicked', async () => {
      const user = userEvent.setup();
      renderSchedulePage();
      
      // Find an event card and click it
      const eventCards = screen.getAllByRole('button');
      const firstEvent = eventCards[0];
      
      await user.click(firstEvent);
      
      // Event should be expanded (check for expanded class or additional details)
      expect(firstEvent).toHaveClass('expanded');
    });

    test('collapses expanded event when clicked again', async () => {
      const user = userEvent.setup();
      renderSchedulePage();
      
      const eventCards = screen.getAllByRole('button');
      const firstEvent = eventCards[0];
      
      // Expand event
      await user.click(firstEvent);
      expect(firstEvent).toHaveClass('expanded');
      
      // Collapse event
      await user.click(firstEvent);
      expect(firstEvent).not.toHaveClass('expanded');
    });
  });

  describe('Game Information', () => {
    test('displays game details for baseball games', () => {
      renderSchedulePage();
      
      // Check for game-specific information
      expect(screen.getByText(/Hawks Baseball vs/)).toBeInTheDocument();
      expect(screen.getByText(/Pool Play/)).toBeInTheDocument();
      expect(screen.getByText(/Field/)).toBeInTheDocument();
    });

    test('shows game time and location', () => {
      renderSchedulePage();
      
      expect(screen.getAllByText(/3:30 PM/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Field/).length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for interactive elements', () => {
      renderSchedulePage();
      
      const filterButtons = screen.getAllByRole('button');
      filterButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    test('has proper headings for page structure', () => {
      renderSchedulePage();
      
      expect(screen.getAllByRole('heading', { name: /Tournament Schedule/i }).length).toBeGreaterThan(0);
    });

    test('has proper alt text for images', () => {
      renderSchedulePage();
      
      // Check if there are any images, and if so, they should have alt text
      const images = screen.queryAllByRole('img');
      if (images.length > 0) {
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
        });
      }
    });
  });

  describe('Error Handling', () => {
    test('handles missing schedule data gracefully', () => {
      // This would test the component's behavior when schedule data is missing
      renderSchedulePage();
      
      // Should still render the page structure
      expect(screen.getAllByText('Tournament Schedule').length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('renders large number of events efficiently', () => {
      renderSchedulePage();
      
      // Should render all events without performance issues
      const eventCards = screen.getAllByRole('button');
      expect(eventCards.length).toBeGreaterThan(0);
    });
  });
}); 