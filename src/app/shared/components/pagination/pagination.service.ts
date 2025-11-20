import {inject, Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {
  activatedRoute = inject(ActivatedRoute);
  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => Number(params.get('page')) || 1)
    ),
    {
      initialValue: 1
    }
  );
}
