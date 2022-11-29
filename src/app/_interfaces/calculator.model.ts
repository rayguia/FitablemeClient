import { ICalculatorBills } from "./ICalculatorBills";

export interface Calculator{
  id:number;
  vin?: string;
  loteNumber?:string;
  auctionDate:Date;
  year:number;
  make?:string;
  model?:string;
  serie?:string;
  saleType?:string;
  titleType?:string;
  link?:string;
  maxAmountToOffer:number;
  marketValue:number;
  marketValueFinal:number;
  buyAutionAmount:number;
  buyAutionFeePercent:number;
  buyAutionName?:string;
  saleAutionAmount:number;
  saleAutionPercent:number;
  saleAutionName?:string;
  floorplanAmount:number;
  earningsAmount:number;
  earningPercent:number;
  fixPrice:number;
  transportPrice:number;
  taxTitle:number;
  others:number;
  purchased:boolean;
  purchasedValueNoFees:number;
  purchasedValueFinal:number;
  soldValue:number;
  isSold:boolean;
  totalInvested?:number;
  earningsFinal?:number;
  calculatorBills:ICalculatorBills[];


}



