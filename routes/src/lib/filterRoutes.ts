interface IRoute {
    startLocation: string;
    endLocation: string;
    originId: string;
    destinationId: string;
}

export const filterRoutes = (paths: any, allRoutes: any[]) => {
    try {
        const final: any = [];
        paths?.forEach((path: any) => {
            const splittedPaths = path.split(',');

            const initial: any = {};
            splittedPaths.forEach((subpath: any, index: number): void => {
                allRoutes.forEach((route: IRoute) => {
                    // const finalRoute = { start: '', end: '' };
                    if (subpath === route.startLocation && splittedPaths[index + 1] === route.endLocation) {
                        initial[subpath] = route;
                    }
                });
                if (initial[subpath]) {
                    final.push(initial);
                }
            });
        });

        return final;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};
