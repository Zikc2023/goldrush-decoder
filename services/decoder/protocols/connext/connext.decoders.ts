import { GoldRushDecoder } from "../../decoder";
import type { EventDetails, EventTokens } from "../../decoder.types";
import { type EventType } from "../../decoder.types";
import {
    DECODED_ACTION,
    DECODED_EVENT_CATEGORY,
} from "../../decoder.constants";
import { decodeEventLog, type Abi } from "viem";
import ROUTER_ABI from "./abis/connext-router.abi.json";
import CALLER_ABI from "./abis/connext-call.abi.json";
import { timestampParser } from "../../../../utils/functions";
import { prettifyCurrency } from "@covalenthq/client-sdk";

const DOMAIN_ID_TO_CHAIN_ID: { [domain_id: number]: string } = {
    6648936: "Ethereum Mainnet",
    1886350457: "Polygon",
    1869640809: "Optimism",
    1634886255: "Arbitrum One",
    6778479: "Gnosis Chain",
    6450786: "BNB Chain",
    1818848877: "Linea",
    1835365481: "Metis",
    1650553709: "Base",
};

GoldRushDecoder.on(
    "connext:RouterLiquidityAdded",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterLiquidityAdded",
        }) as {
            eventName: "RouterLiquidityAdded";
            args: {
                router: string;
                local: string;
                key: string;
                amount: bigint;
                caller: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
            {
                heading: "Local",
                value: decoded.local,
                type: "address",
            },
            {
                heading: "Key",
                value: decoded.key,
                type: "text",
            },
            {
                heading: "Amount",
                value: decoded.amount.toString(),
                type: "text",
            },
            {
                heading: "Caller",
                value: decoded.caller,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.ADD_LIQUIDITY,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterLiquidityAdded",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:RouterAdded",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterAdded",
        }) as {
            eventName: "RouterAdded";
            args: {
                router: string;
                caller: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
            {
                heading: "Caller",
                value: decoded.caller,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.ADD_ROUTER,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterAdded",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:RouterRemoved",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterRemoved",
        }) as {
            eventName: "RouterRemoved";
            args: {
                router: string;
                caller: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
            {
                heading: "Caller",
                value: decoded.caller,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.REMOVE_ROUTER,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterRemoved",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:RouterRecipientSet",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterRecipientSet",
        }) as {
            eventName: "RouterRecipientSet";
            args: {
                router: string;
                prevRecipient: string;
                newRecipient: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
            {
                heading: "Previous Recipient",
                value: decoded.prevRecipient,
                type: "address",
            },
            {
                heading: "New Recipient",
                value: decoded.newRecipient,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.UPDATE,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterRecipientSet",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:RouterInitialized",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterInitialized",
        }) as {
            eventName: "RouterInitialized";
            args: {
                router: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.INIT_ROUTER,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterInitialized",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:RouterOwnerAccepted",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterOwnerAccepted",
        }) as {
            eventName: "RouterOwnerAccepted";
            args: {
                router: string;
                prevOwner: string;
                newOwner: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
            {
                heading: "Previous Owner",
                value: decoded.prevOwner,
                type: "address",
            },
            {
                heading: "New Owner",
                value: decoded.newOwner,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.UPDATE,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterOwnerAccepted",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:RouterOwnerProposed",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterOwnerProposed",
        }) as {
            eventName: "RouterOwnerProposed";
            args: {
                router: string;
                prevProposed: string;
                newProposed: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
            {
                heading: "Previous Proposed",
                value: decoded.prevProposed,
                type: "address",
            },
            {
                heading: "New Proposed",
                value: decoded.newProposed,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.UPDATE,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterOwnerProposed",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:RouterLiquidityRemoved",
    ["eth-mainnet"],
    ROUTER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: ROUTER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "RouterLiquidityRemoved",
        }) as {
            eventName: "RouterLiquidityRemoved";
            args: {
                router: string;
                to: string;
                local: string;
                key: string;
                amount: bigint;
                caller: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Router",
                value: decoded.router,
                type: "address",
            },
            {
                heading: "To",
                value: decoded.to,
                type: "address",
            },
            {
                heading: "Local",
                value: decoded.local,
                type: "address",
            },
            {
                heading: "Key",
                value: decoded.key,
                type: "text",
            },
            {
                heading: "Amount",
                value: decoded.amount.toString(),
                type: "text",
            },
            {
                heading: "Caller",
                value: decoded.caller,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.REMOVE_LIQUIDITY,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "RouterLiquidityRemoved",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:XCalled",
    ["eth-mainnet"],
    CALLER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: CALLER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "XCalled",
        }) as {
            eventName: "XCalled";
            args: {
                transferId: string;
                nonce: bigint;
                messageHash: string;
                params: {
                    originDomain: bigint;
                    destinationDomain: bigint;
                    canonicalDomain: bigint;
                    to: string;
                    delegate: string;
                    receiveLocal: boolean;
                    callData: string;
                    slippage: bigint;
                    originSender: string;
                    bridgedAmt: bigint;
                    normalizedIn: bigint;
                    nonce: bigint;
                    canonicalId: string;
                };
                asset: string;
                amount: bigint;
                local: string;
                messageBody: string;
            };
        };

        const date = timestampParser(tx.block_signed_at, "YYYY-MM-DD");

        const { data: TokenData } =
            await covalent_client.PricingService.getTokenPrices(
                chain_name,
                "USD",
                decoded.asset,
                {
                    from: date,
                    to: date,
                }
            );

        const tokens: EventTokens = [
            {
                decimals: TokenData?.[0]?.contract_decimals,
                heading: "Bridged Amount",
                value: String(decoded.params.bridgedAmt),
                pretty_quote: prettifyCurrency(
                    TokenData?.[0]?.prices?.[0]?.price *
                        (Number(decoded.params.bridgedAmt) /
                            Math.pow(
                                10,
                                TokenData?.[0]?.contract_decimals ?? 0
                            ))
                ),
                ticker_logo: TokenData?.[0]?.logo_urls?.token_logo_url,
                ticker_symbol: TokenData?.[0]?.contract_ticker_symbol,
            },
            {
                decimals: TokenData?.[0]?.contract_decimals,
                heading: "Amount",
                value: String(decoded.amount),
                pretty_quote: prettifyCurrency(
                    TokenData?.[0]?.prices?.[0]?.price *
                        (Number(decoded.amount) /
                            Math.pow(
                                10,
                                TokenData?.[0]?.contract_decimals ?? 0
                            ))
                ),
                ticker_logo: TokenData?.[0]?.logo_urls?.token_logo_url,
                ticker_symbol: TokenData?.[0]?.contract_ticker_symbol,
            },
        ];

        const details: EventDetails = [
            {
                heading: "Transfer ID",
                value: decoded.transferId,
                type: "address",
            },
            {
                heading: "Nonce",
                value: decoded.nonce.toString(),
                type: "text",
            },
            {
                heading: "Message Hash",
                value: decoded.messageHash,
                type: "text",
            },
            {
                heading: "Origin Domain",
                value: DOMAIN_ID_TO_CHAIN_ID[
                    Number(decoded.params.originDomain)
                ],
                type: "text",
            },
            {
                heading: "Destination Domain",
                value: DOMAIN_ID_TO_CHAIN_ID[
                    Number(decoded.params.destinationDomain)
                ],
                type: "text",
            },
            {
                heading: "Canonical Domain",
                value: decoded.params.canonicalDomain.toString(),
                type: "text",
            },
            {
                heading: "To",
                value: decoded.params.to,
                type: "address",
            },
            {
                heading: "Delegate",
                value: decoded.params.delegate,
                type: "address",
            },
            {
                heading: "Receive Local",
                value: decoded.params.receiveLocal === true ? "True" : "False",
                type: "text",
            },
            {
                heading: "Call Data",
                value: decoded.params.callData,
                type: "text",
            },
            {
                heading: "Slippage",
                value: decoded.params.slippage.toString(),
                type: "text",
            },
            {
                heading: "Origin Sender",
                value: decoded.params.originSender,
                type: "address",
            },
            {
                heading: "Normalized In",
                value: decoded.params.normalizedIn.toString(),
                type: "text",
            },
            {
                heading: "Canonical ID",
                value: decoded.params.canonicalId,
                type: "text",
            },
            {
                heading: "Asset",
                value: decoded.asset,
                type: "address",
            },
            {
                heading: "Local",
                value: decoded.local,
                type: "address",
            },
            {
                heading: "Message Body",
                value: decoded.messageBody,
                type: "text",
            },
        ];

        return {
            action: DECODED_ACTION.TRANSFERRED,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "XCalled",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
            tokens,
        };
    }
);

GoldRushDecoder.on(
    "connext:ExternalCalldataExecuted",
    ["eth-mainnet"],
    CALLER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: CALLER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "ExternalCalldataExecuted",
        }) as {
            eventName: "ExternalCalldataExecuted";
            args: {
                transferId: string;
                success: boolean;
                returnData: string;
            };
        };

        const details: EventDetails = [
            {
                heading: "Transfer ID",
                value: decoded.transferId,
                type: "text",
            },
            {
                heading: "Success",
                value: decoded.success === true ? "True" : "False",
                type: "text",
            },
            {
                heading: "Return Data",
                value: decoded.returnData,
                type: "text",
            },
        ];

        return {
            action: DECODED_ACTION.TRANSFERRED,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "ExternalCalldataExecuted",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:TransferRelayerFeesIncreased",
    ["eth-mainnet"],
    CALLER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: CALLER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "TransferRelayerFeesIncreased",
        }) as {
            eventName: "TransferRelayerFeesIncreased";
            args: {
                transferId: string;
                increase: bigint;
                asset: string;
                caller: string;
            };
        };

        const date = timestampParser(tx.block_signed_at, "YYYY-MM-DD");

        const { data: TokenData } =
            await covalent_client.PricingService.getTokenPrices(
                chain_name,
                "USD",
                decoded.asset,
                {
                    from: date,
                    to: date,
                }
            );

        const tokens: EventTokens = [
            {
                decimals: TokenData?.[0]?.contract_decimals,
                heading: "Increase",
                value: String(decoded.increase),
                pretty_quote: prettifyCurrency(
                    TokenData?.[0]?.prices?.[0]?.price *
                        (Number(decoded.increase) /
                            Math.pow(
                                10,
                                TokenData?.[0]?.contract_decimals ?? 0
                            ))
                ),
                ticker_logo: TokenData?.[0]?.logo_urls?.token_logo_url,
                ticker_symbol: TokenData?.[0]?.contract_ticker_symbol,
            },
        ];

        const details: EventDetails = [
            {
                heading: "Transfer ID",
                value: decoded.transferId,
                type: "address",
            },
            {
                heading: "Asset",
                value: decoded.asset,
                type: "text",
            },
            {
                heading: "Caller",
                value: decoded.caller,
                type: "address",
            },
        ];

        return {
            action: DECODED_ACTION.TRANSFERRED,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "TransferRelayerFeesIncreased",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);

GoldRushDecoder.on(
    "connext:SlippageUpdated",
    ["eth-mainnet"],
    CALLER_ABI as Abi,
    async (
        log_event,
        tx,
        chain_name,
        covalent_client,
        options
    ): Promise<EventType> => {
        const { raw_log_data, raw_log_topics } = log_event;

        const { args: decoded } = decodeEventLog({
            abi: CALLER_ABI,
            topics: raw_log_topics as [],
            data: raw_log_data as `0x${string}`,
            eventName: "SlippageUpdated",
        }) as {
            eventName: "SlippageUpdated";
            args: {
                transferId: string;
                slippage: bigint;
            };
        };

        const details: EventDetails = [
            {
                heading: "Transfer ID",
                value: decoded.transferId,
                type: "address",
            },
            {
                heading: "Slippage",
                value: decoded.slippage.toString(),
                type: "text",
            },
        ];

        return {
            action: DECODED_ACTION.UPDATE,
            category: DECODED_EVENT_CATEGORY.DEX,
            name: "SlippageUpdated",
            protocol: {
                logo: log_event.sender_logo_url as string,
                name: log_event.sender_name as string,
            },
            ...(options.raw_logs ? { raw_log: log_event } : {}),
            details,
        };
    }
);
