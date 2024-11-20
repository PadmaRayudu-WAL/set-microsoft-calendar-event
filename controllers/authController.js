const msal = require('@azure/msal-node');
const axios = require('axios');

const cca = new msal.ConfidentialClientApplication( {auth: {
  clientId: process.env.CLIENT_ID,
  authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
  clientSecret: process.env.CLIENT_SECRET
}});

// Step 1: Redirect user to authentication URL
exports.getAuthUrl = async (req, res) => {
    try {
        const authUrl = await cca.getAuthCodeUrl({
            redirectUri: 'http://localhost:3000/auth/callback',
            scopes: ['user.read', 'Calendars.ReadWrite']
        });
        res.redirect(authUrl);  // Redirect user to login page
    } catch (error) {
        res.status(500).send('Error getting authorization URL: ' + error.message);
    }
};

// Step 2: Handle the callback and exchange code for token
exports.handleAuthCallback = async (req, res) => {
  const code = req.query.code;

    try {
        const tokenResponse = await cca.acquireTokenByCode({
            code,
            redirectUri: 'http://localhost:3000/auth/callback',
            scopes: ['user.read', 'Calendars.ReadWrite']
        });
      const accessToken = tokenResponse.accessToken;  // Save token in session
  
      const response = await axios.post(
        'https://graph.microsoft.com/v1.0/me/calendar/events',
        {
            subject: 'Meeting with Supriyaa',
            start: {
                dateTime: '2024-11-25T10:00:00',
                timeZone: 'UTC'
            },
            end: {
                dateTime: '2024-11-19T11:00:00',
                timeZone: 'UTC'
            },
            attendees: [
                {
                    emailAddress: {
                        address: 'devika.p@veltris.com',
                        name: 'devi'
                    },
                    type: 'required'  // Specify 'required' or 'optional' as needed
                },
                {
                    emailAddress: {
                        address: 'samatha.g@veltris.com',
                        name: 'samatha'
                    },
                    type: 'required'
                }
            ],
            location: {
                displayName: 'Virtual Meeting'
            },
            isOnlineMeeting: true,  // Optional: Include if you want to create a Teams meeting link
            onlineMeetingProvider: 'teamsForBusiness'  // Optional: Specify Teams as the provider
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    );


      console.log('Event created:', response.data);
        res.send('successfully! created events.');
    } catch (error) {
        res.status(500).send('Error exchanging code for token: ' + error.message);
    }
};
