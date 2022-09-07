import { TestBed } from '@angular/core/testing';

import { BaseinfoService } from './baseinfo.service';

describe('BaseinfoService', () => {
  let service: BaseinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
