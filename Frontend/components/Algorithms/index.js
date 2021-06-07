import React, {Component} from 'react';
import {View, Text} from 'react-native';

class Algorithms extends Component {
  constructor() {
    super();
    this.state = {
      source: null,
      destination: null,
      options: null,
    };
  }

  findNearestStation(point) {
    let minDistance;
    let stationName;
    let stationLocation;
    let first = true;
    for (let station in this.stations) {
      let distance = this.distance(point, {
        lat: this.stations[station].lat,
        lng: this.stations[station].lng,
      });
      if (station === 'source' || station === 'destination') {
        continue;
      }
      if (first) {
        minDistance = distance;
        stationLocation = station;
        first = false;
      }
      if (distance < minDistance) {
        minDistance = distance;
        stationName = station;
        stationLocation = this.stations[station];
      }
    }
    return {
      minDistance,
      stationName,
      stationLocation,
    };
  }

  distance(a, b) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371; // Radius of the earth in km
    let dLat = deg2rad(a.lat - b.lat);
    let dLng = deg2rad(a.lng - b.lng);
    let A =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(a.lat)) *
        Math.cos(deg2rad(b.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    let C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
    let D = R * C; // Distance in km
    return D;
  }

  constructGraph() {
    this.graph = {};
    for (let point in this.stations) {
      for (let adj in this.stations) {
        if (point === adj) {
          continue;
        }
        if (
          this.distance(this.stations[point], this.stations[adj]) <=
          this.options.MAX_DISTANCE
        ) {
          this.graph[point] = this.graph[point] || {};
          this.graph[point][adj] = this.distance(
            this.stations[point],
            this.stations[adj],
          );
        }
      }
    }
  }

  calculatePath(parrents) {
    this.path = [];
    this.stationsOnPath = [];
    let current = 'destination';
    while (parrents[current] !== undefined) {
      this.path.push(this.stations[current]);
      this.stationsOnPath.push(current);
      current = parrents[current];
    }
    return {
      path: this.path.reverse(),
      stationsOnPath: this.stationsOnPath.reverse(),
    };
  }

  dijkstra() {
    if (this.nearestStation > this.options.MAX_DISTANCE / 2) {
      return (this.minDistance = undefined);
    }
    let unvisited = Object.keys(this.graph);
    let dis = {};
    let current = 'source';
    let pathParrent = {};
    let maxStep = unvisited.length + 1;
    dis[current] = 0;
    while (maxStep--) {
      for (let adj in this.graph[current]) {
        if (
          dis[adj] === undefined ||
          dis[adj] >
            dis[current] +
              this.distance(this.stations[current], this.stations[adj])
        ) {
          dis[adj] =
            dis[current] +
            this.distance(this.stations[current], this.stations[adj]);
          pathParrent[adj] = current;
        }
      }
      unvisited.splice(unvisited.indexOf(current), 1);
      if (current === 'destination') {
        console.log('reached destination');
        break;
      }
      current = null;
      for (let candidate of unvisited) {
        if (
          dis[candidate] !== undefined &&
          (current === null || dis[current] > dis[candidate])
        ) {
          current = candidate;
        }
      }
    }

    this.calculatePath(pathParrent);
    this.minDistance = dis['destination'];
    return this.minDistance;
  }

  solve() {
    this.constructGraph();
    this.dijkstra();
    console.log('dijkstra ended');
    if (this.path !== []) {
      this.path.unshift(this.source);
      this.stationsOnPath.unshift('source');
    }
    this.path.unshift(this.firstStation.stationLocation);
    this.stationsOnPath.unshift(this.firstStation.stationName);
    this.finalStation = this.findNearestStation(this.destination);
    if (this.finalStation.minDistance > this.options.MAX_DISTANCE / 2) {
      this.minDistance = undefined;
    }
    this.path.push(this.finalStation.stationLocation);
    this.stationsOnPath.push(this.finalStation.stationName);
    if (this.minDistance === undefined) {
      this.path = [];
      this.stationsOnPath = [];
    }
    return {
      distance: this.minDistance,
      path: this.path, //array : locations of stations on path
      stationsOnPath: this.stationsOnPath, //array : name of stations
    };
  }

  render() {
    <View>
      <Text>Ola</Text>
    </View>;
  }
}
