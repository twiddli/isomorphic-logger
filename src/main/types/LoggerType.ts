// @flow
import { LogLevel } from '../LogLevel';

export type Awaitable<T> = Promise<T> | T;

export type Messages = Array<any>;

export type Record = {
  level: LogLevel;
  messages: Messages;
  meta: any;
};

export type ProcessorResult = Awaitable<Record[] | undefined> | undefined;

export type Processor = (records: Record[]) => ProcessorResult;

export type Channel = {
  processors: Processor[];
  promise: Promise<Record[] | undefined> | undefined;
};
