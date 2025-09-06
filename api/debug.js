// api/debug.js
// This is a safe debugging endpoint to verify that environment variables are loaded correctly in Vercel.
// It only checks for the existence and length of variables, not their actual values, to maintain security.

export default function handler(req, res) {
    try {
        const envVars = {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
            GOOGLE_DEVELOPER_TOKEN: process.env.GOOGLE_DEVELOPER_TOKEN,
            GOOGLE_LOGIN_CUSTOMER_ID: process.env.GOOGLE_LOGIN_CUSTOMER_ID,
            GOOGLE_CUSTOMER_ID: process.env.GOOGLE_CUSTOMER_ID,
        };

        const report = {};
        for (const key in envVars) {
            const value = envVars[key];
            if (value && typeof value === 'string' && value.length > 0) {
                report[key] = {
                    status: 'OK',
                    length: value.length,
                    type: typeof value,
                };
            } else {
                report[key] = {
                    status: 'MISSING or EMPTY',
                    value: value,
                    type: typeof value,
                };
            }
        }

        res.status(200).json({
            message: 'Environment Variable Status Report',
            report: report,
        });

    } catch (error) {
        res.status(500).json({
            error: 'An unexpected error occurred while checking environment variables.',
            details: error.message,
        });
    }
}
