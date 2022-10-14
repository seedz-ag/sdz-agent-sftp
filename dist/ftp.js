"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdz_agent_common_1 = require("sdz-agent-common");
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
class FTP {
    constructor(config) {
        this.config = config;
        if (process.env.DEBUG) {
            (msg) => sdz_agent_common_1.Logger.info(msg);
        }
    }
    async connect() {
        try {
            const client = this.getClient();
            await client
                .connect(this.config)
                .then(() => {
                client.end();
                return true;
            })
                .catch((e) => {
                throw e;
            });
            return true;
        }
        catch (e) {
            sdz_agent_common_1.Logger.error("CONFIGURAÇÕES FTP INVÁLIDAS.");
            throw e;
        }
    }
    getClient() {
        return new ssh2_sftp_client_1.default();
    }
    async sendFile(localFileName, remoteFileName) {
        let complete = false;
        try {
            const client = this.getClient();
            await client.connect(this.config);
            await client
                .fastPut(localFileName, remoteFileName, {
                step: function (total_transferred, chunk, total) {
                    if (total_transferred < total) {
                        if (!process.env.COMMAND_LINE) {
                            sdz_agent_common_1.ProgressBar.update(localFileName, total_transferred, {
                                color: `\u001b[33m`,
                                event: "SENDING",
                                unit: "Kb",
                                count: `${Math.round(total_transferred / 8000)}/${Math.round(total / 8000)}`,
                            });
                        }
                    }
                    else {
                        if (!process.env.COMMAND_LINE) {
                            sdz_agent_common_1.ProgressBar.update(localFileName, total_transferred, {
                                color: `\u001b[32m`,
                                event: "DONE",
                                value: total,
                                count: `${Math.round(total_transferred / 8000)}/${Math.round(total / 8000)}`,
                            });
                        }
                    }
                },
            })
                .then(() => {
                client.end();
            })
                .catch((err) => {
                sdz_agent_common_1.Logger.error(`ERRO AO ENVIAR ${remoteFileName} FTP.`);
                throw err;
            });
            complete = true;
        }
        catch (e) {
            throw e;
        }
        return complete;
    }
    async getFile(remoteFileName, localFileName) {
        let complete = false;
        try {
            const client = this.getClient();
            await client.connect(this.config);
            await client
                .fastGet(remoteFileName, localFileName, {
                step: function (total_transferred, chunk, total) { },
            })
                .then(() => {
                client.end();
            })
                .catch((err) => {
                throw err;
            });
            complete = true;
        }
        catch (e) {
            throw e;
        }
        return complete;
    }
    async renameFile(remoteFileName, newRemoteFileName) {
        let complete = false;
        try {
            const client = this.getClient();
            await client.connect(this.config);
            await client
                .rename(remoteFileName, newRemoteFileName)
                .then(() => {
                client.end();
            })
                .catch((err) => {
                throw err;
            });
            complete = true;
        }
        catch (e) {
            throw e;
        }
        return complete;
    }
    async list(path) {
        const client = this.getClient();
        await client.connect(this.config);
        return client.list(path);
    }
}
exports.default = FTP;
