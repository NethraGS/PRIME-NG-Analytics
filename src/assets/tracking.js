(function () {
    const tracking = {
        dataLayer: [],
        lastTrackedUrl: window.location.href,
        previousPage: '',
        listenersInitialized: false,

        init() {
            if (!this.listenersInitialized) {
                this.setupEventListeners();
                this.trackPageView();
                this.trackNavigation();
                this.listenersInitialized = true;
            }
        },

        setupEventListeners() {
            if (this.listenersInitialized) return;

            // Intercept login API calls to start the session on successful login
            this.interceptFetchForLogin();

            document.addEventListener('click', (event) => {
                const target = event.target;
                const validTagTypes = ['button', 'a', 'select', 'textarea'];
                
                const isButton = target.tagName.toLowerCase() === 'button' || 
                                 target.closest('button');
                const isPrimeNGButton = target.classList.contains('p-button') || 
                                        target.closest('.p-button');
                const isIcon = target.classList.contains('pi') || 
                               target.closest('.pi');
                
                let elementType = target.tagName.toLowerCase();
                if (isPrimeNGButton) {
                    elementType = 'p-button';
                } else if (isIcon) {
                    elementType = 'icon';
                } else if (isButton) {
                    elementType = 'button';
                }
            
                let elementText = target.innerText || '';
                if (isPrimeNGButton && !elementText) {
                    const childSpan = target.querySelector('span') || target.closest('.p-button')?.querySelector('span');
                    elementText = childSpan ? childSpan.innerText.trim() : '';
                }
            
                if (isButton || isPrimeNGButton || isIcon || validTagTypes.includes(elementType)) {
                    const eventData = {
                        action: 'click',
                        elementId: target.id || target.closest('[id]')?.id || '',
                        elementClass: target.className || target.closest('[class]')?.className || '',
                        elementText: elementText || '',
                        elementType: elementType,
                        pageName: document.title,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        userId: this.getUserData().userId,
                        userRole: this.getUserData().userRole
                    };
                    this.trackEvent('click', eventData);
                }
            });

            document.addEventListener('submit', (event) => {
                const target = event.target;
                if (target && target.tagName.toLowerCase() === 'form') {
                    const eventData = {
                        formId: target.id || '',
                        formName: target.name || '',
                        pageName: document.title,
                        url: window.location.href,
                        userId: this.getUserData().userId
                    };
                    this.trackEvent('formSubmission', eventData);
                }
            });

            window.addEventListener('load', () => {
                this.setSessionStartTime();
                this.init();
                this.setupSessionEndTracking();
            });

            window.addEventListener('scroll', () => {
                const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
                if (scrollDepth >= 25 && scrollDepth < 50 && !this.scroll25) {
                    this.trackEvent('scroll', { depth: '25%', pageName: document.title, url: window.location.href, userId: this.getUserData().userId });
                    this.scroll25 = true;
                } else if (scrollDepth >= 50 && scrollDepth < 75 && !this.scroll50) {
                    this.trackEvent('scroll', { depth: '50%', pageName: document.title, url: window.location.href, userId: this.getUserData().userId });
                    this.scroll50 = true;
                } else if (scrollDepth >= 75 && scrollDepth < 100 && !this.scroll75) {
                    this.trackEvent('scroll', { depth: '75%', pageName: document.title, url: window.location.href, userId: this.getUserData().userId });
                    this.scroll75 = true;
                } else if (scrollDepth >= 100 && !this.scroll100) {
                    this.trackEvent('scroll', { depth: '100%', pageName: document.title, url: window.location.href, userId: this.getUserData().userId });
                    this.scroll100 = true;
                }
            });

            document.addEventListener('contextmenu', (event) => {
                const target = event.target;
                const isContextMenu = target.classList.contains('context-menu') || target.closest('.context-menu');

                if (isContextMenu) {
                    const eventData = {
                        elementId: target.id || '',
                        elementClass: target.className || '',
                        elementText: target.innerText ? target.innerText.trim() : '',
                        elementType: target.tagName.toLowerCase(),
                        pageName: document.title,
                        url: window.location.href,
                        userId: this.getUserData().userId
                    };
                    this.trackEvent('rightClick', eventData);
                }
            });

            this.listenersInitialized = true;
        },

        interceptFetchForLogin() {
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                // Ensure args[0] is a string before calling .includes()
                if (typeof args[0] === 'string' && args[0].includes('/api/login')) { // Replace with your actual login API endpoint
                    return originalFetch(...args)
                        .then(async response => {
                            if (response.ok) {
                                const data = await response.json();
                                if (data.message === "Login successful") {
                                    // Correctly refer to 'startSession' within the 'tracking' object
                                    tracking.startSession(data.userId, data.role); // Assuming 'tracking' is in the global scope
                                }
                            }
                            return response;
                        })
                        .catch(error => {
                            console.error('Error during login fetch interception:', error);
                            throw error; // Re-throw the error to allow further handling
                        });
                }
                return originalFetch(...args);
            };
        },
        

        startSession(userId, userRole) {
            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('userRole', userRole);
            this.setSessionStartTime();
            this.init();
            this.setupSessionEndTracking();
        },

        trackPageView() {
            const eventData = {
                url: window.location.href,
                title: document.title,
                userId: this.getUserData().userId
            };
            this.trackEvent('pageView', eventData);
        },

        trackNavigation() {
            window.addEventListener('popstate', () => {
                const eventData = {
                    url: window.location.href,
                    title: document.title,
                    userId: this.getUserData().userId
                };
                this.trackEvent('navigation', eventData);

                // Track the user journey (current and previous page)
                const userJourneyData = {
                    userId: this.getUserData().userId,
                    currentPage: window.location.href,
                    previousPage: this.lastTrackedUrl || '',
                    timestamp: new Date().toISOString(),
                };

                // Send user journey data to the backend
                this.sendUserJourneyToBackend(userJourneyData);
                this.lastTrackedUrl = window.location.href; // Update the lastTrackedUrl after sending data
            });
        },

        trackEvent(action, data) {
            const event = {
                action,
                elementId: data.elementId || '',
                elementText: data.elementText || '',
                elementType: data.elementType || '',
                pageName: data.pageName || '',
                url: data.url || '',
                userId: this.getUserData().userId,
                userRole: this.getUserData().userRole,
                depth: data.depth || '',
                timestamp: new Date().toISOString(),
            };
            this.dataLayer.push(event);
            this.sendDataToBackend(event);
        },

        sendDataToBackend(event) {
            fetch('http://localhost:8080/api/track-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            }).then(response => {
                if (!response.ok) {
                    console.error('Tracking error:', response.status, response.statusText);
                    throw new Error('Network response was not ok');
                }
            }).catch(error => console.error('Tracking error:', error));
        },

        sendUserJourneyToBackend(userJourneyData) {
            fetch('http://localhost:8080/api/track-user-journey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userJourneyData),
            }).then(response => {
                if (!response.ok) {
                    console.error('User journey tracking error:', response.status, response.statusText);
                    throw new Error('Network response was not ok');
                }
            }).catch(error => console.error('User journey tracking error:', error));
        },

        setSessionStartTime() {
            if (!sessionStorage.getItem('sessionStartTime')) {
                sessionStorage.setItem('sessionStartTime', Date.now().toString());
            }
        },

        calculateSessionDuration() {
            const sessionStartTime = parseInt(sessionStorage.getItem('sessionStartTime'), 10);
            if (!sessionStartTime) return 0;
            return Date.now() - sessionStartTime;
        },

        setupSessionEndTracking() {
            window.addEventListener('beforeunload', () => {
                const sessionDuration = this.calculateSessionDuration();
                const eventData = {
                    sessionDuration,
                    userId: this.getUserData().userId,
                    pageName: document.title,
                    url: window.location.href
                };
                this.trackEvent('sessionEnd', eventData);

                // Send session duration data to the backend when logging out
                if (sessionStorage.getItem('logout')) {
                    this.storeSessionDurationInBackend(sessionDuration);
                }
            });

            // Detect logout action (you may need to adapt this based on your logout button)
            const logoutButton = document.querySelector('#logout'); // Adjust selector
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    sessionStorage.setItem('logout', true);
                });
            }
        },

        storeSessionDurationInBackend(sessionDuration) {
            const userId = this.getUserData().userId;
            const userRole = this.getUserData().userRole;
            fetch('http://localhost:8080/api/sessions/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    userRole: userRole,
                    sessionDuration: sessionDuration
                }),
            }).then(response => {
                if (!response.ok) {
                    console.error('Session duration storage error:', response.status, response.statusText);
                    throw new Error('Network response was not ok');
                }
            }).catch(error => console.error('Session duration storage error:', error));
        },

        trackNavigation() {
            const trackTimeOnPage = () => {
                const currentTime = Date.now();
                const timeSpent = (currentTime - this.lastTimestamp) / 1000;

                if (this.lastTrackedUrl) {
                    this.sendTimeOnPage(this.lastTrackedUrl, timeSpent);
                }

                this.lastTimestamp = currentTime;
                this.lastTrackedUrl = window.location.href;
            };

            window.addEventListener('popstate', trackTimeOnPage);

            const originalPushState = history.pushState;
            history.pushState = function (state, title, url) {
                originalPushState.apply(this, arguments);
                trackTimeOnPage();
            };

            const originalReplaceState = history.replaceState;
            history.replaceState = function (state, title, url) {
                originalReplaceState.apply(this, arguments);
                trackTimeOnPage();
            };
        },

        sendTimeOnPage(url, timeSpent) {
            const data = {
                url,
                timeSpent,
                timestamp: new Date().toISOString(),
                userId: this.getUserData().userId,
                userRole: this.getUserData().userRole,
            };

            console.log("Time on Page:", data);

            fetch('http://localhost:8080/api/analytics/time-on-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }).then(response => {
                if (!response.ok) {
                    console.error('Time on page tracking error:', response.status, response.statusText);
                    throw new Error('Network response was not ok');
                }
            }).catch(error => console.error('Time on page tracking error:', error));
        },

        getUserData() {
            const userId = sessionStorage.getItem('userId');
            const userRole = sessionStorage.getItem('userRole');
            return {
                userId: userId || 'UnknownUser',
                userRole: userRole || 'UnknownRole'
            };
        }
    };

// Track initial page load
function trackPageView() {
  // Get session, user ID, and user role from sessionStorage or other source
  const sessionId = sessionStorage.getItem('sessionId') || 'unknown';
  const userId = sessionStorage.getItem('userId') || 'guest';
  const userRole = sessionStorage.getItem('userRole') || 'visitor';

  // Track the initial page load
  sendPageView(window.location.pathname, sessionId, userId, userRole);

  // Override pushState and replaceState to detect route changes
  const originalPushState = history.pushState;
  history.pushState = function (state, title, url) {
    originalPushState.apply(this, arguments);
    onUrlChange(url, sessionId, userId, userRole);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (state, title, url) {
    originalReplaceState.apply(this, arguments);
    onUrlChange(url, sessionId, userId, userRole);
  };

  // Detect back/forward button navigation
  window.addEventListener('popstate', function () {
    onUrlChange(window.location.pathname, sessionId, userId, userRole);
  });
}

// Helper function to handle URL changes
function onUrlChange(url, sessionId, userId, userRole) {
  sendPageView(url, sessionId, userId, userRole);
}

// Function to send the page view to your backend API
function sendPageView(url, sessionId, userId, userRole) {
  console.log("Tracking page view:", url, "Session ID:", sessionId, "User ID:", userId, "User Role:", userRole);

  // Format the timestamp in the required format (yyyy-MM-dd'T'HH:mm:ss.SSS)
  const timestamp = new Date().toISOString().slice(0, -1); // removes the 'Z' for millisecond precision

  fetch('http://localhost:8080/api/analytics/track-page-view', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url,
      timestamp: timestamp,
      sessionId: sessionId,
      userId: userId,
      userRole: userRole
    })
  });
}

// Initialize tracking
trackPageView();


    window.tracking = tracking;
    tracking.init();
})();