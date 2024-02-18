import { readdirSync } from "fs";
import { join } from "path";
import {
    CovalentClient,
    type Chain,
    type Transaction,
} from "@covalenthq/client-sdk";
import {
    type Configs,
    type DecodingFunction,
    type Decoders,
    type DecodingFunctions,
    type EventType,
    type DecoderConfig,
    type Fallbacks,
} from "./decoder.types";
import { encodeEventTopics, type Abi } from "viem";

export class GoldRushDecoder {
    private static configs: DecoderConfig = {};
    private static decoders: Decoders = {};
    private static fallbacks: Fallbacks = {};
    private static decoding_functions: DecodingFunctions = [];

    public static initDecoder = () => {
        console.info("Initializing GoldrushDecoder Service...");

        const protocolsDirectoryPath: string = join(__dirname, "/protocols");
        const protocols = readdirSync(protocolsDirectoryPath);
        let protocolsCount: number = 0;
        for (const protocol of protocols) {
            const protocolPath = join(protocolsDirectoryPath, protocol);
            const files = readdirSync(protocolPath);
            let configFile: string | null = null,
                decodersFile: string | null = null;
            files.forEach((file) => {
                const fileExtension =
                    process.env.NODE_ENV !== "test" ? "js" : "ts";
                if (file.endsWith(`.configs.${fileExtension}`)) {
                    configFile = file;
                }
                if (file.endsWith(`.decoders.${fileExtension}`)) {
                    decodersFile = file;
                }
            });
            if (configFile && decodersFile) {
                protocolsCount++;
                const configs = require(join(protocolPath, configFile))
                    .default as Configs;
                configs.forEach(
                    ({ address, is_factory, chain_name, protocol_name }) => {
                        this.configs[chain_name] ??= {};
                        this.configs[chain_name][protocol_name] ??= {};
                        this.configs[chain_name][protocol_name][address] = {
                            is_factory: is_factory,
                        };
                    }
                );
                require(join(protocolPath, decodersFile));
            }
        }

        const fallbacksDirectoryPath: string = join(__dirname, "/fallbacks");
        const fallbacks = readdirSync(fallbacksDirectoryPath);
        let fallbacksCount: number = 0;
        for (const fallback of fallbacks) {
            const fallbackPath = join(fallbacksDirectoryPath, fallback);
            const files = readdirSync(fallbackPath);
            let fallbackFile: string | null = null;
            files.forEach((file) => {
                const fileExtension =
                    process.env.NODE_ENV !== "test" ? "js" : "ts";
                if (file.endsWith(`.fallback.${fileExtension}`)) {
                    fallbackFile = file;
                }
            });
            if (fallbackFile) {
                fallbacksCount++;
                require(join(fallbackPath, fallbackFile));
            }
        }

        const decodersCount = Object.keys(this.decoding_functions).length;
        const configsCount = Object.values(this.configs).reduce(
            (chainCount, chain) => {
                return (
                    chainCount +
                    Object.values(chain).reduce((addressCount, protocol) => {
                        return addressCount + Object.keys(protocol).length;
                    }, 0)
                );
            },
            0
        );

        console.info(`${protocolsCount.toLocaleString()} protocols found`);
        console.info(`${configsCount.toLocaleString()} configs generated`);
        console.info(`${decodersCount.toLocaleString()} decoders generated`);
        console.info(`${fallbacksCount.toLocaleString()} fallbacks generated`);
    };

    public static on = (
        event_id: string,
        chain_names: Chain[],
        abi: Abi,
        decoding_function: DecodingFunction
    ) => {
        const [protocol, event_name] = event_id.split(":");
        const [topic0_hash] = encodeEventTopics({
            abi: abi,
            eventName: event_name,
        });
        this.decoding_functions.push(decoding_function);
        const decoding_function_index: number =
            this.decoding_functions.length - 1;
        chain_names.forEach((chain_name) => {
            const configExists = this.configs[chain_name]?.[protocol]
                ? true
                : false;
            if (!configExists) {
                throw Error(
                    `config for ${protocol} does not exist on ${chain_name}`
                );
            }
            Object.keys(this.configs[chain_name][protocol]).forEach(
                (address) => {
                    this.decoders[chain_name] ??= {};
                    this.decoders[chain_name][address] ??= {};
                    this.decoders[chain_name][address][topic0_hash] =
                        decoding_function_index;
                }
            );
        });
    };

    public static fallback = (
        event_name: string,
        abi: Abi,
        decoding_function: DecodingFunction
    ) => {
        const [topic0_hash] = encodeEventTopics({
            abi: abi,
            eventName: event_name,
        });
        this.decoding_functions.push(decoding_function);
        const decoding_function_index: number =
            this.decoding_functions.length - 1;
        this.fallbacks[topic0_hash] = decoding_function_index;
    };

    public static decode = async (
        chain_name: Chain,
        tx: Transaction,
        covalent_api_key: string
    ) => {
        const covalent_client = new CovalentClient(covalent_api_key);
        const events: EventType[] = [];
        const logs = (tx.log_events ?? []).reverse();
        for (const log of logs) {
            const {
                raw_log_topics: [topic0_hash],
                sender_address: contract_address,
                // !ERROR: add factory_contract_address in the log_event(s)
                // factory_contract_address,
            } = log;
            const decoding_index =
                // !ERROR: add factory_contract_address in the log_event(s)
                // factory_contract_address ||
                this.decoders[chain_name][contract_address]?.[topic0_hash];
            const fallback_index = this.fallbacks[topic0_hash];
            if (decoding_index !== undefined || fallback_index !== undefined) {
                const event = await this.decoding_functions[
                    decoding_index ?? fallback_index
                ](log, tx, chain_name, covalent_client);
                events.push(event);
            }
        }
        return events;
    };
}
