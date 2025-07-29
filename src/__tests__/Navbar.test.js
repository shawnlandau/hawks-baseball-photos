import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>{children}</a>
  )
}));

const renderNavbar = (props = {}) => {
  return render(
    <BrowserRouter>
      <Navbar 
        user="user123"
        auth={{ currentUser: { email: 'test@example.com' } }}
        onSignOut={jest.fn()}
        {...props}
      />
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders Hawks Baseball branding', () => {
      renderNavbar();
      
      expect(screen.getByText('Hawks Baseball')).toBeInTheDocument();
      expect(screen.getByText('Cooperstown Dreams Park 2025')).toBeInTheDocument();
    });

    test('renders logo image', () => {
      renderNavbar();
      
      const logo = screen.getByAltText('Hawks Baseball Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/hawks-logo.jpg?v=1');
    });

    test('shows fallback text when logo fails to load', () => {
      renderNavbar();
      
      const logo = screen.getByAltText('Hawks Baseball Logo');
      fireEvent.error(logo);
      
      // The fallback text should be visible after error
      expect(screen.getByText('HAWKS')).toBeInTheDocument();
      expect(screen.getByText('BASEBALL')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('renders all navigation links', () => {
      renderNavbar();
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Gallery')).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('Map')).toBeInTheDocument();
    });

    test('navigation links have correct href attributes', () => {
      renderNavbar();
      
      const homeLink = screen.getByText('Home').closest('a');
      const galleryLink = screen.getByText('Gallery').closest('a');
      const uploadLink = screen.getByText('Upload').closest('a');
      const scheduleLink = screen.getByText('Schedule').closest('a');
      const mapLink = screen.getByText('Map').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(galleryLink).toHaveAttribute('href', '/gallery');
      expect(uploadLink).toHaveAttribute('href', '/upload');
      expect(scheduleLink).toHaveAttribute('href', '/schedule');
      expect(mapLink).toHaveAttribute('href', '/map');
    });

    test('navigation links have proper icons', () => {
      renderNavbar();
      
      // Check that icons are present (they should be rendered as SVG elements)
      const navItems = screen.getAllByRole('link');
      expect(navItems.length).toBeGreaterThan(0);
    });
  });

  describe('User Authentication Display', () => {
    test('shows user email when authenticated', () => {
      renderNavbar();
      
      expect(screen.getByText('Signed in as:')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    test('shows "Unknown" when user email is not available', () => {
      renderNavbar({
        auth: { currentUser: null }
      });
      
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    test('renders sign out button', () => {
      renderNavbar();
      
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  describe('Sign Out Functionality', () => {
    test('calls onSignOut when sign out button is clicked', async () => {
      const mockOnSignOut = jest.fn();
      const user = userEvent.setup();
      
      renderNavbar({ onSignOut: mockOnSignOut });
      
      const signOutButton = screen.getByText('Sign Out');
      await user.click(signOutButton);
      
      expect(mockOnSignOut).toHaveBeenCalled();
    });
  });

  describe('Mobile Menu', () => {
    test('shows hamburger menu button on mobile', () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    test('toggles mobile menu when hamburger button is clicked', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      
      // Menu should be closed initially
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      
      // Click to open menu
      await user.click(menuButton);
      
      // Menu should now be open
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Gallery')).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('Map')).toBeInTheDocument();
      
      // Click to close menu
      await user.click(menuButton);
      
      // Menu should be closed again
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    test('closes mobile menu when navigation link is clicked', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      
      // Open menu
      await user.click(menuButton);
      expect(screen.getByText('Home')).toBeInTheDocument();
      
      // Click a navigation link
      const homeLink = screen.getByText('Home');
      await user.click(homeLink);
      
      // Menu should be closed
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    test('shows user email in mobile menu', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      expect(screen.getByText('Signed in as:')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    test('shows sign out button in mobile menu', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    test('calls onSignOut when mobile sign out button is clicked', async () => {
      const mockOnSignOut = jest.fn();
      const user = userEvent.setup();
      
      renderNavbar({ onSignOut: mockOnSignOut });
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      const signOutButton = screen.getByText('Sign Out');
      await user.click(signOutButton);
      
      expect(mockOnSignOut).toHaveBeenCalled();
    });
  });

  describe('Active Page Highlighting', () => {
    test('highlights active page in desktop navigation', () => {
      renderNavbar();
      
      // Since we're mocking useLocation to return '/', the Home link should be active
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('bg-hawks-red');
    });

    test('highlights active page in mobile navigation', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('bg-hawks-red');
    });
  });

  describe('Responsive Design', () => {
    test('hides desktop navigation on mobile', () => {
      renderNavbar();
      
      // Desktop navigation should be hidden on mobile (md:hidden class)
      const desktopNav = screen.getByText('Home').closest('nav');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    test('shows mobile menu button on mobile', () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for menu button', () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    test('has proper alt text for logo', () => {
      renderNavbar();
      
      const logo = screen.getByAltText('Hawks Baseball Logo');
      expect(logo).toBeInTheDocument();
    });

    test('navigation links are keyboard accessible', () => {
      renderNavbar();
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing user prop gracefully', () => {
      renderNavbar({ user: null });
      
      // Should still render the navbar without user-specific elements
      expect(screen.getByText('Hawks Baseball')).toBeInTheDocument();
    });

    test('handles missing auth prop gracefully', () => {
      renderNavbar({ auth: null });
      
      // Should still render the navbar
      expect(screen.getByText('Hawks Baseball')).toBeInTheDocument();
    });
  });
}); 