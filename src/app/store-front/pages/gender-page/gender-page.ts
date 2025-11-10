import {Component, inject} from '@angular/core';
import {ProductsService} from '@products/services/products.service';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {ProductCard} from '@products/components/product-card/product-card';
import {map} from 'rxjs';
import {I18nPluralPipe} from '@angular/common';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCard,
  ],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  private productsService = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);
  gender = toSignal(this.activatedRoute.params.pipe(map(({ gender }) => gender)
  ))
  productsResource = rxResource({
    params: () => ({gender: this.gender()}),
    stream: ({params}) => {
      return this.productsService.getProducts({
        limit: 8,
        gender: params.gender
      })
    }
  });
}
