"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const sdz_agent_common_1 = require("sdz-agent-common");
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
                throw new Error();
            });
            return true;
        }
        catch (e) {
            sdz_agent_common_1.Logger.error("CONFIGURAÇÕES FTP INVÁLIDAS.");
            process.exit(1);
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
                console.log(err);
                sdz_agent_common_1.Logger.error(`ERRO AO ENVIAR ${remoteFileName} FTP.`);
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
            const client = this.getClient();
            await client.connect(this.config);
            await client.fastGet(remoteFileName, localFileName).catch((err) => {
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
