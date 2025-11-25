import {Component, Output, output, signal} from '@angular/core';

@Component({
  selector: 'items-per-page-selector',
  imports: [],
  templateUrl: './items-per-page-selector.html',
})
export class ItemsPerPageSelector {
  itemsPerPage = output<number>();
  handleItemsPerPageChange(event:Event){
    const select = Number((event.target as HTMLSelectElement).value);
    this.itemsPerPage.emit(select);
  }
}
