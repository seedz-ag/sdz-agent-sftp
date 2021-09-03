"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const common_1 = require("common");
class FTP {
    constructor(config) {
        this.config = config;
        this.client = new ssh2_sftp_client_1.default();
    }
    async connect() {
        try {
            await this.client
                .connect(this.config)
                .then(() => {
                return true;
            })
                .catch((e) => {
                throw new Error();
            });
            return true;
        }
        catch (e) {
            common_1.Logger.error("CONFIGURAÇÕES FTP INVÁLIDAS.");
            process.exit(1);
        }
    }
    async disconnect() {
        await this.client.end();
    }
    async sendFile(localFileName, remoteFileName) {
        let complete = false;
        try {
            await this.client
                .fastPut(localFileName, remoteFileName)
                .then(() => {
                return this.disconnect();
            })
                .catch((err) => {
                console.log(err);
                common_1.Logger.error(`ERRO AO ENVIAR ${remoteFileName} FTP.`);
                process.exit(1);
            });
            complete = true;
        }
        catch (e) {
            throw new Error();
        }
        return complete;
    }
    async getFile(remoteFileName, localFileName) {
        let complete = false;
        try {
            await this.client
                .fastGet(remoteFileName, localFileName)
                .then(() => {
                return this.disconnect();
            })
                .catch((err) => {
                console.error(err.message);
            });
            complete = true;
        }
        catch (e) {
            throw new Error();
        }
        return complete;
    }
}
exports.default = FTP;
