/**
 * Generates a Google Calendar link for an event
 */
export const generateGoogleCalendarLink = (event) => {
    const { title, description, location, date, time } = event;
    
    // Parse date and time to ISO format for Google Calendar (YYYYMMDDTHHMMSSZ)
    // Assuming date is in 'YYYY-MM-DD' and time is in 'HH:mm'
    // This is a simplified version, real-world might need more robust parsing
    const startDateTime = new Date(`${date}T${time}:00`).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDateTime = new Date(new Date(`${date}T${time}:00`).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ''); // Default 2 hours duration

    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
        text: title,
        dates: `${startDateTime}/${endDateTime}`,
        details: description,
        location: location,
        sf: 'true',
        output: 'xml'
    });

    return `${baseUrl}&${params.toString()}`;
};
