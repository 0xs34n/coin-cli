import { Map } from "immutable";

interface Payment extends Map<string, any>{
  amount: number,
  address: string,
  fee: number
}

export default Payment;