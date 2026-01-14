// Notification system with enhanced visual feedback
let notificationData = null;
let lastUpdateTime = new Date();

// Initialize notifications on page load
document.addEventListener("DOMContentLoaded", async () => {
    await loadNotifications();
    
    // Auto-refresh every 5 minutes
    setInterval(async () => {
        await loadNotifications();
    }, 300000); // 5 minutes
});

// Main function to load and display notifications
async function loadNotifications() {
    showLoadingState(true);
    
    try {
        const response = await fetch("/notifications-data");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        notificationData = data;
        lastUpdateTime = new Date();
        
        // Update all notification sections
        updateLowStockNotifications(data.lowStock || []);
        updateHighStockNotifications(data.highStock || []);
        updateSystemNotifications();
        
        showLoadingState(false);
        
    } catch (error) {
        console.error('Error loading notifications:', error);
        showErrorState();
        showLoadingState(false);
    }
}

// Update low stock notifications
function updateLowStockNotifications(lowStockItems) {
    const container = document.getElementById('low-stock');
    const countElement = document.getElementById('low-stock-count');
    
    if (lowStockItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-warehouse"></i>
                <p>All items are well-stocked</p>
            </div>
        `;
        countElement.textContent = '0';
    } else {
        const notificationHtml = lowStockItems.map(item => `
            <div class="notification-item">
                <div class="notification-item-icon" style="background: linear-gradient(135deg, #dc3545, #c82333); color: white;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="notification-item-content">
                    <div class="notification-item-text">${item.name}</div>
                    <div class="notification-item-meta">Only ${item.quantity} left in stock</div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = notificationHtml;
        countElement.textContent = lowStockItems.length.toString();
        
        // Add to critical notifications as well
        addToCriticalNotifications(lowStockItems, 'low-stock');
    }
}

// Update high stock notifications
function updateHighStockNotifications(highStockItems) {
    const container = document.getElementById('high-stock');
    const countElement = document.getElementById('high-stock-count');
    
    if (highStockItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar"></i>
                <p>Stock levels are normal</p>
            </div>
        `;
        countElement.textContent = '0';
    } else {
        const notificationHtml = highStockItems.map(item => `
            <div class="notification-item">
                <div class="notification-item-icon" style="background: linear-gradient(135deg, #ffc107, #e0a800); color: white;">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div class="notification-item-content">
                    <div class="notification-item-text">${item.name}</div>
                    <div class="notification-item-meta">High stock: ${item.quantity} units</div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = notificationHtml;
        countElement.textContent = highStockItems.length.toString();
        
        // Add to warning notifications
        addToWarningNotifications(highStockItems, 'high-stock');
    }
}

// Update system notifications (critical, warning, success, info)
function updateSystemNotifications() {
    // Generate some system notifications based on current time and data
    const now = new Date();
    const timeOfDay = now.getHours();
    
    // Success notifications
    const successNotifications = [
        {
            text: 'System backup completed successfully',
            meta: formatTimeAgo(new Date(now - Math.random() * 3600000))
        },
        {
            text: 'Database optimization finished',
            meta: formatTimeAgo(new Date(now - Math.random() * 7200000))
        }
    ];
    
    updateNotificationSection('success-notifications', 'success-count', successNotifications, 'success');
    
    // Info notifications
    const infoNotifications = [
        {
            text: 'System maintenance scheduled for tonight',
            meta: 'Scheduled for 02:00 AM'
        },
        {
            text: 'New inventory report available',
            meta: formatTimeAgo(lastUpdateTime)
        }
    ];
    
    updateNotificationSection('info-notifications', 'info-count', infoNotifications, 'info');
}

// Add items to critical notifications
function addToCriticalNotifications(items, type) {
    const container = document.getElementById('critical-notifications');
    const countElement = document.getElementById('critical-count');
    
    const criticalHtml = items.map(item => `
        <div class="notification-item">
            <div class="notification-item-icon" style="background: linear-gradient(135deg, #dc3545, #c82333); color: white;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="notification-item-content">
                <div class="notification-item-text">Critical: ${item.name}</div>
                <div class="notification-item-meta">Immediate attention required - Only ${item.quantity} left</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = criticalHtml || `
        <div class="empty-state">
            <i class="fas fa-shield-check"></i>
            <p>No critical alerts at this time</p>
        </div>
    `;
    
    countElement.textContent = items.length.toString();
}

// Add items to warning notifications
function addToWarningNotifications(items, type) {
    const container = document.getElementById('warning-notifications');
    const countElement = document.getElementById('warning-count');
    
    const warningHtml = items.map(item => `
        <div class="notification-item">
            <div class="notification-item-icon" style="background: linear-gradient(135deg, #ffc107, #e0a800); color: white;">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="notification-item-content">
                <div class="notification-item-text">High Stock: ${item.name}</div>
                <div class="notification-item-meta">Consider reducing orders - ${item.quantity} units available</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = warningHtml || `
        <div class="empty-state">
            <i class="fas fa-thumbs-up"></i>
            <p>No warnings to display</p>
        </div>
    `;
    
    countElement.textContent = items.length.toString();
}

// Generic function to update notification sections
function updateNotificationSection(containerId, countId, notifications, type) {
    const container = document.getElementById(containerId);
    const countElement = document.getElementById(countId);
    
    if (notifications.length === 0) {
        const emptyMessages = {
            success: { icon: 'fas fa-smile', message: 'Recent successes will appear here' },
            info: { icon: 'fas fa-info', message: 'System information updates' },
            warning: { icon: 'fas fa-thumbs-up', message: 'No warnings to display' },
            critical: { icon: 'fas fa-shield-check', message: 'No critical alerts at this time' }
        };
        
        const emptyState = emptyMessages[type] || { icon: 'fas fa-info', message: 'No notifications' };
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="${emptyState.icon}"></i>
                <p>${emptyState.message}</p>
            </div>
        `;
        countElement.textContent = '0';
    } else {
        const iconMap = {
            success: 'fas fa-check',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-circle',
            critical: 'fas fa-exclamation-triangle'
        };
        
        const colorMap = {
            success: 'linear-gradient(135deg, #28a745, #1e7e34)',
            info: 'linear-gradient(135deg, #17a2b8, #117a8b)',
            warning: 'linear-gradient(135deg, #ffc107, #e0a800)',
            critical: 'linear-gradient(135deg, #dc3545, #c82333)'
        };
        
        const notificationHtml = notifications.map(notification => `
            <div class="notification-item">
                <div class="notification-item-icon" style="background: ${colorMap[type]}; color: white;">
                    <i class="${iconMap[type]}"></i>
                </div>
                <div class="notification-item-content">
                    <div class="notification-item-text">${notification.text}</div>
                    <div class="notification-item-meta">${notification.meta}</div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = notificationHtml;
        countElement.textContent = notifications.length.toString();
    }
}

// Show/hide loading state
function showLoadingState(show) {
    const loadingElement = document.getElementById('loading-state');
    const mainElement = document.getElementById('notifications-main');
    
    if (show) {
        loadingElement.style.display = 'flex';
        mainElement.style.display = 'none';
    } else {
        loadingElement.style.display = 'none';
        mainElement.style.display = 'grid';
    }
}

// Show error state
function showErrorState() {
    const containers = [
        'critical-notifications',
        'warning-notifications', 
        'success-notifications',
        'info-notifications',
        'low-stock',
        'high-stock'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
                    <p style="color: #dc3545;">Error loading notifications</p>
                </div>
            `;
        }
    });
    
    // Reset all counts
    const counts = [
        'critical-count',
        'warning-count',
        'success-count',
        'info-count',
        'low-stock-count',
        'high-stock-count'
    ];
    
    counts.forEach(countId => {
        const element = document.getElementById(countId);
        if (element) {
            element.textContent = '0';
        }
    });
}

// Utility function to format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

// Export the loadNotifications function for use by refresh button
if (typeof window !== 'undefined') {
    window.loadNotifications = loadNotifications;
}
