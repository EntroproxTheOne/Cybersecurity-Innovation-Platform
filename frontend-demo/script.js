// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Sidebar Toggle for Dashboard
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

if (sidebarToggle && sidebar && mainContent) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-collapsed');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Demo Data for Dashboard
const demoData = {
    threats: [
        {
            id: 1,
            title: 'Ransomware Attack',
            description: 'Network Segment A - 192.168.1.100',
            severity: 'critical',
            type: 'Malware',
            source: 'Internal Network',
            status: 'active',
            detected: '2 min ago'
        },
        {
            id: 2,
            title: 'Phishing Campaign',
            description: 'Email Gateway - suspicious@example.com',
            severity: 'high',
            type: 'Phishing',
            source: 'Email Gateway',
            status: 'investigating',
            detected: '15 min ago'
        },
        {
            id: 3,
            title: 'DDoS Attack',
            description: 'Web Server - 203.0.113.1',
            severity: 'medium',
            type: 'DDoS',
            source: 'External IP',
            status: 'resolved',
            detected: '1 hour ago'
        }
    ],
    stats: {
        threatsBlocked: 1247,
        activeThreats: 23,
        activeUsers: 156,
        avgResponseTime: 0.1
    }
};

// Update Stats with Animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize Dashboard Animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats on dashboard load
    const statNumbers = document.querySelectorAll('.stat-content h3');
    statNumbers.forEach((stat, index) => {
        const values = [1247, 23, 156, 0.1];
        if (values[index] !== undefined) {
            animateValue(stat, 0, values[index], 2000);
        }
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .dashboard-card, .stat-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        });
    });
});

// Search Functionality
const searchInputs = document.querySelectorAll('input[type="text"]');
searchInputs.forEach(input => {
    input.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const table = this.closest('.main-content')?.querySelector('.threats-table');
        
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }
    });
});

// Filter Functionality
const filterSelects = document.querySelectorAll('.filter-select');
filterSelects.forEach(select => {
    select.addEventListener('change', function() {
        applyFilters();
    });
});

function applyFilters() {
    const severityFilter = document.querySelector('select[value*="severity"]')?.value;
    const statusFilter = document.querySelector('select[value*="status"]')?.value;
    const typeFilter = document.querySelector('select[value*="type"]')?.value;
    
    const rows = document.querySelectorAll('.threats-table tbody tr');
    rows.forEach(row => {
        let show = true;
        
        if (severityFilter && !row.querySelector(`.severity-badge.${severityFilter}`)) {
            show = false;
        }
        
        if (statusFilter && !row.querySelector(`.status-badge.${statusFilter}`)) {
            show = false;
        }
        
        row.style.display = show ? '' : 'none';
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-info { border-left: 4px solid #3b82f6; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #6b7280;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Demo Actions
function addThreat() {
    showNotification('Threat added successfully!', 'success');
}

function editThreat(id) {
    showNotification(`Editing threat ${id}`, 'info');
}

function resolveThreat(id) {
    showNotification(`Threat ${id} resolved!`, 'success');
}

// Add event listeners for action buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.action-btn')) {
        const action = e.target.closest('.action-btn').textContent.trim();
        if (action.includes('Add Threat')) {
            addThreat();
        }
    }
    
    if (e.target.closest('.btn-icon')) {
        const icon = e.target.closest('.btn-icon');
        const action = icon.title;
        if (action.includes('View Details')) {
            showNotification('Opening threat details...', 'info');
        } else if (action.includes('Edit')) {
            showNotification('Opening threat editor...', 'info');
        } else if (action.includes('Resolve')) {
            showNotification('Threat resolved!', 'success');
        }
    }
});

// Theme Toggle (if needed)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Real-time Updates Simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update threat count
        const threatBadge = document.querySelector('.badge');
        if (threatBadge) {
            const currentCount = parseInt(threatBadge.textContent);
            const newCount = currentCount + Math.floor(Math.random() * 3) - 1;
            threatBadge.textContent = Math.max(0, newCount);
        }
        
        // Add random timeline item
        const timeline = document.querySelector('.timeline');
        if (timeline && Math.random() < 0.1) { // 10% chance every interval
            const threats = ['Malware detected', 'Suspicious activity', 'Login attempt', 'Data breach attempt'];
            const severities = ['critical', 'high', 'medium'];
            const randomThreat = threats[Math.floor(Math.random() * threats.length)];
            const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
            
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-marker ${randomSeverity}"></div>
                <div class="timeline-content">
                    <h4>${randomThreat}</h4>
                    <p>Automated detection system</p>
                    <span class="timeline-time">Just now</span>
                </div>
            `;
            
            timeline.insertBefore(timelineItem, timeline.firstChild);
            
            // Remove old items if too many
            const items = timeline.querySelectorAll('.timeline-item');
            if (items.length > 5) {
                items[items.length - 1].remove();
            }
        }
    }, 10000); // Update every 10 seconds
}

// Start real-time simulation
simulateRealTimeUpdates();

// Export functions for global access
window.showNotification = showNotification;
window.addThreat = addThreat;
window.editThreat = editThreat;
window.resolveThreat = resolveThreat;
window.toggleTheme = toggleTheme;
