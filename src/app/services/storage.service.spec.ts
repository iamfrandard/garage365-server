import { TestBed } from '@angular/core/testing';

import { StorageServiceComponent } from './storage.service';

describe('StorageServiceComponent', () => {
  let service: StorageServiceComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageServiceComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
