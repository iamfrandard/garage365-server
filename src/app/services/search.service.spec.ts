import { TestBed } from '@angular/core/testing';

import { SearchServiceComponent } from './search.service';

describe('SearchServiceComponent', () => {
  let service: SearchServiceComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchServiceComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
