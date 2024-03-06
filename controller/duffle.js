import { Duffel } from '@duffel/api';

const duffel = new Duffel({
  token: "duffel_test__mvE8NkTpFEyb1gj6tjLyGOtg7L0pKdcBrkB2D74qdR"
  //token: process.env.SECRET_DUFFLE
});

export async function createUniqueDestinationOfferRequest(request, reply) {
  // Accessing parameters from request body instead of query
  const {
    startDate,
    endDate,
    departureOrigin,
    departureDestination,
    returnOrigin,
    returnDestination,
    cabinClass,
    passengerType, // This should match the JSON key you are sending
  } = request.body;
  // Processing and validating inputs
  const departureOriginUpper = departureOrigin.toUpperCase();
  const departureDestinationUpper = departureDestination.toUpperCase();
  const returnOriginUpper = returnOrigin.toUpperCase();
  const returnDestinationUpper = returnDestination.toUpperCase();
  const cabinClassLower = cabinClass ? cabinClass.toLowerCase() : '';
  const passengerTypeLower = passengerType ? passengerType.toLowerCase() : '';

  console.log("passengerTypeLower", passengerTypeLower);

  // Validate cabinClass
  if (!["economy", "business", "first", "premium_economy", ""].includes(cabinClassLower)) {
    return reply.status(400).send({ error: 'Invalid cabin class type' });
  }

  // Validate passenger type
  if (!["adult", "child", "infant_without_seat"].includes(passengerTypeLower)) {
    return reply.status(400).send({ error: 'Invalid passenger type' });
  }

  try {
    const offerRequest = await duffel.offerRequests.create({
      slices: [
        {
          origin: departureOriginUpper,
          destination: departureDestinationUpper,
          departure_date: startDate
        },
        {
          origin: returnOriginUpper,
          destination: returnDestinationUpper,
          departure_date: endDate
        }
      ],
      passengers: [{ type: passengerTypeLower }],
      cabin_class: cabinClassLower,
      sort_by: "total_amount",
      limit: 20
    });
    const queryResult = offerRequest.data.offers;
  
    const transformedData = queryResult.map(item => ({
      id: item.id,
      price: `$${item.total_amount}`,
      airlines: {
        logo: item.slices[0].segments[0].operating_carrier.logo_symbol_url,
        name: item.slices[0].segments[0].operating_carrier.name,
      },
      departureOrigin: item.slices[0].origin.iata_code,
      departureDestination: item.slices[0].destination.iata_code,
      returnOrigin: item.slices[1].origin.iata_code,
      returnDestination: item.slices[1].destination.iata_code,
      departureAirportOriginName: item.slices[0].origin.name,
      departureAirportDestinationName: item.slices[0].destination.name,
      departureAircraft: item.slices[0].segments[0].aircraft.name,
      departureOperatingIataCode: item.slices[0].segments[0].operating_carrier.iata_code,
      departureOperatingCarrierFlightNumber: item.slices[0].segments[0].operating_carrier_flight_number,
      departureClass: item.slices[0].segments[0].passengers[0].cabin_class_marketing_name,
      departureDepartingAt: item.slices[0].segments[0].departing_at,
      departureArrivingAt: item.slices[0].segments[0].arriving_at,
      returnAirportOriginName: item.slices[1].origin.name,
      returnAirportDestinationName: item.slices[1].destination.name,
      returnAircraft: item.slices[1].segments[0].aircraft.name,
      returnOperatingIataCode: item.slices[1].segments[0].operating_carrier.iata_code,
      returnOperatingCarrierFlightNumber: item.slices[1].segments[0].operating_carrier_flight_number,
      returnClass: item.slices[1].segments[0].passengers[0].cabin_class_marketing_name,
      returnDepartingAt: item.slices[1].segments[0].departing_at,
      returnArrivingAt: item.slices[1].segments[0].arriving_at,
    }));
  
    const sortedData = transformedData.sort((a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)));
    console.log(sortedData.slice(0, 20))
    reply.send(sortedData.slice(0, 20));
  
  } catch (error) {
    console.error('Error creating offer request:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
}  
