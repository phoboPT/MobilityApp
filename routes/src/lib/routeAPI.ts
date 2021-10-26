const comboios = require('comboios');
const NodeGeocoder = require('node-geocoder');

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
    price: number;
}
interface IRoute {
    startLocation: string;
    endLocation: string;
    originId: string;
    destinationId: string;
    price: number;
}
interface IRoutes extends Array<IRoute> {
    legs?: [ILeg];
    price?: number;
}
interface IStations extends Array<IStation> {}

export const routeAPI = async (start: string, end: string, type: string): Promise<any> => {
    try {
        const cpStations: IStations = await comboios.stations();
        const allTargets: string[] = [];
        const cpRoutes: IRoutes = [];

        let journeys;
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
        console.log(begin, stop);
        journeys = await comboios.journeys(begin.id, stop.id, { when: new Date('2021-11-14') });
        //filter journeys
        if (journeys) {
            journeys.map((journey: IRoutes): void => {
                journey.legs?.map((leg: ILeg) => {
                    let found = false;
                    cpRoutes?.forEach((element: IRoute) => {
                        if (element.startLocation === leg.origin.name && element.endLocation === leg.destination.name) {
                            found = true;
                        }
                    });
                    if (!found) {
                        cpRoutes.push({
                            startLocation: leg.origin.name,
                            endLocation: leg.destination.name,
                            originId: leg.origin.id,
                            destinationId: leg.destination.id,
                            // leg: leg,
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
