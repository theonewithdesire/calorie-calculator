// Function to get visitor's IP and send to webhook
async function logVisitorIP() {
    try {
        // Use api.ipify.org with JSONP to avoid CORS issues
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        
        // Prepare minimal data to send to webhook
        const visitorData = {
            ip: data.ip,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            page: window.location.href
        };

        // Send to webhook
        await fetch('https://webhook.site/f3c2acd8-51fb-456e-9b77-a8a3628b49af', {
            method: 'POST',
            mode: 'no-cors', // Add this to avoid CORS issues
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitorData)
        });
    } catch (error) {
        console.error('IP logging error:', error);
    }
}

// Log IP when page loads
logVisitorIP();

// Also log on page visibility change (when user returns to the page)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        logVisitorIP();
    }
}); 