/* eslint-disable no-var */
export enum Runtime {
    Bun = 'bun',
    Deno = 'deno',
    Node = 'node'
}

export enum SystemOS {
    Windows = 'windows',
    Mac = 'macos',
    Linux = 'linux'
}

export declare global {
    var runtime: Runtime
    var system: SystemOS
    interface globalThis {
        runtime: Runtime
        system: SystemOS
    }
}