//@ts-ignore
import comboios from 'comboios';
//@ts-ignore
import NodeGeocoder from 'node-geocoder';
import busRoutes from '../bus/bus.json';
import { distance } from '../lib/utils';
import { ILatLong, ICPStations, IRoutes, IBusRoutes, IRoute } from '../interfaces/interfaces';
import { Route } from '../models/route';

const routeAPI = async (start: any, end: any, type: string): Promise<any> => {
  try {
    const cpStations: ICPStations = await comboios.stations();
    const allTargets: string[] = [];
    const cpRoutes: IRoutes = [];
    const begin = { id: '', name: '' };
    const stop = { id: '', name: '' };
    let initialPlace = start;
    let finalPlace = end;

    const geocoder = NodeGeocoder({
      provider: 'opencage',
      apiKey: process.env.OPENCAGE_API_KEY,
      language: 'pt-BR',
    });
    console.log(initialPlace, finalPlace);
    const geo = await geocoder.batchGeocode([start, end]);
    initialPlace = geo[0].value[0];
    finalPlace = geo[1].value[0];
    const distanceBetween = distance(start.lat, start.long, end.lat, end.long);

    // cpStations.forEach(async (station: IStation): Promise<void> => {
    //     allTargets.push(station.name);
    //     if (station.name.includes(initialPlace)) {
    //         begin.id = station.id;
    //         begin.name = station.name;
    //     }
    //     if (station.name.includes(finalPlace)) {
    //         stop.id = station.id;
    //         stop.name = station.name;
    //     }
    // });
    // const date: Date = new Date();

    const cpJourneys = [];
    const bdRides = await Route.find({ state: 'AVAILABLE' });
    // //  console.log(bdRides)
    bdRides.forEach((route: any) => {
      const ride: IRoute = {
        id: route.id,
        type: route.type,
        availableTime: route.availableTime,
        state: route.state,
        description: route.description,
        estimatedTime: route.estimatedTime,
        startDate: route.startDate,
        userImage: route.userImage,
        rating: route.rating,
        capacity: route.capacity,
        actualCapacity: route.actualCapacity,
        version: route.version,
        legs: [
          {
            tripId: route.id,
            origin: {
              id: route.id,
              name: route.startLocation,
            },
            destination: {
              id: route.id,
              name: route.endLocation,
            },
          },
        ],
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        originId: route.id,
        destinationId: route.id,
        price: 0,
      };

      allTargets.push(route.startLocation);
      if (route.startLocation.includes(initialPlace)) {
        begin.id = route.id;
        begin.name = route.startLocation;
      }
      if (route.endLocation.includes(finalPlace)) {
        stop.id = route.id;
        stop.name = route.endLocation;
      }
      cpRoutes.push(ride);
    });

    // // busRoutes.data.forEach((route: any) => {
    // //     const routeDate = new Date(route.date);
    // //      if (routeDate.getHours() !== date.getHours()) return

    // //     const ride: IRoute = {
    // //         id: route.id,
    // //         type: route.type,
    // //         availableTime: route.availableTime,
    // //         state: route.state,
    // //         description: route.description,
    // //         estimatedTime: route.estimatedTime,
    // //         startDate: route.startDate,
    // //         userImage: route.userImage,
    // //         rating: route.rating,
    // //         capacity: route.capacity,
    // //         actualCapacity: route.actualCapacity,
    // //         version: route.version,
    // //         legs: [
    // //             {
    // //                 tripId: route.id,
    // //                 origin: {
    // //                     id: route.id,
    // //                     name: route.startLocation,
    // //                 },
    // //                 destination: {
    // //                     id: route.id,
    // //                     name: route.endLocation,
    // //                 },
    // //             }
    // //         ],
    // //         startLocation: route.startLocation,
    // //         endLocation: route.endLocation,
    // //         originId: route.id,
    // //         destinationId: route.id,
    // //         price: 0
    // //     }

    // //     allTargets.push(route.startLocation);
    // //     if (route.startLocation.includes(initialPlace)) {
    // //         begin.id = route.id;
    // //         begin.name = route.startLocation;
    // //     }
    // //     if (route.endLocation.includes(finalPlace)) {
    // //         stop.id = route.id;
    // //         stop.name = route.endLocation;
    // //     }
    // //     cpJourneys.push(ride);
    // // })
    // //filter journeys
    // if (cpJourneys) {
    //     cpJourneys.map((journey: IRoute): void => {
    //         journey.legs?.map((leg: ILeg) => {
    //             let found = false;
    //             cpRoutes?.forEach((element: IRoute) => {
    //                 if (element.startLocation === leg.origin.name && element.endLocation === leg.destination.name) {
    //                     found = true;
    //                 }
    //             });
    //             if (!found) {
    //                 cpRoutes.push({
    //                     id: leg.origin.id || '',
    //                     startLocation: leg.origin.name || '',
    //                     endLocation: leg.destination.name || '',
    //                     originId: leg.origin.id || '',
    //                     destinationId: leg.destination.id || '',
    //                     // leg: leg,
    //                     type: journey.type || 'comboio',
    //                     availableTime: leg.departure || '',
    //                     state: journey.state || 'Active',
    //                     description: journey.description || 'Viagem de comboio',
    //                     estimatedTime: leg.arrival || '',
    //                     startDate: journey.startDate || leg.departure || '',
    //                     userImage: journey.userImage || '',
    //                     rating: journey.rating || 0,
    //                     capacity: journey.capacity || 50,
    //                     actualCapacity: journey.actualCapacity || 50,
    //                     version: journey.version || 0,
    //                     price: leg.price || 0,
    //                 });
    //             }
    //         });
    //     });
    // }

    return { begin, stop, cpRoutes, allTargets };
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export default routeAPI;
