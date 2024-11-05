(function() {
    const tracking = {
        dataLayer: [],

        init() {
            this.setupEventListeners();
            this.trackPageView();
            this.trackNavigation();
        },

        // Sets up global event listeners for various user actions
        setupEventListeners() {
            // Track click events with filters for meaningful clicks
            document.addEventListener('click', (event) => {
                const target = event.target;
                
                // Check if the element is a valid button, link, or has identifiable information
                const isValidClick = target.id || target.className || (target.innerText && target.innerText.trim());
                const validTagTypes = ['button', 'a', 'input', 'select', 'textarea'];
                
                // Additionally, check for PrimeNG icon buttons
                const isPrimeNGButton = target.classList.contains('p-button') || target.closest('.p-button');

                if (isValidClick && (validTagTypes.includes(target.tagName.toLowerCase()) || isPrimeNGButton)) {
                    const eventData = {
                        elementId: target.id || '',
                        elementClass: target.className || '',
                        elementText: target.innerText.trim() || '',
                        elementType: target.tagName.toLowerCase(),
                        isPrimeNG: isPrimeNGButton // Identify if it's a PrimeNG button
                    };
                    this.trackEvent('click', eventData);
                }
            });

            // Track form submissions
            document.addEventListener('submit', (event) => {
                const target = event.target;
                if (target && target.tagName.toLowerCase() === 'form') {
                    const eventData = {
                        formId: target.id || '',
                        formName: target.name || '',
                    };
                    this.trackEvent('formSubmission', eventData);
                }
            });

            // Track scroll depth (25%, 50%, 75%, 100%)
            window.addEventListener('scroll', () => {
                const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
                if (scrollDepth >= 25 && scrollDepth < 50 && !this.scroll25) {
                    this.trackEvent('scroll', { depth: '25%' });
                    this.scroll25 = true;
                } else if (scrollDepth >= 50 && scrollDepth < 75 && !this.scroll50) {
                    this.trackEvent('scroll', { depth: '50%' });
                    this.scroll50 = true;
                } else if (scrollDepth >= 75 && scrollDepth < 100 && !this.scroll75) {
                    this.trackEvent('scroll', { depth: '75%' });
                    this.scroll75 = true;
                } else if (scrollDepth >= 100 && !this.scroll100) {
                    this.trackEvent('scroll', { depth: '100%' });
                    this.scroll100 = true;
                }
            });

            // Track right-click (context menu) events
            document.addEventListener('contextmenu', (event) => {
                const target = event.target;

                // Check if the target element or any parent has the 'context-menu' class
                const isContextMenu = target.classList.contains('context-menu') || target.closest('.context-menu');

                if (isContextMenu) {
                    const eventData = {
                        elementId: target.id || '',
                        elementClass: target.className || '',
                        elementText: target.innerText ? target.innerText.trim() : '',
                        elementType: target.tagName.toLowerCase(),
                    };
                    this.trackEvent('rightClick', eventData);
                }
});

        },

        // Track page views
        trackPageView() {
            const eventData = {
                url: window.location.href,
                title: document.title,
            };
            this.trackEvent('pageView', eventData);
        },

        // Track navigation (popstate for back/forward navigation in SPAs)
        trackNavigation() {
            window.addEventListener('popstate', () => {
                const eventData = {
                    url: window.location.href,
                    title: document.title,
                };
                this.trackEvent('navigation', eventData);
            });
        },

        // Method to track events
        trackEvent(action, data) {
            const event = {
                action,
                data,
                timestamp: new Date().toISOString(),
            };
            this.dataLayer.push(event); 
            this.sendDataToBackend(event); 
        },

        // Sends event data to the backend API
        sendDataToBackend(event) {
            fetch('/api/track-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            })
            .catch((error) => console.error('Tracking error:', error));
        },
    };

    // Initialize the tracking library on page load
    window.addEventListener('load', () => {
        tracking.init();
    });
})();
