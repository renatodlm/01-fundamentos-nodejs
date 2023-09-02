//Readable Streams / Writable Streams

//Streams ->

// process.stdin
//    .pipe(process.stdout)

import { Readable, Writable, Transform } from 'node:stream'

class OnToHundredStream extends Readable {
   index = 1
   _read() {
      const i = this.index++

      setTimeout(() => {
         if (i > 100) {
            this.push(null)
         } else {

            const buf = Buffer.from(String(i))

            this.push(buf)
         }
      }, 1000)
   }
}

class InverseNumberStream extends Transform {
   _transform(chunk, encoding, callback) {
      const transformed = Number(chunk.toString()) * -1

      // callback(new Error('Number not valid'),)

      callback(null, Buffer.from(String(transformed)))
   }
}

class MultiplyByTenStream extends Writable {
   _write(chunk, encoding, callback) {
      console.log(Number(chunk.toString()) * 10)
      callback()
   }
}

// new OnToHundredStream()
//    .pipe(process.stdout)

new OnToHundredStream()
   .pipe(new InverseNumberStream())
   .pipe(new MultiplyByTenStream())
