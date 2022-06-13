import SFTPClient from "ssh2-sftp-client";
import { ConfigAuthFTP, FTPInterface } from "sdz-agent-types";
declare class FTP implements FTPInterface {
    private config;
    constructor(config: ConfigAuthFTP);
    connect(): Promise<boolean>;
    getClient(): SFTPClient;
    sendFile(localFileName: string, remoteFileName: string): Promise<boolean>;
    getFile(remoteFileName: string, localFileName: string): Promise<boolean>;
    renameFile(remoteFileName: string, newRemoteFileName: string): Promise<boolean>;
}
export default FTP;
