const { OAuth2Client } = require('google-auth-library');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

// This is the standard redirect URI for desktop applications
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

async function main() {
    try {
        console.log("--- Refresh Token Generation Utility ---");
        
        const client_id = await question('Enter your Client ID: ');
        if (!client_id) throw new Error('Client ID is required.');

        const client_secret = await question('Enter your Client Secret: ');
        if (!client_secret) throw new Error('Client Secret is required.');
        
        // Create a new OAuth2 client with the credentials
        const oAuth2Client = new OAuth2Client(
            client_id,
            client_secret,
            REDIRECT_URI
        );

        // Generate the authentication URL
        const auth_url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/adwords'],
            prompt: 'consent' // This ensures you get a refresh token every time
        });

        console.log("\n1. Open this URL in your browser:\n");
        console.log(auth_url);
        console.log("\n2. After you grant access, you will be redirected to a page with an authorization code.");
        
        const code = await question('3. Enter that code here: ');
        if (!code) throw new Error('Authorization code is required.');

        // Exchange the authorization code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        const refresh_token = tokens.refresh_token;

        if (!refresh_token) {
            throw new Error("Failed to retrieve refresh token. You may have already authorized this app. Try revoking access in your Google account settings and run the script again.");
        }

        console.log("\n✅ Success! Here is your Refresh Token:\n");
        console.log(refresh_token);
        console.log("\nCopy this token and paste it into your server.js file.");

    } catch (error) {
        console.error("An error occurred:", error.message);
        if(error.response) console.error("Details:", error.response.data);
    } finally {
        rl.close();
    }
}

main();

