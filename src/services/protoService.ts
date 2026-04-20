import type { Message } from "@bufbuild/protobuf";

declare global {
  interface Window {
    proto?: Record<string, any>;
    jspb?: {
      Message: typeof Message;
      BinaryReader: any;
      BinaryWriter: any;
    };
  }
}

export function initProtoNamespace(): Promise<void> {
  return new Promise((resolve) => {
    const checkAndInit = () => {
      if (!window.jspb || !window.jspb.Message) {
        setTimeout(checkAndInit, 10);
        return;
      }

      const jspb = window.jspb!;

      if (!window.proto) window.proto = {};
      if (!window.proto.google) window.proto.google = {};
      if (!window.proto.google.protobuf) window.proto.google.protobuf = {};
      if (!window.proto.google.rpc) window.proto.google.rpc = {};

      // Define Timestamp class
      class Timestamp extends jspb.Message {
        seconds_: number;
        nanos_: number;

        constructor(opt_data?: { seconds_?: number; nanos_?: number }) {
          super();
          this.seconds_ = opt_data?.seconds_ || 0;
          this.nanos_ = opt_data?.nanos_ || 0;
        }

        static deserializeBinary(bytes: Uint8Array): Timestamp {
          const msg = new Timestamp();
          Timestamp.deserializeBinaryFromReader(
            msg,
            new jspb.BinaryReader(bytes)
          );
          return msg;
        }

        static deserializeBinaryFromReader(
          msg: Timestamp,
          reader: any
        ): Timestamp {
          while (reader.nextField()) {
            if (reader.isEndGroup()) break;
            const field = reader.getFieldNumber();
            switch (field) {
              case 1:
                msg.seconds_ = reader.readInt64();
                break;
              case 2:
                msg.nanos_ = reader.readInt32();
                break;
              default:
                reader.skipField();
                break;
            }
          }
          return msg;
        }

        static toObject(_includeInstance: boolean, msg: Timestamp | null): any {
          return msg
            ? msg.toObject(_includeInstance)
            : { seconds: 0, nanos: 0 };
        }

        toObject(_includeInstance: boolean): any {
          return { seconds: this.seconds_, nanos: this.nanos_ };
        }

        serializeBinary(): Uint8Array {
          const writer = new jspb.BinaryWriter();
          Timestamp.serializeBinaryToWriter(this, writer);
          return writer.getResultBuffer();
        }

        static serializeBinaryToWriter(message: Timestamp, writer: any): void {
          if (message.seconds_) {
            writer.writeInt64(1, message.seconds_);
          }
          if (message.nanos_) {
            writer.writeInt32(2, message.nanos_);
          }
        }

        getSeconds(): number {
          return this.seconds_;
        }

        getNanos(): number {
          return this.nanos_;
        }
      }

      // Define FieldMask class
      class FieldMask extends jspb.Message {
        paths_: string[];

        constructor(opt_data?: { paths_?: string[] }) {
          super();
          this.paths_ = opt_data?.paths_ || [];
        }

        static deserializeBinary(bytes: Uint8Array): FieldMask {
          const msg = new FieldMask();
          FieldMask.deserializeBinaryFromReader(
            msg,
            new jspb.BinaryReader(bytes)
          );
          return msg;
        }

        static deserializeBinaryFromReader(
          msg: FieldMask,
          reader: any
        ): FieldMask {
          while (reader.nextField()) {
            if (reader.isEndGroup()) break;
            const field = reader.getFieldNumber();
            switch (field) {
              case 1:
                msg.paths_.push(reader.readString());
                break;
              default:
                reader.skipField();
                break;
            }
          }
          return msg;
        }

        static toObject(_includeInstance: boolean, msg: FieldMask | null): any {
          return msg ? msg.toObject(_includeInstance) : { paths: [] };
        }

        toObject(_includeInstance: boolean): any {
          return { paths: this.paths_ };
        }

        serializeBinary(): Uint8Array {
          const writer = new jspb.BinaryWriter();
          FieldMask.serializeBinaryToWriter(this, writer);
          return writer.getResultBuffer();
        }

        static serializeBinaryToWriter(message: FieldMask, writer: any): void {
          message.paths_.forEach((path) => {
            writer.writeString(1, path);
          });
        }
      }

      window.proto.google.protobuf.Timestamp = Timestamp;
      window.proto.google.protobuf.FieldMask = FieldMask;

      resolve();
    };

    checkAndInit();
  });
}
