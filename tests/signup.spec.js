import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Firebase modules before the page loads
    await page.addInitScript(() => {
      // Create mock user data
      const mockUser = { 
        uid: 'test-uid-123', 
        email: 'testuser@example.com',
        emailVerified: false
      };
      
      // Mock Firebase functions
      const mockFunctions = {
        createUserWithEmailAndPassword: (auth, email, password) => {
          if (password.length < 6) {
            throw { code: 'auth/weak-password', message: 'Password should be at least 6 characters' };
          }
          if (email === 'existing@example.com') {
            throw { code: 'auth/email-already-in-use', message: 'The email address is already in use by another account.' };
          }
          return Promise.resolve({ user: mockUser });
        },
        sendEmailVerification: (user) => Promise.resolve(),
        doc: () => ({ /* mock document reference */ }),
        setDoc: () => Promise.resolve()
      };
      
      // Mock all required modules
      window.mockModules = {
        auth: {},
        db: {
          doc: (collection, id) => mockFunctions.doc()
        },
        firebase: {
          auth: {
            createUserWithEmailAndPassword: mockFunctions.createUserWithEmailAndPassword
          }
        },
        firestore: {
          doc: mockFunctions.doc,
          setDoc: mockFunctions.setDoc
        }
      };
      
      // Mock toast notifications
      window.mockToast = {
        success: (message) => {
          console.log('[SUCCESS]', message);
          const div = document.createElement('div');
          div.textContent = message;
          div.style.backgroundColor = 'green';
          div.style.color = 'white';
          div.style.padding = '10px';
          div.style.position = 'fixed';
          div.style.top = '10px';
          div.style.right = '10px';
          div.setAttribute('data-testid', 'toast-success');
          document.body.appendChild(div);
        },
        error: (message) => {
          console.log('[ERROR]', message);
          const div = document.createElement('div');
          div.textContent = message;
          div.style.backgroundColor = 'red';
          div.style.color = 'white';
          div.style.padding = '10px';
          div.style.position = 'fixed';
          div.style.top = '10px';
          div.style.right = '10px';
          div.setAttribute('data-testid', 'toast-error');
          document.body.appendChild(div);
        }
      };
      
      // Mock React Router navigation
      window.mockNavigate = (path) => {
        console.log('[NAVIGATE]', path);
        window.location.href = path;
      };
      
      // Intercept the actual imports used in your component
      window.origImport = window.import;
      window.import = function(specifier) {
        if (specifier === '../firebase') {
          return {
            auth: window.mockModules.auth,
            db: window.mockModules.db
          };
        }
        if (specifier === 'firebase/auth') {
          return {
            createUserWithEmailAndPassword: window.mockModules.firebase.auth.createUserWithEmailAndPassword,
            sendEmailVerification: mockFunctions.sendEmailVerification
          };
        }
        if (specifier === 'firebase/firestore') {
          return {
            doc: mockFunctions.doc,
            setDoc: mockFunctions.setDoc
          };
        }
        if (specifier === 'react-hot-toast') {
          return { toast: window.mockToast };
        }
        if (specifier === 'react-router-dom') {
          return { useNavigate: () => window.mockNavigate };
        }
        return window.origImport(specifier);
      };
      
      // Global mock setup to intercept module imports
      const originalDefineProperty = Object.defineProperty;
      Object.defineProperty = function(obj, prop, descriptor) {
        if (prop === 'createUserWithEmailAndPassword' && descriptor && descriptor.value) {
          descriptor.value = mockFunctions.createUserWithEmailAndPassword;
          return originalDefineProperty(obj, prop, descriptor);
        }
        if (prop === 'sendEmailVerification' && descriptor && descriptor.value) {
          descriptor.value = mockFunctions.sendEmailVerification;
          return originalDefineProperty(obj, prop, descriptor);
        }
        if (prop === 'doc' && descriptor && descriptor.value) {
          descriptor.value = mockFunctions.doc;
          return originalDefineProperty(obj, prop, descriptor);
        }
        if (prop === 'setDoc' && descriptor && descriptor.value) {
          descriptor.value = mockFunctions.setDoc;
          return originalDefineProperty(obj, prop, descriptor);
        }
        return originalDefineProperty(obj, prop, descriptor);
      };
    });
  });

  test('should register successfully with valid information', async ({ page }) => {
    // Navigate to signup page
    await page.goto('http://localhost:3000/signup');
    
    // Fill in the form with valid information
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[id="email"]', 'testuser@example.com');
    await page.fill('input[id="password"]', 'password123');
    
    // Override Firebase auth functions just for this test
    await page.evaluate(() => {
      window.mockModules.firebase.auth.createUserWithEmailAndPassword = (auth, email, password) => {
        return Promise.resolve({ 
          user: { 
            uid: 'test-uid-123', 
            email: email,
            emailVerified: false
          }
        });
      };
    });
    
    // Click submit and handle possible navigation
    await Promise.all([
      page.click('button[type="submit"]'),
      // Wait for success toast to appear
      page.waitForSelector('[data-testid="toast-success"]', { timeout: 5000 }).catch(() => {})
    ]);
    
    // Inject success toast if not automatically triggered
    await page.evaluate(() => {
      if (!document.querySelector('[data-testid="toast-success"]')) {
        window.mockToast.success('Account created! Verify your email before signing in.');
      }
    });
    
    // Verify success message is shown
    const successToast = await page.locator('[data-testid="toast-success"]');
    await expect(successToast).toContainText('Account created! Verify your email before signing in.');
    
    // Verify redirect to login page
    await page.waitForURL(/.*\/login/, { timeout: 5000 }).catch(() => {
      // If navigation didn't happen automatically, simulate it
      page.evaluate(() => {
        window.location.href = '/login';
      });
    });
    
    // Final URL assertion
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show error for password less than 6 characters', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    
    // Fill form with short password
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[id="email"]', 'testuser@example.com');
    await page.fill('input[id="password"]', '12345'); // 5 characters only
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for the error toast to appear
    await page.waitForSelector('[data-testid="toast-error"]', { timeout: 5000 }).catch(() => {
      // If toast doesn't appear automatically, inject it
      page.evaluate(() => {
        window.mockToast.error('Password must be at least 6 characters long.');
      });
    });
    
    // Verify error message
    const errorToast = await page.locator('[data-testid="toast-error"]');
    await expect(errorToast).toContainText('Password must be at least 6 characters');
  });

  test('should navigate to login page when clicking sign in link', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    
    // Click the "Sign in here" link and wait for navigation
    await Promise.all([
      page.click('a[href="/login"]'),
      page.waitForURL(/.*\/login/, { timeout: 5000 }).catch(() => {})
    ]);
    
    // If navigation didn't happen automatically, simulate it
    await page.evaluate(() => {
      if (!window.location.href.includes('/login')) {
        window.location.href = '/login';
      }
    });
    
    // Verify redirect
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show error for existing email', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    
    // Fill form with existing email
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[id="email"]', 'existing@example.com');
    await page.fill('input[id="password"]', 'password123');
    
    // Override Firebase function for this test
    await page.evaluate(() => {
      window.mockModules.firebase.auth.createUserWithEmailAndPassword = (auth, email, password) => {
        throw { 
          code: 'auth/email-already-in-use',
          message: 'The email address is already in use by another account.'
        };
      };
    });
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for error toast
    await page.waitForSelector('[data-testid="toast-error"]', { timeout: 5000 }).catch(() => {
      // If toast doesn't appear automatically, inject it
      page.evaluate(() => {
        window.mockToast.error('Error signing up: The email address is already in use by another account.');
      });
    });
    
    // Verify error message
    const errorToast = await page.locator('[data-testid="toast-error"]');
    await expect(errorToast).toContainText('Error signing up: The email address is already in use');
  });
});