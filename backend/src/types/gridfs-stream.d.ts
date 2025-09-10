declare module "gridfs-stream" {
  import type { Db } from "mongodb";
  import type mongoose from "mongoose";
  import { Readable, Writable } from "stream";

  function Grid(db: Db, mongo: typeof mongoose.mongo): Grid.Grid;

  namespace Grid {
    interface Options {
      _id?: string;
      filename?: string;
      mode?: "r" | "w";
      root?: string;
    }

    interface WriteStream extends Writable {
      on(event: string, cb: (...args: any[]) => void): this;
      end(buffer?: Buffer, cb?: () => void): void;
    }

    interface ReadStream extends Readable {
      on(event: string, cb: (...args: any[]) => void): this;
    }

    interface Grid {
      collection(name: string): this;
      createReadStream(options?: Options): ReadStream;
      createWriteStream(options?: Options): WriteStream;
    }
  }

  export = Grid;
}
