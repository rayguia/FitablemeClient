export interface Calculator{
  calculatorId:number;
  vin?: string;
  loteNumber?:string;
  autionDate:Date;
  year:number;
  make?:string;
  model?:string;
  type?:string;
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

}



