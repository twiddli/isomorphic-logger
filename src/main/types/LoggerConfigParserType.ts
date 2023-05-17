// @flow
import type { Processor } from "./LoggerType";

export type LoggerConfig = ProcessorOptions & {
  level: string;
  channels?: ChannelConfig[];
};

export type ChannelConfig = ProcessorConfig[];

export type ProcessorConfig = {
  type: string;
  options?: ProcessorOptions;
};

export type ProcessorOptions = { [key: string]: any };

export type ProcessorFactory = (options?: ProcessorOptions) => Processor;

export type ProcessorDictionary = { [key: string]: ProcessorFactory };
