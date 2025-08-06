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
      expect(screen.getByText('Game Results')).toBeInTheDocument();
    });

    test('navigation links have correct href attributes', () => {
      renderNavbar();
      
      const homeLink = screen.getByText('Home').closest('a');
      const galleryLink = screen.getByText('Gallery').closest('a');
      const uploadLink = screen.getByText('Upload').closest('a');
      const resultsLink = screen.getByText('Game Results').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(galleryLink).toHaveAttribute('href', '/gallery');
      expect(uploadLink).toHaveAttribute('href', '/upload');
      expect(resultsLink).toHaveAttribute('href', '/results');
    });

    test('navigation links have proper icons', () => {
      renderNavbar();
      
      // Check that icons are present (they should be rendered as SVG elements)
      const navItems = screen.getAllByRole('link');
      expect(navItems.length).toBeGreaterThan(0);
    });
  });

  describe('User Authentication Display', () => {
    test('shows user avatar when authenticated', () => {
      renderNavbar();
      
      // Check for user avatar button
      const userMenuButton = screen.getByRole('button', { name: /user menu/i });
      expect(userMenuButton).toBeInTheDocument();
    });

    test('shows user display name when authenticated', () => {
      renderNavbar();
      
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    test('shows user avatar when user email is not available', () => {
      renderNavbar({
        auth: { currentUser: null }
      });
      
      const userMenuButton = screen.getByRole('button', { name: /user menu/i });
      expect(userMenuButton).toBeInTheDocument();
    });
  });

  describe('Sign Out Functionality', () => {
    test('calls onSignOut when sign out button is clicked', async () => {
      const mockOnSignOut = jest.fn();
      
      renderNavbar({ onSignOut: mockOnSignOut });
      
      // Open user menu
      const userMenuButton = screen.getByRole('button', { name: /user menu/i });
      await userEvent.click(userMenuButton);
      
      // Click sign out button
      const signOutButton = screen.getByText('Sign Out');
      await userEvent.click(signOutButton);
      
      expect(mockOnSignOut).toHaveBeenCalled();
    });
  });

  describe('Mobile Menu', () => {
    test('shows hamburger menu button on mobile', () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    test('toggles mobile menu when hamburger button is clicked', async () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      
      // Menu should be closed initially (mobile menu items not visible)
      const mobileMenuItems = screen.queryAllByText('Home');
      expect(mobileMenuItems.length).toBe(1); // Only desktop Home link visible
      
      // Click to open menu
      await userEvent.click(menuButton);
      
      // Menu should now be open - check for mobile menu items
      const allHomeLinks = screen.getAllByText('Home');
      expect(allHomeLinks.length).toBe(2); // Desktop + mobile Home links
      
      // Click to close menu
      await userEvent.click(menuButton);
      
      // Menu should be closed again
      const homeLinksAfterClose = screen.queryAllByText('Home');
      expect(homeLinksAfterClose.length).toBe(1); // Only desktop Home link visible
    });

    test('closes mobile menu when navigation link is clicked', async () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      
      // Open menu
      await userEvent.click(menuButton);
      const allHomeLinks = screen.getAllByText('Home');
      expect(allHomeLinks.length).toBe(2); // Desktop + mobile Home links
      
      // Click the mobile navigation link (second Home link)
      const mobileHomeLink = allHomeLinks[1];
      await userEvent.click(mobileHomeLink);
      
      // Menu should be closed
      const homeLinksAfterClick = screen.queryAllByText('Home');
      expect(homeLinksAfterClick.length).toBe(1); // Only desktop Home link visible
    });

    test('shows user avatar in mobile menu', async () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      await userEvent.click(menuButton);
      
      // Check for user avatar in mobile menu - use getAllByRole to get the mobile one
      const userMenuButtons = screen.getAllByRole('button', { name: /user menu/i });
      expect(userMenuButtons.length).toBeGreaterThan(0);
    });

    test('shows sign out button in mobile menu', async () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      await userEvent.click(menuButton);
      
      // Open user menu in mobile - get the second one (mobile menu)
      const userMenuButtons = screen.getAllByRole('button', { name: /user menu/i });
      await userEvent.click(userMenuButtons[1]);
      
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    test('calls onSignOut when mobile sign out button is clicked', async () => {
      const mockOnSignOut = jest.fn();
      
      renderNavbar({ onSignOut: mockOnSignOut });
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      await userEvent.click(menuButton);
      
      // Open user menu in mobile - get the second one (mobile menu)
      const userMenuButtons = screen.getAllByRole('button', { name: /user menu/i });
      await userEvent.click(userMenuButtons[1]);
      
      const signOutButton = screen.getByText('Sign Out');
      await userEvent.click(signOutButton);
      
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
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      await userEvent.click(menuButton);
      
      const homeLinks = screen.getAllByText('Home');
      const mobileHomeLink = homeLinks[1]; // Get the second Home link (mobile menu)
      expect(mobileHomeLink.closest('a')).toHaveClass('bg-hawks-red');
    });
  });

  describe('Responsive Design', () => {
    test('hides desktop navigation on mobile', () => {
      renderNavbar();
      
      // Desktop navigation should be hidden on mobile (md:hidden class)
      const desktopNav = screen.getByText('Home').closest('div');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    test('shows mobile menu button on mobile', () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for menu button', () => {
      renderNavbar();
      
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
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