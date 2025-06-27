declare module 'get-stream' {
  import { Stream } from 'stream';

  /** Retorna um Buffer com todos os dados do stream */
  export function buffer(stream: Stream): Promise<Buffer>;

  /** Retorna uma string unindo todos os dados do stream */
  export function text(stream: Stream): Promise<string>;

  export default { buffer, text };
}
