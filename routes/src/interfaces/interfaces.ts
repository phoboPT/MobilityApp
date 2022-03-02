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
  departure?: string;
  arrival?: string;
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
  type: string;
  availableTime: string;
  state: string;
  description: string;
  estimatedTime: string;
  startDate: string;
  userImage: string;
  rating: number;
  capacity: number;
  actualCapacity: number;
  version: number;
  legs?: [ILeg];
}

interface IPrice {
  class: number;
  ammount: number;
  currency: string;
}
interface ICPRoute {
  type: string;
  id: string;
  legs: [ILeg];
  price: IPrice;
}
interface IBusRoutes {
  data: [ICPRoute];
}
interface ICPRoutes extends Array<ICPRoute> {}
interface IRoutes extends Array<IRoute> {}
interface ICPStations extends Array<IStation> {}

interface ILatLong {
  lat: number;
  long: number;
}

export { ILatLong, IStation, ILeg, IRoute, IBusRoutes, ICPRoutes, IRoutes, ICPStations };
