(function () {
    'use strict';

    var whatsappNumber = '2347047222666';
    var smsNumber = '07047222666';
    var businessEmail = 'abdulsalamlukman644@outlook.com';
    var reducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var year = document.getElementById('copyright-year');

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    var navigation = document.getElementById('primary-navigation');
    var menuToggle = document.querySelector('.menu-toggle');
    if (navigation) {
        var currentFile = window.location.pathname.split('/').pop() || 'index.html';
        var portalFiles = ['membership-portal.html', 'employment-portal.html', 'admin-portal.html'];
        if (portalFiles.indexOf(currentFile) !== -1) currentFile = 'portals.html';
        navigation.querySelectorAll('a[href]').forEach(function (link) {
            var linkFile = link.getAttribute('href').split('?')[0].split('#')[0];
            if (linkFile === currentFile) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('is-active');
                link.removeAttribute('aria-current');
            }
        });
    }

    if (navigation && menuToggle) {
        menuToggle.addEventListener('click', function () {
            var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
            navigation.classList.toggle('is-open', !isOpen);
        });

        navigation.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation menu');
                navigation.classList.remove('is-open');
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
                navigation.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation menu');
                menuToggle.focus();
            }
        });
    }

    var industryCopy = {
        startups: {
            title: 'Build a stronger foundation.',
            description: 'Get hands-on help with your business plan, essential operating systems, funding readiness, and the priorities that turn early momentum into sustainable growth.'
        },
        corporate: {
            title: 'Move complex work forward.',
            description: 'Strengthen planning, procurement, operational controls, and cross-functional delivery with support designed for established teams and regulated environments.'
        },
        retail: {
            title: 'Keep your operations moving.',
            description: 'Improve sourcing, supplier relationships, customer experience, and day-to-day processes across retail, distribution, and logistics.'
        },
        tech: {
            title: 'Turn opportunity into execution.',
            description: 'Build better digital foundations, sharpen go-to-market plans, and support project, partner, and operational needs in technology and real estate.'
        }
    };
    var industryTabs = Array.prototype.slice.call(document.querySelectorAll('.industry-tab'));
    var industryTitle = document.getElementById('industry-title');
    var industryDescription = document.getElementById('industry-description');
    var industryPanel = document.getElementById('industry-content');

    function selectIndustry(tab, moveFocus) {
        var content = industryCopy[tab.getAttribute('data-industry')];
        if (!content || !industryPanel || !industryTitle || !industryDescription) return;

        industryTabs.forEach(function (item) {
            var selected = item === tab;
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
        });
        industryPanel.setAttribute('aria-labelledby', tab.id);
        industryTitle.textContent = content.title;
        industryDescription.textContent = content.description;
        if (moveFocus) tab.focus();
    }

    if (industryTabs.length && industryPanel && industryTitle && industryDescription) {
        industryTabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                selectIndustry(tab, false);
            });
            tab.addEventListener('keydown', function (event) {
                var nextIndex = index;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % industryTabs.length;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + industryTabs.length) % industryTabs.length;
                if (event.key === 'Home') nextIndex = 0;
                if (event.key === 'End') nextIndex = industryTabs.length - 1;
                if (nextIndex !== index) {
                    event.preventDefault();
                    selectIndustry(industryTabs[nextIndex], true);
                }
            });
        });
    }

    var quoteDialog = document.getElementById('quote-dialog');
    var quoteButtons = document.querySelectorAll('.quick-quote');
    var selectedService = '';
    if (quoteDialog && quoteButtons.length) {
        var modalClose = document.getElementById('modal-close');
        var modalCancel = document.getElementById('modal-cancel');
        var modalContinue = document.getElementById('modal-continue');
        var modalServiceName = document.getElementById('modal-service-name');

        quoteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                selectedService = button.getAttribute('data-service') || '';
                if (modalServiceName) modalServiceName.textContent = selectedService;
                if (typeof quoteDialog.showModal === 'function') {
                    quoteDialog.showModal();
                } else {
                    quoteDialog.setAttribute('open', '');
                }
                document.body.classList.add('dialog-open');
            });
        });

        function closeQuoteDialog() {
            if (typeof quoteDialog.close === 'function' && quoteDialog.open) {
                quoteDialog.close();
            } else {
                quoteDialog.removeAttribute('open');
            }
            document.body.classList.remove('dialog-open');
        }

        if (modalClose) modalClose.addEventListener('click', closeQuoteDialog);
        if (modalCancel) modalCancel.addEventListener('click', closeQuoteDialog);
        quoteDialog.addEventListener('close', function () {
            document.body.classList.remove('dialog-open');
        });
        quoteDialog.addEventListener('click', function (event) {
            if (event.target === quoteDialog) closeQuoteDialog();
        });

        if (modalContinue) {
            modalContinue.addEventListener('click', function () {
                var serviceSelect = document.getElementById('contact-service');
                if (!serviceSelect) {
                    closeQuoteDialog();
                    window.location.href = 'contact.html?service=' + encodeURIComponent(selectedService);
                    return;
                }

                Array.prototype.some.call(serviceSelect.options, function (option) {
                    if (option.value === selectedService || option.textContent.trim() === selectedService) {
                        serviceSelect.value = option.value || option.textContent.trim();
                        return true;
                    }
                    return false;
                });
                closeQuoteDialog();

                var contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                }
                var nameField = document.getElementById('contact-name');
                if (nameField) {
                    window.setTimeout(function () { nameField.focus(); }, reducedMotion ? 0 : 450);
                }
            });
        }
    }

    var serviceSelect = document.getElementById('contact-service');
    if (serviceSelect && window.location.search) {
        var requestedService = new URLSearchParams(window.location.search).get('service');
        if (requestedService) {
            Array.prototype.some.call(serviceSelect.options, function (option) {
                if (option.value === requestedService || option.textContent.trim() === requestedService) {
                    serviceSelect.value = option.value || option.textContent.trim();
                    return true;
                }
                return false;
            });
        }
    }

    document.querySelectorAll('.register-event[data-event]').forEach(function (link) {
        var eventTitle = link.getAttribute('data-event');
        var eventMessage = 'Hello LAB Enterprises, I would like to register for ' + eventTitle + '.';
        link.href = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(eventMessage);
    });

    var eventGrid = document.querySelector('.event-grid');
    if (eventGrid) {
        fetch('/api/events').then(function (response) {
            if (!response.ok) throw new Error('Unable to load events.');
            return response.json();
        }).then(function (json) {
            (json.events || []).forEach(function (item) {
                var date = new Date(item.date + 'T00:00:00');
                if (Number.isNaN(date.getTime())) return;

                var card = document.createElement('article');
                card.className = 'event-card';
                var top = document.createElement('div');
                top.className = 'event-top';
                var time = document.createElement('time');
                time.className = 'event-date';
                time.dateTime = item.date;
                time.setAttribute('aria-label', date.toLocaleDateString(undefined, { dateStyle: 'long' }));
                var day = document.createElement('strong');
                day.textContent = String(date.getDate()).padStart(2, '0');
                var month = document.createElement('span');
                month.textContent = date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
                time.append(day, month);
                var tag = document.createElement('span');
                tag.className = 'event-tag';
                tag.textContent = item.type || 'Event';
                top.append(time, tag);

                var title = document.createElement('h3');
                title.textContent = item.title || 'LAB Enterprises event';
                var description = document.createElement('p');
                description.textContent = item.description || '';
                var venue = document.createElement('div');
                venue.className = 'event-venue';
                venue.textContent = item.location || '';
                var register = document.createElement('a');
                register.className = 'button button-outline register-event';
                register.textContent = 'Register via WhatsApp';
                register.href = 'https://wa.me/' + whatsappNumber + '?text=' +
                    encodeURIComponent('Hello LAB Enterprises, I would like to register for ' + (item.title || 'your event') + '.');
                register.target = '_blank';
                register.rel = 'noopener noreferrer';
                card.append(top, title, description, venue, register);
                eventGrid.appendChild(card);
            });
        }).catch(function (error) {
            var status = document.getElementById('events-load-error');
            if (status) status.hidden = false;
        });
    }

    function getControlLabel(form, control) {
        var label = control.id ? form.querySelector('label[for="' + control.id + '"]') : null;
        return label ? label.textContent.trim().replace(/\s+/g, ' ') : control.name.replace(/[_-]+/g, ' ');
    }

    function attachMessageForm(form) {
        var confirmationId = form.getAttribute('data-confirmation');
        var confirmation = confirmationId ? document.getElementById(confirmationId) : document.getElementById('form-confirmation');
        if (!confirmation) return;

        var whatsappLink = confirmation.querySelector('[data-send="whatsapp"], #send-whatsapp');
        var emailLink = confirmation.querySelector('[data-send="email"], #send-email');
        var smsLink = confirmation.querySelector('[data-send="sms"], #send-sms');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!form.reportValidity()) return;

            var lines = [form.getAttribute('data-subject') || 'LAB Enterprises inquiry', ''];
            Array.prototype.forEach.call(form.elements, function (control) {
                if (!control.name || control.disabled || /^(button|submit|reset|file)$/i.test(control.type)) return;
                if ((control.type === 'checkbox' || control.type === 'radio') && !control.checked) return;

                var value = control.type === 'checkbox' ? 'Yes' : control.value;
                if (control.tagName === 'SELECT' && control.selectedIndex >= 0) {
                    value = control.options[control.selectedIndex].textContent.trim();
                }
                if (!String(value).trim()) return;
                lines.push(getControlLabel(form, control) + ': ' + String(value).trim());
            });

            var message = lines.join('\n');
            var subject = form.getAttribute('data-email-subject') || 'Business inquiry - LAB Enterprises';
            var encodedMessage = encodeURIComponent(message);
            if (whatsappLink) {
                whatsappLink.href = 'https://wa.me/' + whatsappNumber + '?text=' + encodedMessage;
            }
            if (emailLink) {
                emailLink.href = 'mailto:' + businessEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodedMessage;
            }
            if (smsLink) {
                smsLink.href = 'sms:' + smsNumber + '?body=' + encodedMessage;
            }

            confirmation.hidden = false;
            confirmation.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
        });
    }

    document.querySelectorAll('form[data-route-form], form#inquiry-form').forEach(attachMessageForm);

    function getPortalStatusText(status) {
        return status ? String(status).toLowerCase() : 'pending';
    }

    function setAdminStatus(message, ok) {
        var statusBox = document.getElementById('admin-auth-status');
        if (!statusBox) return;
        statusBox.hidden = false;
        statusBox.textContent = message;
        statusBox.style.borderColor = ok ? '#c7ebd8' : '#f1c9cf';
        statusBox.style.background = ok ? '#eefaf3' : '#fff3f5';
        statusBox.style.color = ok ? '#1e4d39' : '#7f1d1d';
    }

    function getStoredAdminToken() {
        try {
            return window.localStorage.getItem('lab-enterprises-admin-token');
        } catch (error) {
            return null;
        }
    }

    function setStoredAdminToken(token) {
        try {
            if (token) {
                window.localStorage.setItem('lab-enterprises-admin-token', token);
            } else {
                window.localStorage.removeItem('lab-enterprises-admin-token');
            }
        } catch (error) {
            return;
        }
    }

    function toggleAdminControls(isLoggedIn) {
        var adminActions = document.getElementById('admin-actions');
        var adminLoginForm = document.getElementById('admin-login-form');
        var adminLogout = document.getElementById('admin-logout');

        if (adminActions) {
            adminActions.hidden = !isLoggedIn;
        }
        if (adminLoginForm) {
            adminLoginForm.hidden = isLoggedIn;
        }
        if (adminLogout) {
            adminLogout.hidden = !isLoggedIn;
        }
    }

    function restoreAdminSession() {
        var storedToken = getStoredAdminToken();
        if (!storedToken) {
            toggleAdminControls(false);
            return;
        }

        fetch('/api/session', {
            headers: {
                Authorization: 'Bearer ' + storedToken
            }
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            if (json && json.ok) {
                toggleAdminControls(true);
                setAdminStatus('Signed in as admin: ' + json.email, true);
                loadAdminDashboard(storedToken);
            } else {
                setStoredAdminToken(null);
                toggleAdminControls(false);
            }
        }).catch(function () {
            setStoredAdminToken(null);
            toggleAdminControls(false);
        });
    }

    var adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!adminLoginForm.reportValidity()) return;
            var formData = new FormData(adminLoginForm);
            var payload = {
                email: String(formData.get('email') || '').trim(),
                password: String(formData.get('password') || '').trim()
            };

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                if (!json || !json.ok) {
                    setAdminStatus(json && json.error ? json.error : 'Login failed.', false);
                    return;
                }

                setStoredAdminToken(json.token);
                toggleAdminControls(true);
                setAdminStatus('Signed in as admin: ' + json.email, true);
                adminLoginForm.reset();
                loadAdminDashboard(json.token);
            }).catch(function () {
                setAdminStatus('Login failed. Please try again.', false);
            });
        });
    }

    var adminLogoutButton = document.getElementById('admin-logout');
    if (adminLogoutButton) {
        adminLogoutButton.addEventListener('click', function () {
            setStoredAdminToken(null);
            toggleAdminControls(false);
            setAdminStatus('Logged out. Admin login required to add events.', false);
        });
    }

    var memberForm = document.getElementById('member-application-form');
    if (memberForm) {
        memberForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!memberForm.reportValidity()) return;

            var payload = {};
            Array.prototype.forEach.call(memberForm.elements, function (control) {
                if (!control.name || control.disabled || /^(button|submit|reset)$/i.test(control.type)) return;
                if (control.type === 'checkbox') {
                    if (control.checked) payload[control.name] = 'accepted';
                    return;
                }
                if (String(control.value).trim()) payload[control.name] = control.value.trim();
            });

            fetch('/api/member-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                if (!json || !json.ok) {
                    throw new Error(json && json.error ? json.error : 'Application submission failed.');
                }
                memberForm.reset();
                var confirmation = document.getElementById('member-confirmation');
                if (confirmation) {
                    confirmation.hidden = false;
                    confirmation.querySelector('p').textContent = json && json.message ? json.message : 'Your request has been sent for review.';
                }
            }).catch(function (error) {
                var confirmation = document.getElementById('member-confirmation');
                if (confirmation) {
                    confirmation.hidden = false;
                    confirmation.querySelector('p').textContent = error.message || 'There was a problem submitting your application. Please try again.';
                }
            });
        });
    }

    var employmentForm = document.getElementById('employment-application-form');
    if (employmentForm) {
        employmentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!employmentForm.reportValidity()) return;

            var payload = {};
            Array.prototype.forEach.call(employmentForm.elements, function (control) {
                if (!control.name || control.disabled || /^(button|submit|reset)$/i.test(control.type)) return;
                if (control.type === 'checkbox') {
                    if (control.checked) payload[control.name] = 'accepted';
                    return;
                }
                if (String(control.value).trim()) payload[control.name] = control.value.trim();
            });

            fetch('/api/employment-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                if (!json || !json.ok) {
                    throw new Error(json && json.error ? json.error : 'Employment application submission failed.');
                }
                employmentForm.reset();
                var confirmation = document.getElementById('employment-confirmation');
                if (confirmation) {
                    confirmation.hidden = false;
                    confirmation.querySelector('p').textContent = json && json.message ? json.message : 'Your employment request has been sent for review.';
                }
            }).catch(function (error) {
                var confirmation = document.getElementById('employment-confirmation');
                if (confirmation) {
                    confirmation.hidden = false;
                    confirmation.querySelector('p').textContent = error.message || 'There was a problem submitting your application. Please try again.';
                }
            });
        });
    }

    function setApplicantMessage(element, message, ok) {
        if (!element) return;
        element.hidden = false;
        element.textContent = message;
        element.style.borderColor = ok ? '#c7ebd8' : '#f1c9cf';
        element.style.background = ok ? '#eefaf3' : '#fff3f5';
        element.style.color = ok ? '#1e4d39' : '#7f1d1d';
    }

    function getApplicantToken(category) {
        try {
            return window.sessionStorage.getItem('lab-enterprises-applicant-' + category);
        } catch (error) {
            return null;
        }
    }

    function setApplicantToken(category, token) {
        try {
            if (token) {
                window.sessionStorage.setItem('lab-enterprises-applicant-' + category, token);
            } else {
                window.sessionStorage.removeItem('lab-enterprises-applicant-' + category);
            }
        } catch (error) {
            return;
        }
    }

    function renderApplicantProgress(progress) {
        var progressPanel = document.getElementById('applicant-progress');
        var status = document.getElementById('applicant-progress-status');
        var reference = document.getElementById('applicant-progress-reference');
        if (!progressPanel || !status || !reference || !progress) return;

        var statusText = String(progress.status || 'pending').toLowerCase();
        var labels = {
            pending: 'Application received — pending review',
            approved: 'Application approved',
            rejected: 'Application not approved'
        };
        status.textContent = labels[statusText] || 'Application status: ' + statusText;
        reference.textContent = 'Reference: ' + progress.id + ' · Submitted ' +
            new Date(progress.createdAt).toLocaleDateString();
        progressPanel.hidden = false;
    }

    function loadApplicantProgress(category, token) {
        return fetch('/api/applicant/progress', {
            headers: { Authorization: 'Bearer ' + token }
        }).then(function (response) {
            return response.json().then(function (json) {
                if (!response.ok || !json || !json.ok) {
                    throw new Error(json && json.error ? json.error : 'Unable to load application progress.');
                }
                renderApplicantProgress(json.progress);
            });
        });
    }

    var applicantLoginForm = document.getElementById('applicant-login-form');
    var applicantType = applicantLoginForm ? applicantLoginForm.getAttribute('data-applicant-type') : '';
    var applicantLoginStatus = document.getElementById('applicant-login-status');
    var applicantLogout = document.getElementById('applicant-logout');
    var applicantProgressPanel = document.getElementById('applicant-progress');

    if (applicantLoginForm && applicantType) {
        applicantLoginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!applicantLoginForm.reportValidity()) return;
            var formData = new FormData(applicantLoginForm);

            fetch('/api/applicant/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: applicantType,
                    email: String(formData.get('email') || '').trim(),
                    password: String(formData.get('password') || '')
                })
            }).then(function (response) {
                return response.json().then(function (json) {
                    if (!response.ok || !json || !json.ok) {
                        throw new Error(json && json.error ? json.error : 'Unable to sign in.');
                    }
                    return json;
                });
            }).then(function (json) {
                setApplicantToken(applicantType, json.token);
                applicantLoginForm.reset();
                if (applicantLogout) applicantLogout.hidden = false;
                setApplicantMessage(applicantLoginStatus, 'Signed in. Your application progress is shown below.', true);
                return loadApplicantProgress(applicantType, json.token);
            }).catch(function (error) {
                setApplicantMessage(applicantLoginStatus, error.message || 'Unable to sign in. Please try again.', false);
            });
        });

        var storedApplicantToken = getApplicantToken(applicantType);
        if (storedApplicantToken) {
            loadApplicantProgress(applicantType, storedApplicantToken).then(function () {
                if (applicantLogout) applicantLogout.hidden = false;
                setApplicantMessage(applicantLoginStatus, 'You are signed in. Your latest application progress is shown below.', true);
            }).catch(function (error) {
                setApplicantToken(applicantType, null);
                if (applicantProgressPanel) applicantProgressPanel.hidden = true;
                setApplicantMessage(applicantLoginStatus, error.message || 'Please sign in again to view progress.', false);
            });
        }
    }

    if (applicantLogout && applicantType) {
        applicantLogout.addEventListener('click', function () {
            var token = getApplicantToken(applicantType);
            setApplicantToken(applicantType, null);
            applicantLogout.hidden = true;
            if (applicantProgressPanel) applicantProgressPanel.hidden = true;
            setApplicantMessage(applicantLoginStatus, 'You have signed out.', true);
            if (token) {
                fetch('/api/applicant/logout', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token }
                }).catch(function () {
                    setApplicantMessage(applicantLoginStatus, 'Signed out on this device. The server session could not be cleared.', false);
                });
            }
        });
    }

    var applicantActivationForm = document.getElementById('applicant-activation-form');
    if (applicantActivationForm) {
        var verificationToken = new URLSearchParams(window.location.search).get('verify');
        var activationPanel = document.getElementById('applicant-activation-panel');
        var tokenField = document.getElementById('applicant-verification-token');
        var activationStatus = document.getElementById('applicant-activation-status');
        if (verificationToken && activationPanel && tokenField) {
            tokenField.value = verificationToken;
            activationPanel.hidden = false;
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
            activationPanel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        }

        applicantActivationForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!applicantActivationForm.reportValidity()) return;
            var formData = new FormData(applicantActivationForm);
            var password = String(formData.get('password') || '');
            var confirmPassword = String(formData.get('confirmPassword') || '');
            if (password !== confirmPassword) {
                setApplicantMessage(activationStatus, 'The passwords do not match.', false);
                return;
            }

            fetch('/api/applicant/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: applicantActivationForm.getAttribute('data-applicant-type'),
                    token: String(formData.get('token') || ''),
                    password: password
                })
            }).then(function (response) {
                return response.json().then(function (json) {
                    if (!response.ok || !json || !json.ok) {
                        throw new Error(json && json.error ? json.error : 'Unable to verify your email.');
                    }
                    return json;
                });
            }).then(function (json) {
                setApplicantToken(json.category, json.token);
                applicantActivationForm.reset();
                if (activationPanel) activationPanel.hidden = true;
                if (applicantLogout) applicantLogout.hidden = false;
                setApplicantMessage(applicantLoginStatus, 'Email verified. Your application progress is shown below.', true);
                if (json.progress) renderApplicantProgress(json.progress);
                return loadApplicantProgress(json.category, json.token);
            }).catch(function (error) {
                setApplicantMessage(activationStatus, error.message || 'Unable to verify your email. Please try again.', false);
            });
        });
    }

    var eventForm = document.getElementById('admin-event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!eventForm.reportValidity()) return;

            var payload = {};
            Array.prototype.forEach.call(eventForm.elements, function (control) {
                if (!control.name || control.disabled || /^(button|submit|reset)$/i.test(control.type)) return;
                if (String(control.value).trim()) payload[control.name] = control.value.trim();
            });

            var token = getStoredAdminToken();
            if (!token) {
                setAdminStatus('Admin login required before adding events.', false);
                return;
            }

            fetch('/api/admin/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                if (!json || !json.ok) {
                    setAdminStatus(json && json.error ? json.error : 'Unable to save event.', false);
                    return;
                }
                eventForm.reset();
                setAdminStatus('Event added successfully.', true);
                return fetch('/api/admin/dashboard', {
                    headers: { Authorization: 'Bearer ' + token }
                });
            }).then(function (response) {
                if (!response) return;
                return response.json();
            }).then(function (dashboardData) {
                if (dashboardData && dashboardData.ok) {
                    renderPortalDashboardFromApi(dashboardData.data);
                }
            }).catch(function () {
                setAdminStatus('Unable to save event. Please try again.', false);
            });
        });
    }

    function escapePortalText(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    }

    function loadAdminDashboard(token) {
        return fetch('/api/admin/dashboard', {
            headers: { Authorization: 'Bearer ' + token }
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            if (!json || !json.ok) {
                throw new Error(json && json.error ? json.error : 'Unable to load admin dashboard.');
            }
            renderPortalDashboardFromApi(json.data);
        });
    }

    function renderPortalDashboardFromApi(data) {
        var dashboard = document.getElementById('admin-dashboard');
        if (!dashboard || !data) return;

        var allItems = [];
        (data.members || []).forEach(function (item) {
            allItems.push({ id: item.id, type: 'members', label: 'Member / Investor', title: item.company || item.fullName || 'Member application', status: getPortalStatusText(item.status), payload: item });
        });
        (data.employment || []).forEach(function (item) {
            allItems.push({ id: item.id, type: 'employment', label: 'Employment', title: item.fullName || 'Employment application', status: getPortalStatusText(item.status), payload: item });
        });
        (data.events || []).forEach(function (item) {
            allItems.push({ id: item.id, type: 'events', label: 'Event', title: item.title || 'Event listing', status: getPortalStatusText(item.status), payload: item });
        });
        (data.meetings || []).forEach(function (item) {
            allItems.push({ id: item.id, type: 'meetings', label: 'Meeting', title: item.purpose || 'Meeting request', status: getPortalStatusText(item.status), payload: item });
        });

        if (!allItems.length) {
            dashboard.innerHTML = '<p>No submissions yet. Submit an application or meeting request to populate the admin workspace.</p>';
            return;
        }

        dashboard.innerHTML = '<div class="portal-admin-list-inner">' + allItems.map(function (item) {
            var itemDetails = item.payload && typeof item.payload === 'object' ? Object.keys(item.payload).map(function (key) {
                var value = item.payload[key];
                if (key === 'id' || key === 'status' || key === 'type') return '';
                if (!value) return '';
                return '<li><strong>' + escapePortalText(key.replace(/([A-Z])/g, ' $1').replace(/^./, function (letter) { return letter.toUpperCase(); })) + ':</strong> ' + escapePortalText(value) + '</li>';
            }).join('') : '';
            return '<article class="mission-card" style="margin-bottom: 14px;">' +
                '<div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; flex-wrap:wrap;">' +
                '<div><span class="outcome-label">' + escapePortalText(item.label) + '</span><h3 style="margin-top: 10px;">' + escapePortalText(item.title) + '</h3></div>' +
                '<span class="button button-outline" style="pointer-events: none; min-height: auto; padding: 8px 12px;">' + escapePortalText(item.status) + '</span>' +
                '</div>' +
                '<ul style="margin: 18px 0 18px 18px; padding-left: 18px; color: var(--muted); font-size: .82rem;">' + itemDetails + '</ul>' +
                '<div style="display:flex; flex-wrap:wrap; gap:10px;">' +
                '<button type="button" class="button button-primary" data-action="approve" data-item-type="' + escapePortalText(item.type) + '" data-item-id="' + escapePortalText(item.id) + '">Approve</button>' +
                '<button type="button" class="button button-outline" data-action="reject" data-item-type="' + escapePortalText(item.type) + '" data-item-id="' + escapePortalText(item.id) + '">Reject</button>' +
                '</div>' +
                '</article>';
        }).join('') + '</div>';
    }

    var meetingForm = document.getElementById('admin-meeting-form');
    if (meetingForm) {
        meetingForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!meetingForm.reportValidity()) return;

            var payload = {};
            Array.prototype.forEach.call(meetingForm.elements, function (control) {
                if (!control.name || control.disabled || /^(button|submit|reset)$/i.test(control.type)) return;
                if (String(control.value).trim()) payload[control.name] = control.value.trim();
            });

            var token = getStoredAdminToken();
            if (!token) {
                setAdminStatus('Admin login required before reviewing meeting requests.', false);
                return;
            }

            fetch('/api/meeting-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                meetingForm.reset();
                if (json && json.ok) {
                    setAdminStatus('Meeting request submitted.', true);
                }
            }).catch(function () {
                setAdminStatus('Unable to submit meeting request.', false);
            });
        });
    }

    var dashboard = document.getElementById('admin-dashboard');
    if (dashboard) {
        dashboard.addEventListener('click', function (event) {
            var button = event.target.closest('[data-action]');
            if (!button) return;
            var action = button.getAttribute('data-action');
            var itemType = button.getAttribute('data-item-type');
            var itemId = button.getAttribute('data-item-id');
            if (!action || !itemType || !itemId) return;

            var token = getStoredAdminToken();
            if (!token) {
                setAdminStatus('Admin login required to approve or reject items.', false);
                return;
            }

            var updateMessage = '';
            var updateEmailSent = true;
            fetch('/api/admin/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    type: itemType,
                    itemId: itemId,
                    status: action === 'approve' ? 'approved' : 'rejected'
                })
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                if (json && json.ok) {
                    updateMessage = json.message || 'Status updated successfully.';
                    updateEmailSent = json.emailSent !== false;
                    return fetch('/api/admin/dashboard', {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                }
                setAdminStatus(json && json.error ? json.error : 'Unable to update status.', false);
                return null;
            }).then(function (response) {
                if (!response) return;
                return response.json();
            }).then(function (dashboardData) {
                if (dashboardData && dashboardData.ok) {
                    renderPortalDashboardFromApi(dashboardData.data);
                    setAdminStatus(updateMessage, updateEmailSent);
                }
            }).catch(function () {
                setAdminStatus('Unable to update status. Please try again.', false);
            });
        });
    }

    var adminToggle = document.getElementById('open-admin-dashboard');
    if (adminToggle) {
        adminToggle.addEventListener('click', function () {
            var dashboardPanel = document.getElementById('admin-dashboard');
            if (dashboardPanel) {
                dashboardPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (adminLoginForm) {
        restoreAdminSession();
    }

    var revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length) {
        document.documentElement.classList.add('js-ready');
        if ('IntersectionObserver' in window && !reducedMotion) {
            var revealObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            revealItems.forEach(function (item) { revealObserver.observe(item); });
        } else {
            revealItems.forEach(function (item) { item.classList.add('is-visible'); });
        }
    }

    var counters = document.querySelectorAll('[data-count]');
    function animateCounter(element) {
        var target = Number(element.getAttribute('data-count'));
        var suffix = element.getAttribute('data-suffix') || '';
        var label = element.getAttribute('data-label');
        if (label) {
            element.textContent = label;
            return;
        }
        if (reducedMotion) {
            element.textContent = target + suffix;
            return;
        }

        var start = performance.now();
        var duration = 1150;
        function tick(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
    }

    if (counters.length) {
        if ('IntersectionObserver' in window && !reducedMotion) {
            var counterObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.65 });
            counters.forEach(function (counter) { counterObserver.observe(counter); });
        } else {
            counters.forEach(animateCounter);
        }
    }
}());
