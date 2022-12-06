export interface IAlltimebills {
  year:number;
  make?:string;
  model?:string;
  serie?:string;
  id: number;
  name: string;
  price: number;
  providerName: string;
  calculator_id:number;
  created_at:Date;
  updated_at:Date;
}
