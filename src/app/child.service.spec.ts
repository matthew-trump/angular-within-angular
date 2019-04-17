import { TestBed } from '@angular/core/testing';

import { ChildService } from './child.service';

describe('ChildService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChildService = TestBed.get(ChildService);
    expect(service).toBeTruthy();
  });
});
