// /services/calendarService.js
const axios = require('axios');

exports.createEvent = async (accessToken) => {
    try {
        const response = await axios.post('https://graph.microsoft.com/v1.0/me/calendar/events', {
            subject: 'Meeting with Bob',
            start: {
                dateTime: '2024-11-15T10:00:00',
                timeZone: 'UTC'
            },
            end: {
                dateTime: '2024-11-15T11:00:00',
                timeZone: 'UTC'
            }
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;  // Return created event data
    } catch (error) {
        throw new Error('Error creating event: ' + error.message);
    }
};
