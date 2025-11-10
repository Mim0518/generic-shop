import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {ProductsService} from '@products/services/products.service';
import {ProductImagePipe} from '@products/pipes/product-image.pipe';
import {CurrencyPipe} from '@angular/common';
import {ProductCarousel} from '@products/components/product-carousel/product-carousel';

@Component({
  selector: 'app-product-page',
  imports: [
    ProductCarousel
  ],
  templateUrl: './product-page.html',
})
export class ProductPage {
  private productsService = inject(ProductsService)
  private activatedRoute = inject(ActivatedRoute)
  constructor(private route: ActivatedRoute) {}
  productIdSlug: string = this.activatedRoute.snapshot.paramMap.get('idSlug') || '';
  productPageResource = rxResource({
    params: () => ({idSlug: this.productIdSlug}),
    stream: () => {
      return this.productsService.getProductsByIdSlug(this.productIdSlug)
    }
  })
}
