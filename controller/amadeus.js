import axios from 'axios';

export async function getLocations(request, reply) {
    try {
        // Check if request.query is defined and has the expected structure
        const query = request.query;
        console.log(query);

        // Provide default values for static parameters
        const staticParams = {
            subType: 'CITY',
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
        const apiKey = 'P6xVsGYRZ9yX7engwCIX8deywwE8';
        const apiSecret = 'JyyNGaFORKrBaXbC';
        const accessToken = 'CuhGD4ehCM4sMigbclBRxZgqC0sJ';

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
        };

        // Make the API request using Axios
        const response = await axios.get(url, { headers });

        const responseData = response.data.data;

        // Create the array of formatted response objects
        const formattedResponses = responseData.map(item => ({
            name: `${item.address.countryName}, ${item.address.cityName}`,
            iata: item.iataCode,
        }));

        // Return the formatted response
        return formattedResponses;;
    } catch (error) {
        // Handle errors here
        console.error('Error:', error.message);
        throw new Error('Internal Server Error');
    }
}
