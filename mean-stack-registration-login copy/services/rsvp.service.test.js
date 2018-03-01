var rsvpService = require('./rsvp.service');

describe('RSVP Service', () => {
    it('should return a list of rsvp', (done) => {
      rsvpService.intitations({user_id: '5a96fae1b7c1a81c14bc47d7'}).then((rsvps) => {
        expect(rsvps).toBeDefined();
        done();
      });
    });
  });