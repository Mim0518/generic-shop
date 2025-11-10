import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product, ProductsResponse} from '@products/interfaces/product.interface';
import {Observable, tap} from 'rxjs';
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

  getProducts(options:Options): Observable<ProductsResponse> {
    const {limit = 8, offset = 0, gender = ''} = options;
    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender,
      }
    })
      .pipe(
        tap(resp => console.log(resp))
      );
  }

  getProductsByIdSlug(idSlug: string): Observable<Product> {
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(
        tap(resp => console.log(resp))
      )
  }
}
