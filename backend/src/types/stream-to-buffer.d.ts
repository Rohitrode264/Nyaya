declare module "stream-to-buffer" {
  import { Readable } from "stream";

  type Callback = (err: Error | null, buffer: Buffer) => void;

  function streamToBuffer(stream: Readable, cb: Callback): void;

  export = streamToBuffer;
}
