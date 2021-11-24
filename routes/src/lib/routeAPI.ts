const comboios = require('comboios');
const NodeGeocoder = require('node-geocoder');
import { Route } from '../models/route';
const busRoutes: IBusRoutes = require('../bus/bus.json')
interface IStation {
    id: string;
    name: string;
}

interface ILegDetails {
    name: string;
    id: string;
}
interface ILeg {
    origin: ILegDetails;
    destination: ILegDetails;
    departure?: string
    arrival?: string
    price?: number;
    tripId?: string;
}
interface IRoute {
    id: string;
    startLocation: string;
    endLocation: string;
    originId: string;
    destinationId: string;
    price: number;
    type: string
    availableTime: string
    state: string
    description: string
    estimatedTime: string
    startDate: string
    userImage: string
    rating: number
    capacity: number
    actualCapacity: number
    version: number
    legs?: [ILeg];
}

interface IPrice {
    class: number
    ammount: number
    currency: string
}
interface ICPRoute {
    type: string
    id: string
    legs: [ILeg]
    price: IPrice
}
interface IBusRoutes {
    data: [ICPRoute]
}
interface ICPRoutes extends Array<ICPRoute> { }
interface IRoutes extends Array<IRoute> { }
interface ICPStations extends Array<IStation> { }

export const routeAPI = async (start: string, end: string, type: string): Promise<any> => {
    try {
        const cpStations: ICPStations = await comboios.stations();
        const allTargets: string[] = [];
        const cpRoutes: IRoutes = [];
        const begin = { id: '', name: '' };
        const stop = { id: '', name: '' };
        let initialPlace = start;
        let finalPlace = end;

        if (parseInt(type, 10) === 1) {
            const geocoder = NodeGeocoder({
                provider: 'opencage',
                apiKey: process.env.OPENCAGE_API_KEY,
                language: 'pt-BR',
            });

            const geo = await geocoder.batchGeocode([start, end]);
            initialPlace = geo[0].value[0].city;
            finalPlace = geo[1].value[0].city;
        }


        cpStations.forEach(async (station: IStation): Promise<void> => {
            allTargets.push(station.name);
            if (station.name.includes(initialPlace)) {
                begin.id = station.id;
                begin.name = station.name;
            }
            if (station.name.includes(finalPlace)) {
                stop.id = station.id;
                stop.name = station.name;
            }
        });
        const date: Date = new Date();
        // console.log(date.getDate(),date.getMonth(),date.getFullYear(),date.getHours(),date.getMinutes(),date.getSeconds());

        const cpJourneys = await comboios.journeys(begin.id, stop.id, { when: new Date(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`) }) || [];
        const bdRides = await Route.find({ state: 'AVAILABLE', startDate:{$gte:date.toDateString()} });
      //  console.log(bdRides)
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
                    }
                ],
                startLocation: route.startLocation,
                endLocation: route.endLocation,
                originId: route.id,
                destinationId: route.id,
                price: 0
            }

            allTargets.push(route.startLocation);
            if (route.startLocation.includes(initialPlace)) {
                begin.id = route.id;
                begin.name = route.startLocation;
            }
            if (route.endLocation.includes(finalPlace)) {
                stop.id = route.id;
                stop.name = route.endLocation;
            }
            cpJourneys.push(ride);
        })

        // busRoutes.data.forEach((route: any) => {
        //     const routeDate = new Date(route.date);
        //      if (routeDate.getHours() !== date.getHours()) return

        //     const ride: IRoute = {
        //         id: route.id,
        //         type: route.type,
        //         availableTime: route.availableTime,
        //         state: route.state,
        //         description: route.description,
        //         estimatedTime: route.estimatedTime,
        //         startDate: route.startDate,
        //         userImage: route.userImage,
        //         rating: route.rating,
        //         capacity: route.capacity,
        //         actualCapacity: route.actualCapacity,
        //         version: route.version,
        //         legs: [
        //             {
        //                 tripId: route.id,
        //                 origin: {
        //                     id: route.id,
        //                     name: route.startLocation,
        //                 },
        //                 destination: {
        //                     id: route.id,
        //                     name: route.endLocation,
        //                 },
        //             }
        //         ],
        //         startLocation: route.startLocation,
        //         endLocation: route.endLocation,
        //         originId: route.id,
        //         destinationId: route.id,
        //         price: 0
        //     }

        //     allTargets.push(route.startLocation);
        //     if (route.startLocation.includes(initialPlace)) {
        //         begin.id = route.id;
        //         begin.name = route.startLocation;
        //     }
        //     if (route.endLocation.includes(finalPlace)) {
        //         stop.id = route.id;
        //         stop.name = route.endLocation;
        //     }
        //     cpJourneys.push(ride);
        // })
        //filter journeys
        if (cpJourneys) {
            cpJourneys.map((journey: IRoute): void => {
                journey.legs?.map((leg: ILeg) => {
                    let found = false;
                    cpRoutes?.forEach((element: IRoute) => {
                        if (element.startLocation === leg.origin.name && element.endLocation === leg.destination.name) {
                            found = true;
                        }
                    });
                    if (!found) {
                        cpRoutes.push({
                            id: leg.origin.id || "",
                            startLocation: leg.origin.name || "",
                            endLocation: leg.destination.name || "",
                            originId: leg.origin.id || "",
                            destinationId: leg.destination.id || "",
                            // leg: leg,
                            type: journey.type || "comboio",
                            availableTime: leg.departure || "",
                            state: journey.state || "Active",
                            description: journey.description || "Viagem de comboio",
                            estimatedTime: leg.arrival || "",
                            startDate: journey.startDate || leg.departure || "",
                            userImage: journey.userImage || "",
                            rating: journey.rating || 0,
                            capacity: journey.capacity || 50,
                            actualCapacity: journey.actualCapacity || 50,
                            version: journey.version || 0,
                            price: leg.price || 0,
                        });
                    }
                });
            });
        }
        return { begin, stop, cpRoutes, allTargets };
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};
