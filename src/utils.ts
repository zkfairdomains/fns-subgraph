
import {
    BigInt,
    ByteArray,
    ethereum, 
    Bytes,
    log
  } from '@graphprotocol/graph-ts'


   
 
export const EMPTY_NODE = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ROOT_NODE:ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae")
export const MAX_BYTE_LENGTH = 8191
export const BIG_INT_ZERO = BigInt.fromI32(0)
  
function decodeName (buf:Bytes):Array<string> {
  let offset = 0
  let list = Bytes.fromHexString('')
  let dot = Bytes.fromHexString('2e')
  let len = buf[offset++]
  let hex = buf.toHexString()
  let firstLabel = ''
  if (len === 0) {
    return [firstLabel, '.']
  }
  
  while (len) {
    let label = hex.slice((offset +1 ) * 2, (offset + 1 + len ) * 2)
    let labelBytes = Bytes.fromHexString(label)
  
    if(offset > 1){
      list = concat(list, dot)
    }else{
      firstLabel = labelBytes.toString()
    }
    list = concat(list, labelBytes)
    offset += len
    len = buf[offset++]
  }
  return [firstLabel, list.toString()]
}

export function createEventID(event:  ethereum.Event): Bytes {
    return Bytes.fromUTF8( event.block.number.toString().concat('-').concat(event.logIndex.toString() ));
}

export function createUniqueID(event:  ethereum.Event): string {
  return event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString())
}
 
export function concat(a: ByteArray, b: ByteArray): ByteArray {
  let out = new Uint8Array(a.length + b.length)
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i]
  }
  for (let j = 0; j < b.length; j++) {
    out[a.length + j] = b[j]
  }
  // return out as ByteArray
  return changetype<ByteArray>(out)
}
  
export function byteArrayFromHex(s: string): ByteArray {
  if(s.length % 2 !== 0) {
    throw new TypeError("Hex string must have an even number of characters")
  }
  let out = new Uint8Array(s.length / 2)
  for(var i = 0; i < s.length; i += 2) {
    out[i / 2] = parseInt(s.substring(i, i + 2), 16) as u32
  }
  return changetype<ByteArray>(out)
}
  
export function uint256ToByteArray(i: BigInt): ByteArray {
  let hex = i.toHex().slice(2).padStart(64, '0')
  return byteArrayFromHex(hex)
}
 
export function decode_utf16_pair(units: number[]): number
{ 
    let code = 0x10000;
    code += (units[0] & 0x03FF) << 10;
    code += (units[1] & 0x03FF);
    return code;
}

export function checkValidLabel(name: string): boolean {
  for (let i = 0; i < name.length; i++) {
    let c = name.charCodeAt(i);
    if (c === 0) {
      log.warning("Invalid label '{}' contained null byte. Skipping.", [name]);
      return false;
    } else if (c === 46) {
      log.warning(
        "Invalid label '{}' contained separator char '.'. Skipping.",
        [name]
      );
      return false;
    }
  }

  return true;
}