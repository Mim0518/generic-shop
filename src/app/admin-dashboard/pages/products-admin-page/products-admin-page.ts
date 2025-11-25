import {Component, inject, ResourceRef, signal} from '@angular/core';
import {ProductTable} from '@products/components/product-table/product-table';
import {ProductsService} from '@products/services/products.service';
import {PaginationService} from '@shared/components/pagination/pagination.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {ProductsResponse} from '@products/interfaces/product.interface';
import {Pagination} from '@shared/components/pagination/pagination';
import {ItemsPerPageSelector} from '@shared/components/items-per-page-selector/items-per-page-selector';

@Component({
  selector: 'app-products-admin-page',
  imports: [
    ProductTable,
    Pagination,
    ItemsPerPageSelector
  ],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  private productsService = inject(ProductsService);
  protected paginationService = inject(PaginationService);
  private itemsPerPage = signal(10);
  handleItemsPerPageEmission(itemsPage:number){
    console.log('Items changed to: ', itemsPage)
    this.itemsPerPage.set(itemsPage);

  }
  productsResource = rxResource({
    params: () => ({
      page : this.paginationService.currentPage() - 1,
      limit: this.itemsPerPage()
    }),
    stream: ({params}) => {
      return this.productsService.getProducts({
        offset: this.paginationService.currentPage() * 8,
        limit: params.limit,
      })
    }
  });
}
