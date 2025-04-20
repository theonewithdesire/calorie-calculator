// Function to get visitor's IP and send to webhook
async function logVisitorIP() {
    try {
        // First get the IP from ipapi.co (free public IP API)
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        
        // Prepare the data to send to webhook
        const visitorData = {
            ip: ipData.ip,
            city: ipData.city,
            region: ipData.region,
            country: ipData.country_name,
            timezone: ipData.timezone,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            page: window.location.href
        };

        // Send to your webhook
        await fetch('https://webhook.site/f3c2acd8-51fb-456e-9b77-a8a3628b49af', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitorData)
        });
    } catch (error) {
        console.error('IP logging error:', error);
    }
}

// Log IP immediately when script loads
logVisitorIP(); 