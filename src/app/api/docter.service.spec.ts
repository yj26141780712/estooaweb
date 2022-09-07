import { TestBed } from '@angular/core/testing';

import { DocterService } from './docter.service';

describe('DocterService', () => {
  let service: DocterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
