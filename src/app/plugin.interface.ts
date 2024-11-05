
export interface Plugin {
    id: string;
    name: string;
    version: string;
    initialize(): void;
    configure(config: any): void;
    getComponents(): any[];
    getServices(): any[];
  }
  