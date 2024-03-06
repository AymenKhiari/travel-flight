import axios from 'axios';

export async function getLocations(request, reply) {
    console.log("zok om hal 3icha");

    try {
        // Check if request.query is defined and has the expected structure
        const query = request.query;
        console.log(query);

        // Provide default values for static parameters
        const staticParams = {
            subType: 'CITY,AIRPORT',
            offset: '0',
            limit: '100',
            sort: 'analytics.travelers.score',
            view: 'FULL',
        };

        // Destructure static parameters
        const { subType, offset, limit, sort, view } = staticParams;

        // Make keyword dynamic
        const keyword = query.keyword || '';

        // Construct the URL with query parameters
        const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=${subType}&keyword=${keyword}&page%5Blimit%5D=${limit}&page%5Boffset%5D=${offset}&sort=${sort}&view=${view}`;
        console.log(url);

        // Include authorization headers
        const accessToken = 'Zgeaptj0bMWojfc39Ag9l2MOGRKM';

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
        };

        // Make the API request using Axios
        const response = await axios.get(url, { headers });

        const responseData = response.data.data;

        // Create a Set to store unique iata values
        const uniqueIatas = new Set();

        // Create the array of formatted response objects
        const formattedResponses = responseData.reduce((uniqueFormattedResponses, item) => {
            const formattedItem = {
                name: `${item.address.countryName}, ${item.address.cityName}`,
                iata: item.iataCode,
            };

            // Check if the iata code is unique, and add it to the array and set if it is
            if (!uniqueIatas.has(formattedItem.iata)) {
                uniqueIatas.add(formattedItem.iata);
                uniqueFormattedResponses.push(formattedItem);
            }

            return uniqueFormattedResponses;
        }, []);

        // Return the formatted response
        return formattedResponses;
    } catch (error) {
        // Handle errors here
        console.error('Error:', error.message);
        throw new Error('Internal Server Error');
    }
}
