import OmeggaPlugin, { OL, PS, PC } from 'omegga';

type Config = { foo: string };
type Storage = { bar: string };

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;

  }

  async init() {
    // Subscribe to the death events plugin
    const onDeath = await this.omegga.getPlugin('deathevents')
    if (onDeath) {
      console.log('subscribing to ondeath')
      onDeath.emitPlugin('subscribe')
    } else {
      throw Error("ondeath plugin is required for this to plugin")
    }
  }

  async stop() {
    // Unsubscribe to the death events plugin
    const onDeath = await this.omegga.getPlugin('deathevents')
    if (onDeath) {
      console.log('unsubscribing from ondeath')
      onDeath.emitPlugin('unsubscribe')
    } else {
      throw Error("ondeath plugin is required for this to plugin")
    }
  }

  async pluginEvent(event: string, from: string, ...args: any[]) {
    console.log(event, from, args)
    if (event === 'death') {
      const [{ player }] = args;
      this.omegga.broadcast(`${player.name} has died.`)
    }

    if (event === 'spawn') {
      const [{ player }] = args;
      this.omegga.broadcast(`${player.name} has spawned.`);
    }
  }
}
