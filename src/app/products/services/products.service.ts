import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product, ProductsResponse} from '@products/interfaces/product.interface';
import {delay, Observable, of, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
const baseUrl = environment.baseUrl

interface Options {
  limit?: number;
   offset?: number;
   gender?: string;
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient)
  private productsCache = new Map<String, ProductsResponse>();
  private productCache = new Map<String, Product>();

  getProducts(options:Options): Observable<ProductsResponse> {
    const {limit = 8, offset = 0, gender = ''} = options;
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      console.log(`Usamos el cache para la consulta de la pagina ${(offset/8)+1}`)
      return of(this.productsCache.get(key)!)
    }
    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender,
      }
    })
      .pipe(
        tap(resp => console.log(resp)),
        tap(resp => this.productsCache.set(key, resp))
      );
  }

  getProductsByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      console.log(`Usamos el cache para la consulta del producto ${idSlug}`)
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(
        tap(resp => this.productCache.set(idSlug, resp))
      )
  }
}
