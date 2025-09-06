// api/keywords.js
// --- FINAL DEBUGGING STEP (RENAMED) ---
// This version bypasses the actual `fetch` calls to confirm if the rest of the code can execute.

async function getAccessToken_mock() {
    console.log('[DEBUG] MOCK getAccessToken called. Simulating success.');
    // Return a fake token to allow the code to proceed.
    return 'mock_access_token_for_testing';
}

// Main serverless function handler
export default async function handler(req, res) {
    console.log(`[DEBUG] Handler started for keyword: ${req.query.keyword}`);
    
    const keyword = req.query.keyword;

    if (!keyword) {
        console.log('[DEBUG] Keyword is missing, returning 400.');
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        // Use the mocked function instead of the real one
        const accessToken = await getAccessToken_mock();
        console.log(`[DEBUG] Mock access token received: ${accessToken}`);
        
        // --- Bypassing the second fetch call ---
        console.log('[DEBUG] Bypassing the Google Ads API fetch call and returning mock data.');

        const mockResults = [
            { text: `Mock result for "${keyword}"`, avg_monthly_searches: 1000, competition: 'MEDIUM' },
            { text: `Related mock keyword 1`, avg_monthly_searches: 500, competition: 'LOW' },
            { text: `Related mock keyword 2`, avg_monthly_searches: 200, competition: 'HIGH' },
        ];
        
        // Return the mocked results
        res.status(200).json(mockResults);

    } catch (error) {
        // This part should not be reached if the mock is working
        console.error('[FATAL] Full Server Error (in mock setup):', error.message);
        res.status(500).json({ 
            error: 'An internal server error occurred in the mock setup.',
            details: error.message 
        });
    }
}
