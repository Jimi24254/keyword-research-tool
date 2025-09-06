    // generate_new_token.js
    // A utility script to generate a new Google OAuth refresh token.
    
    import { OAuth2Client } from 'google-auth-library';
    import * as readline from 'node:readline/promises';
    import { stdin as input, stdout as output } from 'node:process';
    
    const SCOPES = ['https://www.googleapis.com/auth/adwords'];
    
    async function main() {
        console.log('--- New Refresh Token Generation Utility ---');
        const rl = readline.createInterface({ input, output });
    
        try {
            const clientId = await rl.question('Enter your Client ID: ');
            const clientSecret = await rl.question('Enter your Client Secret: ');
    
            const oauth2Client = new OAuth2Client(clientId, clientSecret, 'urn:ietf:wg:oauth:2.0:oob');
    
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
                prompt: 'consent', // Force a new refresh token to be issued
            });
    
            console.log('\n1. Open this URL in your browser:\n');
            console.log(authUrl);
            console.log('\n2. After you grant access, you will be given an authorization code.');
            const code = await rl.question('3. Enter that code here: ');
    
            console.log('\nGenerating tokens...');
            const { tokens } = await oauth2Client.getToken(code);
    
            if (tokens.refresh_token) {
                console.log('\n✅ Success! Here is your new Refresh Token:\n');
                console.log(tokens.refresh_token);
                console.log('\nCopy this new token and update the GOOGLE_REFRESH_TOKEN variable in your Vercel project settings.');
            } else {
                console.error('\n❌ Error: A new refresh token was not provided. This can happen if you have already authorized this app.');
                console.log('To fix this, go to your Google Account permissions (https://myaccount.google.com/permissions) and remove access for "keywordtool", then run this script again.');
            }
    
        } catch (error) {
            console.error('\nAn error occurred:', error.message);
        } finally {
            rl.close();
        }
    }
    
    main();
    
