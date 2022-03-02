interface IVisit {
  [key: string]: boolean;
}
interface ISeen {
  [key: string]: number;
}

interface IRoute {
  startLocation: string;
  endLocation: string;
}
interface IRoutes extends Array<IRoute> {}
/////////////////////////////start        //end       //allRoutes
export const searchRoute = (src: string, dst: string, routes: IRoutes, allTargets: string[]) => {
  // The graph
  try {
    console.log('src', src, dst);
    const adjacencyList = new Map();
    // Add node
    function addNode(node: string) {
      adjacencyList.set(node, []);
    }

    // Add edge, undirected
    function addEdge(origin: string, destination: string) {
      adjacencyList.get(origin).push(destination);
    }
    // Create the Graph
    allTargets.forEach(addNode);
    routes.forEach((route: IRoute) => addEdge(route.startLocation, route.endLocation));

    let visit: IVisit = { start: false };

    const paths: string[] = [];

    adjacencyList.forEach((item: [string], key: number) => {
      if (item.length > 0) {
        adjacencyList.set(key, uniq_fast(item));
      }
    });
    console.log(adjacencyList);
    const searchAllPaths = (
      graph: Map<string, string>,
      start: string,
      end: string,
      visited: IVisit,
      all: string
    ): void => {
      console.log(start, end, visited, all);
      if (start === end) {
        paths.push(all);
        return;
      }
      visited[start] = true;
      const destinations = adjacencyList.get(start);
      destinations.forEach((item: string) => {
        if (!visited[item]) {
          searchAllPaths(graph, item, end, visited, all + ',' + item);
        }
      });
      visited[start] = false;
    };

    searchAllPaths(adjacencyList, src, dst, visit, src);
    console.log(paths);
    return paths;
  } catch (error) {
    console.log(`search error: ${error}`);
  }
};

function uniq_fast(itemList: [string]) {
  let seen: ISeen = {};
  let out = [];
  let len = itemList.length;
  let j = 0;
  for (let i = 0; i < len; i++) {
    let item = itemList[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}
