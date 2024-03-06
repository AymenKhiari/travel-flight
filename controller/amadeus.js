import Amadeus from 'amadeus';


import dotenv from 'dotenv';
dotenv.config();




// Create an instance of the Amadeus client
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  });

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

    // Construct the parameters object for the Amadeus SDK
    const params = {
      subType,
      keyword,
      page: { limit, offset },
      sort,
      view,
    };

    // Make the API request using the Amadeus SDK
    const response = await amadeus.referenceData.locations.get(params);

    const responseData = response.data;

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
        console.log(formattedItem.iata);
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
