import {Component, computed, input, linkedSignal} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'shared-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);
  pages = input<number>(0);

  pagesCount = computed(()=> {
    return Array.from({length: this.pages()}, (_, i) => i + 1);
  })
}
