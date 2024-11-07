(function() {
    const tracking = {
        dataLayer: [],
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

            document.addEventListener('click', (event) => {
                const target = event.target;
                const isValidClick = target.id || target.className || (target.innerText && target.innerText.trim());
                const validTagTypes = ['button', 'a', 'input', 'select', 'textarea'];

                if (isValidClick && validTagTypes.includes(target.tagName.toLowerCase())) {
                    const eventData = {
                        elementId: target.id || '',
                        elementClass: target.className || '',
                        elementText: target.innerText.trim() || '',
                        elementType: target.tagName.toLowerCase(),
                        pageName: document.title,
                        url: window.location.href,
                        userId: this.getUserData().userId
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
                tracking.setSessionStartTime();
                tracking.init();
                tracking.setupSessionEndTracking();
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
            });
        },

        trackEvent(action, data) {
            const event = {
                action,
                elementId: data.elementId || '',
                elementClass: data.elementClass || '',
                elementText: data.elementText || '',
                elementType: data.elementType || '',
                pageName: data.pageName || '',
                url: data.url || '',
                userId: this.getUserData().userId || 'UnknownUser',
                userRole: this.getUserData().userRole || 'UnknownRole',
                depth: data.depth || '', // Scroll depth, if applicable
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

        setSessionStartTime() {
            if (!sessionStorage.getItem('sessionStartTime')) {
                sessionStorage.setItem('sessionStartTime', Date.now().toString());
            }
        },

        calculateSessionDuration() {
            const sessionStartTime = parseInt(sessionStorage.getItem('sessionStartTime'), 10);
            return sessionStartTime ? Date.now() - sessionStartTime : 0;
        },

        sendSessionDuration() {
            const sessionDuration = this.calculateSessionDuration();
            const user = this.getUserData();
            const sessionData = {
                action: 'sessionEnd',
                data: { sessionDuration, user },
                timestamp: new Date().toISOString(),
            };
            this.sendDataToBackend(sessionData);
        },

        getUserData() {
            return {
                userId: sessionStorage.getItem('userId') || 'UnknownUser',
                userRole: sessionStorage.getItem('userRole') || 'UnknownRole',
            };
        },

        setupSessionEndTracking() {
            window.addEventListener('beforeunload', () => {
                this.sendSessionDuration();
            });

            const logoutButton = document.getElementById('p-link layout-topbar-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    this.sendSessionDuration();
                });
            }
        },
    };

    window.addEventListener('load', () => {
        tracking.init();
    });
})();
