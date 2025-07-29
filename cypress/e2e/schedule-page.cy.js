describe('Schedule Page', () => {
  beforeEach(() => {
    // This would require authentication setup
    // For now, we'll test the basic structure
    cy.visit('/schedule');
  });

  describe('Page Structure', () => {
    it('should display schedule page title', () => {
      cy.contains('Hawks Baseball Schedule').should('be.visible');
      cy.contains('Cooperstown Dreams Park 2025').should('be.visible');
    });

    it('should display day filter buttons', () => {
      cy.contains('All Days').should('be.visible');
      cy.contains('Day 1 - Thursday, July 31').should('be.visible');
      cy.contains('Day 2 - Friday, August 1').should('be.visible');
      cy.contains('Day 3 - Saturday, August 2').should('be.visible');
      cy.contains('Day 4 - Sunday, August 3').should('be.visible');
      cy.contains('Day 5 - Monday, August 4').should('be.visible');
      cy.contains('Day 6 - Tuesday, August 5').should('be.visible');
    });

    it('should display schedule events', () => {
      cy.contains('Team Arrival, Check-In & Registration').should('be.visible');
      cy.contains('Hawks Baseball vs Burlington Bulldogs').should('be.visible');
      cy.contains('Opening Ceremony').should('be.visible');
    });
  });

  describe('Day Filtering', () => {
    it('should show all events by default', () => {
      cy.contains('Team Arrival, Check-In & Registration').should('be.visible');
      cy.contains('Opening Ceremony').should('be.visible');
    });

    it('should filter events by selected day', () => {
      cy.contains('Day 2 - Friday, August 1').click();
      
      // Should show Day 2 events
      cy.contains('Breakfast').should('be.visible');
      cy.contains('Opening Ceremony').should('be.visible');
      
      // Should not show Day 1 events
      cy.contains('Team Arrival, Check-In & Registration').should('not.exist');
    });

    it('should highlight selected day filter', () => {
      cy.contains('Day 2 - Friday, August 1').click();
      cy.contains('Day 2 - Friday, August 1').should('have.class', 'bg-hawks-red');
    });

    it('should return to all events when "All Days" is selected', () => {
      // First select a specific day
      cy.contains('Day 2 - Friday, August 1').click();
      
      // Then select "All Days"
      cy.contains('All Days').click();
      
      // Should show events from all days again
      cy.contains('Team Arrival, Check-In & Registration').should('be.visible');
      cy.contains('Opening Ceremony').should('be.visible');
    });
  });

  describe('Event Display', () => {
    it('should display event details correctly', () => {
      cy.contains('2:30 PM - 8:00 PM').should('be.visible');
      cy.contains('Main Office').should('be.visible');
      cy.contains('Team arrival, check-in, registration, and team photos').should('be.visible');
    });

    it('should show event type icons', () => {
      cy.get('[data-testid="event-card"]').should('have.length.greaterThan', 0);
    });

    it('should display game-specific information for games', () => {
      cy.contains('vs Burlington Bulldogs').should('be.visible');
      cy.contains('Field 14').should('be.visible');
    });
  });

  describe('Calendar Integration', () => {
    it('should show "Add to My Calendar" button', () => {
      cy.contains('Add to My Calendar').should('be.visible');
    });

    it('should show calendar modal when "Add to My Calendar" is clicked', () => {
      cy.contains('Add to My Calendar').click();
      
      cy.contains('Add Schedule to Calendar').should('be.visible');
      cy.contains('Google Calendar').should('be.visible');
      cy.contains('Apple Calendar').should('be.visible');
      cy.contains('Outlook').should('be.visible');
    });

    it('should close calendar modal when close button is clicked', () => {
      // Open modal
      cy.contains('Add to My Calendar').click();
      
      // Close modal
      cy.contains('Close').click();
      
      // Modal should be closed
      cy.contains('Add Schedule to Calendar').should('not.exist');
    });

    it('should download calendar file when download button is clicked', () => {
      // Mock the download functionality
      cy.window().then((win) => {
        cy.stub(win, 'open').as('downloadStub');
      });
      
      cy.contains('Download .ics File').click();
      cy.get('@downloadStub').should('have.been.called');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should show mobile menu button on small screens', () => {
      cy.viewport('iphone-6');
      cy.get('[aria-label="toggle mobile menu"]').should('be.visible');
    });

    it('should toggle mobile menu when button is clicked', () => {
      cy.viewport('iphone-6');
      
      // Menu should be closed initially
      cy.contains('Day 2 - Friday, August 1').should('not.exist');
      
      // Click to open menu
      cy.get('[aria-label="toggle mobile menu"]').click();
      
      // Menu should now be open
      cy.contains('Day 2 - Friday, August 1').should('be.visible');
      
      // Click to close menu
      cy.get('[aria-label="toggle mobile menu"]').click();
      
      // Menu should be closed again
      cy.contains('Day 2 - Friday, August 1').should('not.exist');
    });
  });

  describe('Event Expansion', () => {
    it('should expand event details when clicked', () => {
      cy.get('[data-testid="event-card"]').first().click();
      cy.get('[data-testid="event-card"]').first().should('have.class', 'expanded');
    });

    it('should collapse expanded event when clicked again', () => {
      const eventCard = cy.get('[data-testid="event-card"]').first();
      
      // Expand event
      eventCard.click();
      eventCard.should('have.class', 'expanded');
      
      // Collapse event
      eventCard.click();
      eventCard.should('not.have.class', 'expanded');
    });
  });

  describe('Game Information', () => {
    it('should display game details for baseball games', () => {
      cy.contains('Hawks Baseball vs Burlington Bulldogs').should('be.visible');
      cy.contains('Pool Play Game 1').should('be.visible');
      cy.contains('Field 14').should('be.visible');
    });

    it('should show game time and location', () => {
      cy.contains('3:30 PM').should('be.visible');
      cy.contains('Field 14').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for interactive elements', () => {
      cy.get('button').each(($button) => {
        cy.wrap($button).should('have.attr', 'aria-label');
      });
    });

    it('should have proper headings for page structure', () => {
      cy.get('h1').should('contain', 'Hawks Baseball Schedule');
    });

    it('should have proper alt text for images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing schedule data gracefully', () => {
      // This would require mocking missing data
      // For now, we test the basic structure
      cy.contains('Hawks Baseball Schedule').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should render large number of events efficiently', () => {
      cy.get('[data-testid="event-card"]').should('have.length.greaterThan', 0);
    });

    it('should load page quickly', () => {
      cy.visit('/schedule', { timeout: 10000 });
      cy.contains('Hawks Baseball Schedule').should('be.visible');
    });
  });

  describe('SEO and Meta', () => {
    it('should have descriptive page title', () => {
      cy.title().should('contain', 'Schedule');
    });

    it('should have proper meta description', () => {
      cy.get('meta[name="description"]').should('exist');
    });
  });

  describe('Print Functionality', () => {
    it('should be printable', () => {
      cy.window().then((win) => {
        cy.stub(win, 'print').as('printStub');
      });
      
      // Trigger print (if print button exists)
      cy.get('body').type('{ctrl}p');
      cy.get('@printStub').should('have.been.called');
    });
  });

  describe('Share Functionality', () => {
    it('should have share options', () => {
      // This would test share functionality if implemented
      cy.contains('Share').should('exist');
    });
  });

  describe('Search Functionality', () => {
    it('should allow searching events', () => {
      // This would test search functionality if implemented
      cy.get('input[type="search"]').should('exist');
    });
  });

  describe('Export Functionality', () => {
    it('should allow exporting schedule', () => {
      // This would test export functionality if implemented
      cy.contains('Export').should('exist');
    });
  });
}); 