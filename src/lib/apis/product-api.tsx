import { Product } from "@/types/product";
import axios, { AxiosResponse } from "axios";
import _fetch from "../_fetch";
import { Region } from "@/types/region";

const url = process.env.NEXT_PUBLIC_API_URL;

const ProductApi = {
  getProducts: (period: number): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/products?period=${period}`);
  },
  getProductByCode: async (code: string): Promise<Product> => {
    const res = await axios.get(`${url}/api/products/${code}`);
    return res.data.data as Product;
  },
  getProductByName: (name: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/productsByName/${name}`);
  },
  getProductByRegion: (name: string, region: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/productsByName/${name}?region=${region}`);
  },
  getRegions: async (lang: string, code: string): Promise<Region[]> => {
    const res = await axios.get(`${url}/api/regions/${code}?lang=${lang}`);
    return res.data.data as Region[];
  },
};

export default ProductApi;
