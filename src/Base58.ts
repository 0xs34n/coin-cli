const bs58 = require('bs58');
class Base58 {
    public static encodeAddress(address){
        const bytes = Buffer.from(address, 'hex')
        const encodeAddress = bs58.encode(bytes)
        return encodeAddress;
    }
    public static decodeAddress(address){
        const bytes = bs58.decode(address)
        return bytes.toString('hex');
    }
}
export default Base58;