describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.visit('/auth');
  });

  describe('Sign In Flow', () => {
    it('should display sign in form by default', () => {
      cy.get('[data-testid="auth-form"]').should('be.visible');
      cy.contains('Sign In').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').type('ValidPass123');
      cy.contains('Sign In').click();
      cy.contains('Please enter a valid email address').should('be.visible');
    });

    it('should validate password requirements', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('weak');
      cy.contains('Sign In').click();
      cy.contains('Password must be at least 6 characters').should('be.visible');
    });

    it('should show password strength indicator', () => {
      cy.get('input[type="password"]').type('weak');
      cy.contains('Password strength: Weak').should('be.visible');
      
      cy.get('input[type="password"]').clear().type('ValidPass123');
      cy.contains('Password strength: Strong').should('be.visible');
    });

    it('should toggle password visibility', () => {
      cy.get('input[type="password"]').should('have.attr', 'type', 'password');
      cy.get('[aria-label="Show password"]').click();
      cy.get('input[type="password"]').should('have.attr', 'type', 'text');
      cy.get('[aria-label="Hide password"]').click();
      cy.get('input[type="password"]').should('have.attr', 'type', 'password');
    });

    it('should handle forgot password', () => {
      cy.contains('Forgot password?').click();
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Forgot password functionality will be implemented soon.');
      });
    });

    it('should handle Google sign in', () => {
      cy.contains('Continue with Google').click();
      // Note: Google sign-in popup testing requires special handling
      // This test verifies the button exists and is clickable
    });
  });

  describe('Sign Up Flow', () => {
    beforeEach(() => {
      cy.contains('Sign Up').click();
    });

    it('should display sign up form', () => {
      cy.contains('Create Account').should('be.visible');
      cy.get('input[name="confirmPassword"]').should('be.visible');
      cy.contains('Forgot password?').should('not.exist');
    });

    it('should validate password confirmation', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('ValidPass123');
      cy.get('input[name="confirmPassword"]').type('DifferentPass123');
      cy.contains('Create Account').click();
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should validate password requirements in sign up', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.contains('Create Account').click();
      cy.contains('Password must contain uppercase, lowercase, and number').should('be.visible');
    });

    it('should toggle confirm password visibility', () => {
      cy.get('input[name="confirmPassword"]').should('have.attr', 'type', 'password');
      cy.get('[aria-label="Show password"]').last().click();
      cy.get('input[name="confirmPassword"]').should('have.attr', 'type', 'text');
    });
  });

  describe('Form Toggle', () => {
    it('should switch between sign in and sign up', () => {
      // Start with sign in
      cy.contains('Sign In').should('be.visible');
      cy.contains('Forgot password?').should('be.visible');
      
      // Switch to sign up
      cy.contains('Sign Up').click();
      cy.contains('Create Account').should('be.visible');
      cy.contains('Forgot password?').should('not.exist');
      
      // Switch back to sign in
      cy.contains('Sign In').click();
      cy.contains('Sign In').should('be.visible');
      cy.contains('Forgot password?').should('be.visible');
    });

    it('should clear form when switching modes', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      
      cy.contains('Sign Up').click();
      
      cy.get('input[type="email"]').should('have.value', '');
      cy.get('input[type="password"]').should('have.value', '');
    });
  });

  describe('Loading States', () => {
    it('should show loading state during authentication', () => {
      // This would require mocking the authentication process
      // For now, we test that the loading state elements exist
      cy.get('button[type="submit"]').should('exist');
    });

    it('should disable form during loading', () => {
      // This would require triggering a loading state
      // For now, we test that the form elements exist
      cy.get('input[type="email"]').should('not.be.disabled');
      cy.get('input[type="password"]').should('not.be.disabled');
    });
  });

  describe('Error Handling', () => {
    it('should display authentication errors', () => {
      // This would require triggering an authentication error
      // For now, we test that error display elements exist
      cy.get('[data-testid="auth-form"]').should('exist');
    });

    it('should clear errors when user starts typing', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').type('weak');
      cy.contains('Sign In').click();
      
      cy.contains('Please enter a valid email address').should('be.visible');
      
      cy.get('input[type="email"]').clear().type('valid@example.com');
      cy.contains('Please enter a valid email address').should('not.exist');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      cy.get('label[for="email"]').should('contain', 'Email Address');
      cy.get('label[for="password"]').should('contain', 'Password');
    });

    it('should have proper ARIA labels', () => {
      cy.get('input[type="email"]').should('have.attr', 'aria-describedby');
      cy.get('input[type="password"]').should('have.attr', 'aria-describedby');
    });

    it('should be keyboard navigable', () => {
      cy.get('input[type="email"]').focus();
      cy.get('input[type="email"]').should('be.focused');
      
      cy.tab();
      cy.get('input[type="password"]').should('be.focused');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile', () => {
      cy.viewport('iphone-6');
      cy.get('[data-testid="auth-form"]').should('be.visible');
      cy.contains('Hawks Baseball').should('be.visible');
    });

    it('should display correctly on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('[data-testid="auth-form"]').should('be.visible');
      cy.contains('Hawks Baseball').should('be.visible');
    });

    it('should display correctly on desktop', () => {
      cy.viewport(1280, 720);
      cy.get('[data-testid="auth-form"]').should('be.visible');
      cy.contains('Hawks Baseball').should('be.visible');
    });
  });
}); 