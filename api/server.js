// api/server.js
// --- PRODUCTION VERSION ---
// This version securely reads credentials from Vercel's Environment Variables.

// Helper function to get a fresh Access Token from Google
async function getAccessToken() {
    // Securely read credentials from environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        console.error('[FATAL] One or more environment variables are missing!');
        throw new Error('Server configuration error.');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('Error fetching access token:', data);
        throw new Error('Could not retrieve access token from Google.');
    }
    return data.access_token;
}

// Main serverless function handler
export default async function handler(req, res) {
    const keyword = req.query.keyword;
    
    // Securely read IDs from environment variables
    const customerId = process.env.GOOGLE_CUSTOMER_ID;
    const developerToken = process.env.GOOGLE_DEVELOPER_TOKEN;
    const loginCustomerId = process.env.GOOGLE_LOGIN_CUSTOMER_ID;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const accessToken = await getAccessToken();

        const apiUrl = `https://googleads.googleapis.com/v17/customers/${customerId}:generateKeywordIdeas`;
        
        const apiRequestBody = {
            keywordSeed: {
                keywords: [keyword]
            },
            geoTargetConstants: ['geoTargetConstants/2364'], // Iran
            language: 'languageConstants/1031', // Persian
            keywordPlanNetwork: 'GOOGLE_SEARCH',
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'developer-token': developerToken,
                'login-customer-id': loginCustomerId,
            },
            body: JSON.stringify(apiRequestBody),
        });

        const responseData = await apiResponse.json();

        if (!apiResponse.ok) {
            console.error('Google Ads API Error:', responseData);
            const errorDetails = responseData.error?.details?.[0]?.errors?.[0]?.message || 'Failed to fetch data from Google Ads API';
            throw new Error(errorDetails);
        }
        
        const formattedResults = responseData.results.map(result => ({
            text: result.text,
            avg_monthly_searches: result.keywordIdeaMetrics.avgMonthlySearches,
            competition: result.keywordIdeaMetrics.competition,
        }));

        res.status(200).json(formattedResults);

    } catch (error) {
        console.error('[FATAL] Full Server Error:', error.message);
        res.status(500).json({ 
            error: 'An internal server error occurred.',
            details: error.message 
        });
    }
}