import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before conecting');
        }
        return this._client;
    }
    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise<void>((resolve, reject) => {
            console.log('connected to nas');
            this.client.on('connect', () => {
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();
