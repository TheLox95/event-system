var eventService = require('./event.service');

describe('Event Service', () => {
    it('return a q promise', () => {
      expect(eventService.create({event_name: 'Party'})).toBeDefined();
    });
  });