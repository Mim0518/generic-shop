import {Component, inject} from '@angular/core';
import {ProductsService} from '@products/services/products.service';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {ProductCard} from '@products/components/product-card/product-card';
import {map} from 'rxjs';
import {PaginationService} from '@shared/components/pagination/pagination.service';
import {Pagination} from '@shared/components/pagination/pagination';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCard,
    Pagination,
  ],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  private productsService = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);
  gender = toSignal(this.activatedRoute.params.pipe(map(({ gender }) => gender)
  ))
  protected paginationService = inject(PaginationService)
  productsResource = rxResource({
    params: () => ({gender: this.gender(), page : this.paginationService.currentPage()}),
    stream: ({params}) => {
      return this.productsService.getProducts({
        limit: 10,
        gender: params.gender,
        offset: (this.paginationService.currentPage() - 1) * 8,
      })
    }
  });
}
