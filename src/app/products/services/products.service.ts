import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Gender, Product, ProductsResponse, Size} from '@products/interfaces/product.interface';
import {Observable, of, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {User} from '@auth/interfaces/user.interface';
const baseUrl = environment.baseUrl

interface Options {
  limit?: number;
   offset?: number;
   gender?: string;
}
const emptyProduct: Product = {
  id:          'new',
  title:       '',
  price:       0,
  description: '',
  slug:        '',
  stock:       0,
  sizes:       [],
  gender:      Gender.Men,
  tags:        [],
  images:      [],
  user:        {} as User,
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
        // tap(resp => console.log(resp)),
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

  getProductsById(id: string): Observable<Product> {
    if(id=== 'new') return of(emptyProduct);
    if (this.productCache.has(id)) {
      console.log(`Usamos el cache para la consulta del producto ${id}`)
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`)
      .pipe(
        tap(resp => this.productCache.set(id, resp))
      )
  }
  updateProduct(id:string, productLike: Partial<Product>): Observable<Product>{
    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(
        tap(resp => this.updateProductCache(resp))
      )
  }

  updateProductCache(product: Product) {
    console.log('Actualizando el cache del producto', product.id)
    this.productCache.set(product.id, product);
    this.productsCache.forEach((productResponse, key) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => currentProduct.id === product.id ? product : currentProduct
      );
    });
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
      .pipe(
        tap(resp => this.updateProductCache(resp))
      );
  }
}
