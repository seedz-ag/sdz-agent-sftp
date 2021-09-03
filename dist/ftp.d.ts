import { ConfigAuthFTP, FTPInterface } from "sdz-agent-types";
declare class FTP implements FTPInterface {
    private client;
    private config;
    constructor(config: ConfigAuthFTP);
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
    sendFile(localFileName: string, remoteFileName: string): Promise<boolean>;
    getFile(remoteFileName: string, localFileName: string): Promise<boolean>;
}
export default FTP;
