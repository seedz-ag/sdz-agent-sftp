import { ConfigAuthFTP, FTPInterface } from "sdz-agent-types";
import SFTPClient, { FileInfo } from "ssh2-sftp-client";
declare class FTP implements FTPInterface {
    private config;
    constructor(config: ConfigAuthFTP);
    connect(): Promise<boolean>;
    getClient(): SFTPClient;
    sendFile(localFileName: string, remoteFileName: string): Promise<boolean>;
    getFile(remoteFileName: string, localFileName: string): Promise<boolean>;
    renameFile(remoteFileName: string, newRemoteFileName: string): Promise<boolean>;
    list(path: string): Promise<FileInfo[]>;
}
export default FTP;
