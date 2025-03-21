document.addEventListener('DOMContentLoaded', function() {
    // Mock API to simulate fetching module data
    const mockApi = {
        fetchModules: () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        { name: "Introduction to Mathematics", code: "MATH101" },
                        { name: "Physics Fundamentals", code: "PHYS201" },
                        { name: "Computer Science Basics", code: "CS101" }
                    ]);
                }, 1000);
            });
        },
        updateBooking: (booking) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(booking);
                }, 500);
            });
        }
    };

    // Initialize bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Modal Elements
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalDatePicker = document.getElementById('modal-date-picker');
    const datePickerInput = document.getElementById('date-picker-input');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    const modalClose = document.getElementById('modal-close');
    const confirmationAnimation = document.getElementById('confirmation-animation');

    // Initialize Flatpickr
    const flatpickrInstance = flatpickr(datePickerInput, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        time_24hr: true
    });

    // Function to show the modal
    function showModal(title, message, showConfirm = true, showDatePicker = false, onConfirm = null) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'flex';

        if (showDatePicker) {
            modalDatePicker.style.display = 'block';
            flatpickrInstance.clear();
        } else {
            modalDatePicker.style.display = 'none';
        }

        if (showConfirm) {
            modalConfirm.style.display = 'inline-block';
            modalCancel.style.display = 'inline-block';
            modalConfirm.onclick = function() {
                if (onConfirm) onConfirm();
                modal.style.display = 'none';
            };
        } else {
            modalConfirm.style.display = 'none';
            modalCancel.style.display = 'none';
        }

        modalCancel.onclick = function() {
            modal.style.display = 'none';
        };

        modalClose.onclick = function() {
            modal.style.display = 'none';
        };

        // Focus on the confirm button for accessibility
        if (showConfirm) {
            modalConfirm.focus();
        }
    }

    // Function to show confirmation animation
    function showConfirmationAnimation() {
        confirmationAnimation.style.display = 'block';
        setTimeout(() => {
            confirmationAnimation.style.display = 'none';
        }, 1500);
    }

    // Search Modules Filter with Highlighting
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const moduleList = document.getElementById('module-list');
    const noResultsMessage = document.getElementById('no-results-message');

    // Fetch modules from mock API and render them
    async function fetchAndRenderModules() {
        const modulesData = await mockApi.fetchModules();
        moduleList.innerHTML = '';
        modulesData.forEach(module => {
            const li = document.createElement('li');
            li.setAttribute('data-module', `${module.name} (${module.code})`);
            li.innerHTML = `
                <span class="module-text"><i class="fas fa-${module.code === 'MATH101' ? 'calculator' : module.code === 'PHYS201' ? 'atom' : 'laptop-code'}"></i> ${module.name} (${module.code})</span>
                <a href="#" class="link-btn book-btn" data-module-name="${module.name}"><i class="fas fa-book"></i> Book a Tutor</a>
            `;
            moduleList.appendChild(li);

            // Add booked indicator if the module is booked
            if (bookings.some(booking => booking.module === module.name)) {
                li.classList.add('booked');
            }

            // Add event listener for booking
            const bookBtn = li.querySelector('.book-btn');
            bookBtn.addEventListener('click', function(event) {
                event.preventDefault();
                const moduleName = bookBtn.getAttribute('data-module-name');
                showModal(
                    'Book a Tutor',
                    `Select a date and time to book a tutor for ${moduleName}.`,
                    true,
                    true,
                    async function() {
                        const selectedDate = datePickerInput.value;
                        if (!selectedDate) {
                            showModal('Error', 'Please select a date and time.', false);
                            return;
                        }
                        if (!bookings.some(booking => booking.module === moduleName)) {
                            const newBooking = { module: moduleName, date: selectedDate };
                            await mockApi.updateBooking(newBooking);
                            bookings.push(newBooking);
                            localStorage.setItem('bookings', JSON.stringify(bookings));
                            fetchAndRenderModules(); // Update booked indicators
                            showModal('Booking Confirmed', `Booking confirmed for ${moduleName} on ${selectedDate}!`, false);
                        } else {
                            showModal('Already Booked', `You have already booked a tutor for ${moduleName}.`, false);
                        }
                    }
                );
            });
        });
    }

    fetchAndRenderModules();

    function updateModuleList() {
        const searchText = searchInput.value.toLowerCase();
        const modules = moduleList.getElementsByTagName('li');
        let visibleModules = 0;

        for (let i = 0; i < modules.length; i++) {
            const moduleText = modules[i].getAttribute('data-module').toLowerCase();
            const moduleSpan = modules[i].querySelector('.module-text');
            const originalText = moduleSpan.textContent;

            if (moduleText.includes(searchText)) {
                modules[i].style.display = '';
                visibleModules++;

                // Highlight matching text
                if (searchText) {
                    const regex = new RegExp(`(${searchText})`, 'gi');
                    const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
                    moduleSpan.innerHTML = highlightedText;
                } else {
                    moduleSpan.innerHTML = originalText;
                }
            } else {
                modules[i].style.display = 'none';
                moduleSpan.innerHTML = originalText;
            }
        }

        // Show/hide "No Results" message
        noResultsMessage.style.display = visibleModules === 0 && searchText ? 'block' : 'none';
    }

    searchInput.addEventListener('input', updateModuleList);

    // Clear Search
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        updateModuleList();
    });

    // View Bookings
    const viewBookingsBtn = document.getElementById('view-bookings-btn');
    const bookingsSection = document.getElementById('bookings-section');
    const bookingsList = document.getElementById('bookings-list');
    const closeBookingsBtn = document.getElementById('close-bookings-btn');

    function renderBookings() {
        bookingsList.innerHTML = '';
        if (bookings.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No bookings yet.';
            bookingsList.appendChild(li);
        } else {
            bookings.forEach((booking, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${booking.module} - ${booking.date}</span>
                    <div class="booking-actions">
                        <button class="reschedule-booking-btn" data-index="${index}" aria-label="Reschedule booking for ${booking.module}">Reschedule</button>
                        <button class="delete-booking-btn" data-index="${index}" aria-label="Delete booking for ${booking.module}">Delete</button>
                    </div>
                `;
                bookingsList.appendChild(li);

                // Add event listener for reschedule button
                const rescheduleBtn = li.querySelector('.reschedule-booking-btn');
                rescheduleBtn.addEventListener('click', function() {
                    showModal(
                        'Reschedule Booking',
                        `Select a new date and time for ${booking.module}.`,
                        true,
                        true,
                        async function() {
                            const newDate = datePickerInput.value;
                            if (!newDate) {
                                showModal('Error', 'Please select a date and time.', false);
                                return;
                            }
                            const updatedBooking = { module: booking.module, date: newDate };
                            await mockApi.updateBooking(updatedBooking);
                            bookings[index] = updatedBooking;
                            localStorage.setItem('bookings', JSON.stringify(bookings));
                            renderBookings();
                            showModal('Booking Rescheduled', `Booking for ${booking.module} rescheduled to ${newDate}.`, false);
                        }
                    );
                });

                // Add event listener for delete button
                const deleteBtn = li.querySelector('.delete-booking-btn');
                deleteBtn.addEventListener('click', function() {
                    showModal(
                        'Delete Booking',
                        `Are you sure you want to delete your booking for ${booking.module}? This action cannot be undone.`,
                        true,
                        false,
                        async function() {
                            await mockApi.updateBooking(null); // Simulate API call
                            bookings.splice(index, 1);
                            localStorage.setItem('bookings', JSON.stringify(bookings));
                            renderBookings();
                            fetchAndRenderModules(); // Update booked indicators
                            showModal('Booking Deleted', `Booking for ${booking.module} has been deleted.`, false);
                            showConfirmationAnimation();
                        }
                    );
                });
            });
        }
    }

    viewBookingsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        moduleList.style.display = 'none';
        viewBookingsBtn.style.display = 'none';
        bookingsSection.style.display = 'block';
        renderBookings();
    });

    closeBookingsBtn.addEventListener('click', function() {
        bookingsSection.style.display = 'none';
        moduleList.style.display = 'block';
        viewBookingsBtn.style.display = 'flex';
    });

    // Back Button
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', function() {
        showModal('Navigate Back', 'Are you sure you want to go back to the previous page?', true, false, function() {
            // Simulate going back (replace with actual navigation logic)
            window.history.back();
        });
    });
});