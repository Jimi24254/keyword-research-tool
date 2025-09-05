const { GoogleAdsApi, enums } = require('google-ads-api');

// This is a Vercel serverless function
export default async function handler(req, res) {
    // Read configuration from Vercel Environment Variables
    const config = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        login_customer_id: process.env.GOOGLE_LOGIN_CUSTOMER_ID,
    };

    const customerId = process.env.GOOGLE_CUSTOMER_ID;
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const client = new GoogleAdsApi(config);
        const customer = client.Customer(customerId);

        const results = await customer.keywordPlanIdeas.generateKeywordIdeas({
            customer_id: customerId,
            keyword_seed: {
                keywords: [keyword]
            },
            geo_target_constants: ['geoTargetConstants/2364'], // Iran
            language: 'languageConstants/1031', // Persian
            keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
        });
        
        const formattedResults = results.map(result => {
            const metrics = result.keyword_idea_metrics;
            return {
                text: result.text,
                avg_monthly_searches: metrics.avg_monthly_searches,
                competition: enums.KeywordPlanCompetitionLevel[metrics.competition],
                competition_index: metrics.competition_index,
                low_top_of_page_bid_micros: metrics.low_top_of_page_bid_micros,
                high_top_of_page_bid_micros: metrics.high_top_of_page_bid_micros,
            };
        });
        
        res.status(200).json(formattedResults);

    } catch (error) {
        console.error('Full API Error:', JSON.stringify(error, null, 2));
        const errorDetails = error.errors ? error.errors[0].message : "An unknown error occurred";
        res.status(500).json({ 
            error: 'Failed to fetch data from Google Ads API', 
            details: errorDetails 
        });
    }
}
