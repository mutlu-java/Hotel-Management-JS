// Main JavaScript for Hotel Management System- 
// ToDo 
// 1. Managaing multiple guests in rooms
// 2. Activating Dashboard stats occupancy, requests,etc
//(making them dynamic)
// 3. Managing room details when clicked on a room redirecting to room details(guests inside check out dates etc)
// 4. Main page dashboard updates will be dynamic
// ?? main js ayrıştırılabilir mi, modal yapısı yerine yeni sayfa düzeni 
// ?? prettier 


// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the database/storage
    initializeDatabase();
    
    // Set current date
    setCurrentDate();
    
    // Navigation handling
    initializeNavigation();
    
    // Initialize modals
    initializeModals();
    
    // Initialize event listeners for action buttons
    initializeActionListeners();
    
    // Load initial data
    loadDashboardData();

    initializeBookingFilters();
});

// ========== DATABASE/STORAGE HANDLING ==========
function initializeDatabase() {
    // Check if we have data in localStorage, if not, initialize with sample data
    if (!localStorage.getItem('hotelData')) {
        // Sample data structure
        const initialData = {
            rooms: [
                { id: 101, type: 'Suite', status: 'occupied', currentGuest: 'Alice Johnson', rate: 250 },
                { id: 102, type: 'Deluxe', status: 'available', currentGuest: null, rate: 180 },
                { id: 103, type: 'Suite', status: 'reserved', currentGuest: null, rate: 250 },
                { id: 104, type: 'Standard', status: 'cleaning', currentGuest: null, rate: 120 },
                { id: 105, type: 'Deluxe', status: 'occupied', currentGuest: 'Bob Smith', rate: 180 },
                { id: 106, type: 'Standard', status: 'available', currentGuest: null, rate: 120 },
                { id: 201, type: 'Suite', status: 'occupied', currentGuest: 'Carol Davis', rate: 250 },
                { id: 202, type: 'Deluxe', status: 'occupied', currentGuest: 'Daniel Wilson', rate: 180 },
                { id: 203, type: 'Deluxe', status: 'reserved', currentGuest: null, rate: 180 },
                { id: 204, type: 'Standard', status: 'available', currentGuest: null, rate: 120 },
                { id: 205, type: 'Deluxe', status: 'occupied', currentGuest: 'Robert Johnson', rate: 180 },
                { id: 206, type: 'Standard', status: 'reserved', currentGuest: null, rate: 120 },
            ],
            guests: [
                { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-1234', notes: 'VIP guest' },
                { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '555-5678', notes: 'Prefers higher floor' },
                { id: 3, name: 'Carol Davis', email: 'carol@example.com', phone: '555-9012', notes: 'Allergic to feathers' },
                { id: 4, name: 'Daniel Wilson', email: 'daniel@example.com', phone: '555-3456', notes: 'Business traveler' },
                { id: 5, name: 'Emma Thompson', email: 'emma@example.com', phone: '555-7890', notes: 'Returning guest' },
                { id: 6, name: 'David Wilson', email: 'david@example.com', phone: '555-2345', notes: 'Anniversary trip' },
                { id: 7, name: 'Robert Johnson', email: 'robert@example.com', phone: '555-6789', notes: 'Late checkout requested' },
                { id: 8, name: 'Sarah Martinez', email: 'sarah@example.com', phone: '555-0123', notes: 'Requires assistance' },
                { id: 9, name: 'James Taylor', email: 'james@example.com', phone: '555-4567', notes: 'Early check-in' },
                { id: 10, name: 'Jennifer Garcia', email: 'jennifer@example.com', phone: '555-8901', notes: 'First time guest' },
                { id: 11, name: 'Michael Brown', email: 'michael@example.com', phone: '555-2345', notes: 'Quiet room requested' },
            ],
            bookings: [
                { 
                    id: 1, 
                    guestId: 5, 
                    roomId: 203, 
                    checkIn: '2025-04-12', 
                    checkOut: '2025-04-15', 
                    status: 'confirmed',
                    totalAmount: 540,
                    paymentStatus: 'pending'
                },
                { 
                    id: 2, 
                    guestId: 6, 
                    roomId: 304, 
                    checkIn: '2025-04-12', 
                    checkOut: '2025-04-14', 
                    status: 'confirmed',
                    totalAmount: 500,
                    paymentStatus: 'paid'
                },
                { 
                    id: 3, 
                    guestId: 10, 
                    roomId: 206, 
                    checkIn: '2025-04-12', 
                    checkOut: '2025-04-13', 
                    status: 'confirmed',
                    totalAmount: 120,
                    paymentStatus: 'pending'
                },
                { 
                    id: 4, 
                    guestId: 11, 
                    roomId: 401, 
                    checkIn: '2025-04-12', 
                    checkOut: '2025-04-16', 
                    status: 'confirmed',
                    totalAmount: 720,
                    paymentStatus: 'paid'
                },
                { 
                    id: 5, 
                    guestId: 7, 
                    roomId: 205, 
                    checkIn: '2025-04-10', 
                    checkOut: '2025-04-12', 
                    status: 'checked-in',
                    totalAmount: 360,
                    paymentStatus: 'paid'
                },
                { 
                    id: 6, 
                    guestId: 8, 
                    roomId: 302, 
                    checkIn: '2025-04-09', 
                    checkOut: '2025-04-12', 
                    status: 'checked-in',
                    totalAmount: 750,
                    paymentStatus: 'paid'
                },
                { 
                    id: 7, 
                    guestId: 9, 
                    roomId: 104, 
                    checkIn: '2025-04-11', 
                    checkOut: '2025-04-12', 
                    status: 'checked-in',
                    totalAmount: 120,
                    paymentStatus: 'paid'
                }
            ],
            requests: [
                { id: 1, roomId: 202, type: 'Housekeeping', description: 'Extra towels', status: 'pending', timestamp: '2025-04-12T10:15:00', priority: 'normal' },
                { id: 2, roomId: 304, type: 'Room Service', description: 'Breakfast order', status: 'pending', timestamp: '2025-04-12T11:30:00', priority: 'high' },
                { id: 3, roomId: 103, type: 'Maintenance', description: 'AC not working', status: 'pending', timestamp: '2025-04-12T09:45:00', priority: 'high' },
                { id: 4, roomId: 205, type: 'Front Desk', description: 'Late checkout request', status: 'pending', timestamp: '2025-04-11T18:20:00', priority: 'normal' }
            ],
            nextIds: {
                bookings: 8,
                guests: 12,
                requests: 5
            }
        };
        
        localStorage.setItem('hotelData', JSON.stringify(initialData));
    }
}

// Get data from local storage
function getHotelData() {
    return JSON.parse(localStorage.getItem('hotelData'));
}

// Save data to local storage
function saveHotelData(data) {
    localStorage.setItem('hotelData', JSON.stringify(data));
}

// ========== UI INITIALIZATION ==========
function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
}

function initializeNavigation() {
    // Handle navigation click events
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
           // !!!! e.preventDefault prevents default DOM element behaviour
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all pages
            document.querySelectorAll('#dashboard-page, #bookings-page, #guests-page, #rooms-page').forEach(page => {
                page.style.display = 'none';
            });
            
            // Show the selected page
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                const page = document.getElementById(pageId + '-page');
                if (page) {
                    page.style.display = 'block';
                    
                    // Load page-specific data
                    if (pageId === 'dashboard') {
                        loadDashboardData();
                    } else if (pageId === 'bookings') {
                        loadBookingsData();
                    } else if (pageId === 'guests') {
                        loadGuestsData();
                    } else if (pageId === 'rooms') {
                        loadRoomsData();
                    }
                }
            }
        });
    });
    
    // mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('expanded');
        });
    }

    document.getElementById('guest-search')?.addEventListener('input', function () {
        loadGuestsData(this.value);
    });
    document.getElementById('room-search')?.addEventListener('input', function () {
        loadRoomsData(this.value);
    });
    
}

function initializeModals() {
    // getting  modal elements
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.close-modal, .btn-secondary');
    
    // event listeners for opening modals
    document.getElementById('new-booking-btn')?.addEventListener('click', function() {
        document.getElementById('booking-modal').style.display = 'flex';
    });
    
    // Close modals when clicking close button or outside
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Close modal when clicking outside of it
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    populateGuestDropdown();
    populateRoomDropdown();

    // Handle form submission
    document.getElementById('submit-booking')?.addEventListener('click', function () {
        const form = document.getElementById('booking-form');
        const formData = new FormData(form);
        const bookingData = {
            guestId: formData.get('guestId'),
            roomId: formData.get('roomId'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut')
        };

        if (!bookingData.guestId || !bookingData.roomId || !bookingData.checkIn || !bookingData.checkOut) {
            alert("Please fill all fields.");
            return;
        }

        if (!isRoomAvailable(bookingData.roomId, bookingData.checkIn, bookingData.checkOut)) {
            alert("This room is already booked for the selected dates.");
            return;
        }
        
        const newBooking = addNewBooking(bookingData);
        
        if (newBooking) {
            alert("Booking successfully created!");
            document.getElementById('booking-modal').style.display = 'none';
            form.reset();
        }
    });
}
document.getElementById('new-guest-btn')?.addEventListener('click', () => {
    openGuestModal('add');
});

document.getElementById('guest-modal-submit')?.addEventListener('click', () => {
    const form = document.getElementById('guest-form');
    const formData = new FormData(form);
    const guest = {
        id: formData.get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notes: formData.get('notes')
    };

    const data = getHotelData();

    if (guest.id) {
      
        const g = data.guests.find(g => g.id === parseInt(guest.id));
        Object.assign(g, guest);
    } else {
      
        guest.id = data.nextIds.guests++;
        data.guests.push(guest);
    }

    saveHotelData(data);
    loadGuestsData();
    document.getElementById('guest-modal').style.display = 'none';
    form.reset();
});

function openGuestModal(mode, id = null) {
    const modal = document.getElementById('guest-modal');
    const form = document.getElementById('guest-form');
    const title = document.getElementById('guest-modal-title');

    form.reset();
    form.querySelector('[name="id"]').value = '';

    if (mode === 'edit' && id !== null) {
        const guest = getHotelData().guests.find(g => g.id === id);
        if (!guest) return;
        title.textContent = 'Edit Guest';
        form.name.value = guest.name;
        form.email.value = guest.email;
        form.phone.value = guest.phone;
        form.notes.value = guest.notes;
        form.id.value = guest.id;
    } else {
        title.textContent = 'Add Guest';
    }

    modal.style.display = 'flex';
}

document.getElementById('new-guest-btn')?.addEventListener('click', () => {
    openGuestModal('add');
});

document.getElementById('guest-modal-submit')?.addEventListener('click', () => {
    // guest form submit logic
});

function populateGuestDropdown() {
    const data = getHotelData();
    const guestSelect = document.getElementById('guest-select');
    guestSelect.innerHTML = `<option value="">Select Guest</option>`;
    data.guests.forEach(guest => {
        guestSelect.innerHTML += `<option value="${guest.id}">${guest.name}</option>`;
    });
}

function populateRoomDropdown() {
    const data = getHotelData();
    const roomSelect = document.getElementById('room-select');
    roomSelect.innerHTML = `<option value="">Select Room</option>`;
    data.rooms
        .filter(r => r.status === 'available' || r.status === 'reserved')
        .forEach(room => {
            roomSelect.innerHTML += `<option value="${room.id}">${room.id} (${room.type})</option>`;
        });
}


function initializeActionListeners() {
    // Check-in buttons
    document.querySelectorAll('.guest-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            const guestName = this.closest('.guest-item').querySelector('.guest-name').textContent;
            
            if (action === 'Check In') {
                checkInGuest(guestName);
            } else if (action === 'Check Out') {
                checkOutGuest(guestName);
            } else if (action === 'Complete') {
                completeRequest(this.closest('.guest-item'));
            }
        });
    });
}

function initializeBookingFilters() {
document.getElementById('status-filter')?.addEventListener('change', applyBookingFilters);
document.getElementById('date-filter')?.addEventListener('change', applyBookingFilters);

function applyBookingFilters() {
    const status = document.getElementById('status-filter')?.value || '';
    const date = document.getElementById('date-filter')?.value || '';
    loadBookingsData(status, date);
}

}
// ========== DATA LOADING FUNCTIONS ==========
function loadDashboardData() {
    // i will add mongo db and nodejs data fetching later for now sample data will be used
    
    const hotelData = getHotelData();
    
    // Update room status grid
    updateRoomStatusGrid(hotelData.rooms);
    
    // Update arrivals list
    updateArrivalsList(hotelData.bookings, hotelData.guests);
    
    // Update departures list
    updateDeparturesList(hotelData.bookings, hotelData.guests);
    
    // Update requests list
    updateRequestsList(hotelData.requests);
    
    // Update stats
    updateDashboardStats(hotelData);
}

function loadBookingsData(statusFilter = '', dateFilter = '') {
    const data = getHotelData();
    const tbody = document.querySelector('#bookings-page table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const today = new Date();
    const filtered = data.bookings.filter(b => {
        const matchStatus = !statusFilter || b.status === statusFilter;

        const checkIn = new Date(b.checkIn);
        let matchDate = true;

        switch (dateFilter) {
            case 'today':
                matchDate = checkIn.toDateString() === today.toDateString();
                break;
            case 'tomorrow':
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                matchDate = checkIn.toDateString() === tomorrow.toDateString();
                break;
            case 'this-week':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                matchDate = checkIn >= startOfWeek && checkIn <= endOfWeek;
                break;
            case 'next-week':
                const startNextWeek = new Date(today);
                startNextWeek.setDate(today.getDate() - today.getDay() + 7);
                const endNextWeek = new Date(startNextWeek);
                endNextWeek.setDate(endNextWeek.getDate() + 6);
                matchDate = checkIn >= startNextWeek && checkIn <= endNextWeek;
                break;
            case 'this-month':
                matchDate = checkIn.getMonth() === today.getMonth() && checkIn.getFullYear() === today.getFullYear();
                break;
        }

        return matchStatus && matchDate;
    });

    filtered.forEach(booking => {
        const guest = data.guests.find(g => g.id === booking.guestId);
        const room = data.rooms.find(r => r.id === booking.roomId);

        if (guest && room) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${guest.name}</td>
                <td>${room.id} (${room.type})</td>
                <td>${formatDate(booking.checkIn)}</td>
                <td>${formatDate(booking.checkOut)}</td>
                <td><span class="status-badge ${booking.status}">${capitalize(booking.status)}</span></td>
                <td>$${booking.totalAmount}</td>
                <td>
                    <div class="action-cell">
                        <button class="action-btn edit-booking" data-id="${booking.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn ${booking.status === 'confirmed' ? 'check-in-booking' : booking.status === 'checked-in' ? 'check-out-booking' : ''}" 
                            data-id="${booking.id}" ${(booking.status !== 'confirmed' && booking.status !== 'checked-in') ? 'disabled' : ''}>
                            <i class="fas ${booking.status === 'confirmed' ? 'fa-check-circle' : booking.status === 'checked-in' ? 'fa-sign-out-alt' : 'fa-ban'}"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        }
    });

    addBookingActionListeners();
}


function loadGuestsData(filterText = '') {
    const { guests } = getHotelData();
    const tbody = document.querySelector('#guests-page table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = guests.filter(g =>
        g.name.toLowerCase().includes(filterText.toLowerCase()) ||
        g.email.toLowerCase().includes(filterText.toLowerCase()) ||
        g.phone.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach(g => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${g.id}</td>
            <td>${g.name}</td>
            <td>${g.email}</td>
            <td>${g.phone}</td>
            <td>${g.notes}</td>
            <td class="action-cell">
                <button class="action-btn edit-guest" data-id="${g.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-guest" data-id="${g.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachGuestActionListeners();
}
function attachGuestActionListeners() {
    document.querySelectorAll('.edit-guest').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            openGuestModal('edit', parseInt(id));
        });
    });

    document.querySelectorAll('.delete-guest').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            if (confirm("Are you sure you want to delete this guest?")) {
                const data = getHotelData();
                data.guests = data.guests.filter(g => g.id !== id);
                saveHotelData(data);
                loadGuestsData();
            }
        });
    });
}


function loadRoomsData(filterText = '') {
    const { rooms } = getHotelData();
    const tbody = document.querySelector('#rooms-page table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = rooms.filter(r =>
        r.type.toLowerCase().includes(filterText.toLowerCase()) ||
        r.status.toLowerCase().includes(filterText.toLowerCase()) ||
        (r.currentGuest && r.currentGuest.toLowerCase().includes(filterText.toLowerCase()))
    );

    filtered.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${r.id}</td>
            <td>${r.type}</td>
            <td><span class="status-badge ${r.status}">${capitalize(r.status)}</span></td>
            <td>${r.currentGuest || '-'}</td>
            <td>${r.rate}</td>
        `;
        tbody.appendChild(row);
    });
}



// ========== HOTEL OPERATIONS FUNCTIONS ==========
function checkInGuest(guestName) {
    const hotelData = getHotelData();
    
    // Find the guest
    const guest = hotelData.guests.find(g => g.name === guestName);
    if (!guest) {
        alert(`Guest ${guestName} not found.`);
        return;
    }
    
    // Find the booking
    const booking = hotelData.bookings.find(b => 
        b.guestId === guest.id && 
        b.status === 'confirmed' && 
        new Date(b.checkIn).toDateString() === new Date().toDateString()
    );
    
    if (!booking) {
        alert(`No confirmed booking found for ${guestName} today.`);
        return;
    }
    
    // Update booking status
    booking.status = 'checked-in';
    
    // Update room status
    const room = hotelData.rooms.find(r => r.id === booking.roomId);
    if (room) {
        room.status = 'occupied';
        room.currentGuest = guest.name;
    }
    
    // Save updated data
    saveHotelData(hotelData);
    
    // Refresh the dashboard
    loadDashboardData();
    
    alert(`${guestName} has been checked in to Room ${booking.roomId}.`);
}

function checkOutGuest(guestName) {
    const hotelData = getHotelData();
    
    // Find the guest
    const guest = hotelData.guests.find(g => g.name === guestName);
    if (!guest) {
        alert(`Guest ${guestName} not found.`);
        return;
    }
    
    // Find the booking
    const booking = hotelData.bookings.find(b => 
        b.guestId === guest.id && 
        b.status === 'checked-in' && 
        new Date(b.checkOut).toDateString() === new Date().toDateString()
    );
    
    if (!booking) {
        alert(`No active booking found for ${guestName} to check out today.`);
        return;
    }
    
    // Update booking status
    booking.status = 'checked-out';
    
    // Update room status
    const room = hotelData.rooms.find(r => r.id === booking.roomId);
    if (room) {
        room.status = 'cleaning';
        room.currentGuest = null;
    }
    
    // Save updated data
    saveHotelData(hotelData);
    
    // Refresh the dashboard
    loadDashboardData();
    
    alert(`${guestName} has been checked out from Room ${booking.roomId}.`);
}

function completeRequest(requestElement) {
    const requestText = requestElement.querySelector('.guest-name').textContent;
    const roomNumberMatch = requestText.match(/Room (\d+)/);
    
    if (!roomNumberMatch) {
        alert("Could not identify room number for this request.");
        return;
    }
    
    const roomNumber = parseInt(roomNumberMatch[1]);
    const requestDescription = requestText.split('-')[1].trim();
    
    const hotelData = getHotelData();
    
    // Find the request
    const requestIndex = hotelData.requests.findIndex(r => 
        r.roomId === roomNumber && 
        r.description.includes(requestDescription)
    );
    
    if (requestIndex === -1) {
        alert("Request not found in the system.");
        return;
    }
    
    // Remove the request (or mark as completed)
    hotelData.requests.splice(requestIndex, 1);
    
    // Save updated data
    saveHotelData(hotelData);
    
    // Refresh the dashboard
    loadDashboardData();
    
    alert(`Request for Room ${roomNumber} (${requestDescription}) has been completed.`);
}

// ========== HELPER FUNCTIONS ==========
function updateRoomStatusGrid(rooms) {
    const grid = document.querySelector('.room-status-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear old

    rooms.slice(0, 8).forEach(room => {
        const div = document.createElement('div');
        div.className = 'room-item';
        div.innerHTML = `
            <div class="room-number">${room.id}</div>
            <div class="room-type">${room.type}</div>
            <div class="room-status status-${room.status}">${capitalize(room.status)}</div>
        `;
        grid.appendChild(div);
    });
}


function updateArrivalsList(bookings, guests) {
    const arrivalsList = document.querySelector('#dashboard-page .upcoming-section:nth-of-type(1) .guest-list');
    if (!arrivalsList) return;

    arrivalsList.innerHTML = ''; // Clear old list

    const today = new Date().toISOString().split("T")[0];

    bookings.filter(b => b.checkIn === today && b.status === 'confirmed').forEach(b => {
        const guest = guests.find(g => g.id === b.guestId);
        const room = b.roomId;
        const roomObj = getHotelData().rooms.find(r => r.id === room);
        const li = document.createElement('li');
        li.className = 'guest-item';
        li.innerHTML = `
            <div class="guest-info">
                <div class="guest-name">${guest.name}</div>
                <div class="guest-details">Arrival: -- | Room: ${room} (${roomObj?.type || 'Room'})</div>
            </div>
            <button class="guest-action">Check In</button>
        `;
        arrivalsList.appendChild(li);
    });

    initializeActionListeners();
}


function updateDeparturesList(bookings, guests) {
    const departuresList = document.querySelector('#dashboard-page .upcoming-section:nth-of-type(2) .guest-list');
    if (!departuresList) return;

    departuresList.innerHTML = '';

    const today = new Date().toISOString().split("T")[0];

    bookings.filter(b => b.checkOut === today && b.status === 'checked-in').forEach(b => {
        const guest = guests.find(g => g.id === b.guestId);
        const room = b.roomId;
        const roomObj = getHotelData().rooms.find(r => r.id === room);
        const li = document.createElement('li');
        li.className = 'guest-item';
        li.innerHTML = `
            <div class="guest-info">
                <div class="guest-name">${guest.name}</div>
                <div class="guest-details">Departure: -- | Room: ${room} (${roomObj?.type || 'Room'})</div>
            </div>
            <button class="guest-action">Check Out</button>
        `;
        departuresList.appendChild(li);
    });

    initializeActionListeners();
}

function updateRequestsList(requests) {
    const requestList = document.querySelector('#dashboard-page .upcoming-section:nth-of-type(2) .guest-list:last-of-type');
    if (!requestList) return;

    requestList.innerHTML = '';

    requests.forEach(r => {
        const li = document.createElement('li');
        li.className = 'guest-item';
        li.innerHTML = `
            <div class="guest-info">
                <div class="guest-name">Room ${r.roomId} - ${r.description}</div>
                <div class="guest-details">Requested: ${new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Priority: ${capitalize(r.priority)}</div>
            </div>
            <button class="guest-action">Complete</button>
        `;
        requestList.appendChild(li);
    });

    initializeActionListeners();
}


function updateDashboardStats(hotelData) {
    // Calculate real stats
    const totalRooms = hotelData.rooms.length;
    const occupiedRooms = hotelData.rooms.filter(r => r.status === 'occupied').length;
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
    
    // Update the DOM
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = `${occupancyRate}%`;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = `${occupiedRooms}/${totalRooms}`;
    
    // For revenue and other stats, in a real system these would be calculated from actual data
}

function addBookingActionListeners() {
    // Edit booking buttons
    document.querySelectorAll('.edit-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            editBooking(bookingId);
        });
    });
    
    // Check-in booking buttons
    document.querySelectorAll('.check-in-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            checkInBooking(bookingId);
        });
    });
    
    // Check-out booking buttons
    document.querySelectorAll('.check-out-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            checkOutBooking(bookingId);
        });
    });
}

function editBooking(bookingId) {
    // Open edit booking modal with booking data
    alert(`Edit booking ${bookingId} (modal would open in full implementation)`);
}

function checkInBooking(bookingId) {
    const hotelData = getHotelData();
    
    // Find the booking
    const booking = hotelData.bookings.find(b => b.id == bookingId);
    if (!booking) {
        alert(`Booking #${bookingId} not found.`);
        return;
    }
    
    // Find the guest
    const guest = hotelData.guests.find(g => g.id === booking.guestId);
    if (!guest) {
        alert(`Guest for booking #${bookingId} not found.`);
        return;
    }
    
    // Find the room
    const room = hotelData.rooms.find(r => r.id === booking.roomId);
    if (!room) {
        alert(`Room for booking #${bookingId} not found.`);
        return;
    }
    
    // Update booking status
    booking.status = 'checked-in';
    
    // Update room status
    room.status = 'occupied';
    room.currentGuest = guest.name;
    
    // Save updated data
    saveHotelData(hotelData);
    
    // Refresh the bookings page
    loadBookingsData();
    
    alert(`${guest.name} has been checked in to Room ${room.id}.`);
}

function checkOutBooking(bookingId) {
    const hotelData = getHotelData();
    
    // Find the booking
    const booking = hotelData.bookings.find(b => b.id == bookingId);
    if (!booking) {
        alert(`Booking #${bookingId} not found.`);
        return;
    }
    
    // Find the guest
    const guest = hotelData.guests.find(g => g.id === booking.guestId);
    if (!guest) {
        alert(`Guest for booking #${bookingId} not found.`);
        return;
    }
    
    // Find the room
    const room = hotelData.rooms.find(r => r.id === booking.roomId);
    if (!room) {
        alert(`Room for booking #${bookingId} not found.`);
        return;
    }
    
    // Update booking status
    booking.status = 'checked-out';
    
    // Update room status
    room.status = 'cleaning';
    room.currentGuest = null;
    
    // Save updated data
    saveHotelData(hotelData);
    
    // Refresh the bookings page
    loadBookingsData();
    
    alert(`${guest.name} has been checked out from Room ${room.id}.`);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ');
}

// Add new booking function
function addNewBooking(formData) {
    const hotelData = getHotelData();
    
    const newBooking = {
        id: hotelData.nextIds.bookings++,
        guestId: parseInt(formData.guestId),
        roomId: parseInt(formData.roomId),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        status: 'confirmed',
        totalAmount: calculateTotalAmount(formData.roomId, formData.checkIn, formData.checkOut),
        paymentStatus: 'pending'
    };
    
    // Add new booking
    hotelData.bookings.push(newBooking);
    
    // Update room status to reserved
    const room = hotelData.rooms.find(r => r.id === newBooking.roomId);
    if (room && room.status === 'available') {
        room.status = 'reserved';
    }
    
    // Save updated data
    saveHotelData(hotelData);
    
    // If we're on the bookings page, refresh it
    if (document.getElementById('bookings-page').style.display !== 'none') {
        loadBookingsData();
    }
    
    return newBooking;
}

function calculateTotalAmount(roomId, checkIn, checkOut) {
    const hotelData = getHotelData();
    const room = hotelData.rooms.find(r => r.id === parseInt(roomId));
    
    if (!room) return 0;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    return room.rate * nights;
    
}

// Add new guest function
function addNewGuest(formData) {
    const hotelData = getHotelData();
    
    const newGuest = {
        id: hotelData.nextIds.guests++,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes || ''
    };
    
    // Add new guest
    hotelData.guests.push(newGuest);
    
    // Save updated data
    saveHotelData(hotelData);
    
    return newGuest;
}

// Add new request function
function addNewRequest(formData) {
    const hotelData = getHotelData();
    
    const newRequest = {
        id: hotelData.nextIds.requests++,
        roomId: parseInt(formData.roomId),
        type: formData.type,
        description: formData.description,
        status: 'pending',
        timestamp: new Date().toISOString(),
        priority: formData.priority || 'normal'
    };
    
    // Add new request
    hotelData.requests.push(newRequest);
    
    // Save updated data
    saveHotelData(hotelData);
    
    // If we're on the dashboard, refresh it
    if (document.getElementById('dashboard-page').style.display !== 'none') {
        loadDashboardData();
    }
    
    return newRequest;
}

function isRoomAvailable(roomId, checkIn, checkOut) {
    const { bookings } = getHotelData();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    return !bookings.some(b =>
        b.roomId == roomId &&
        (
            new Date(b.checkIn) < checkOutDate &&
            new Date(b.checkOut) > checkInDate &&
            b.status !== 'cancelled'
        )
    );
}
