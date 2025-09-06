// generate_new_token.js
// A utility script to generate a new Google OAuth refresh token for a "Web application" client.

import { OAuth2Client } from 'google-auth-library';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const SCOPES = ['https://www.googleapis.com/auth/adwords'];

async function main() {
    console.log('--- New Refresh Token Generation Utility (for Web App) ---');
    const rl = readline.createInterface({ input, output });

    try {
        const clientId = await rl.question('Enter your NEW "Web application" Client ID: ');
        const clientSecret = await rl.question('Enter your NEW "Web application" Client Secret: ');

        // --- FIX APPLIED HERE ---
        // Using http://localhost as the redirect URI, which must be authorized in Google Cloud Console.
        const oauth2Client = new OAuth2Client(clientId, clientSecret, 'http://localhost');

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent', // Force a new refresh token to be issued
        });

        console.log('\n1. Open this URL in your browser:\n');
        console.log(authUrl);
        console.log('\n--- IMPORTANT INSTRUCTIONS ---');
        console.log('2. After you grant access, your browser will be redirected to a page that says "This site can’t be reached". THIS IS NORMAL.');
        console.log('3. Copy the ENTIRE URL from your browser\'s address bar.');
        const redirectedUrl = await rl.question('4. Paste the full URL here: ');

        // Extract the authorization code from the URL
        const code = new URL(redirectedUrl).searchParams.get('code');
        if (!code) {
            throw new Error('Could not find authorization code in the URL.');
        }

        console.log('\nGenerating tokens...');
        const { tokens } = await oauth2Client.getToken(code);

        if (tokens.refresh_token) {
            console.log('\n✅ Success! Here is your new Refresh Token:\n');
            console.log(tokens.refresh_token);
            console.log('\nCopy this new token and update the GOOGLE_REFRESH_TOKEN variable in your Vercel project settings.');
        } else {
            console.error('\n❌ Error: A new refresh token was not provided.');
        }

    } catch (error) {
        console.error('\nAn error occurred:', error.message);
    } finally {
        rl.close();
    }
}

main();

