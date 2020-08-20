import { TestBed } from '@angular/core/testing';

import { MessagingChatService } from './messaging-chat.service';

describe('MessagingChatService', () => {
  let service: MessagingChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagingChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
