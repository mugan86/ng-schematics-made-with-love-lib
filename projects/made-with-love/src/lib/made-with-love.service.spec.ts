import { TestBed } from '@angular/core/testing';

import { MadeWithLoveService } from './made-with-love.service';

describe('MadeWithLoveService', () => {
  let service: MadeWithLoveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MadeWithLoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
