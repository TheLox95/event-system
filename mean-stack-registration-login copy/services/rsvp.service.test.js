var rsvpService = require('./rsvp.service');

describe('RSVP Service', () => {
    it('should return a list of rsvp', (done) => {
      rsvpService.intitations({user_id: '5a96fae1b7c1a81c14bc47d7'}).then((rsvps) => {
        expect(rsvps).toBeDefined();
        done();
      });
    });

    it('should return a list of rsvp by event id', (done) => {
      rsvpService.getByEvent("5a973fab20425bde9633e555").then((rsvps) => {
        expect(rsvps).toBeDefined();
        done();
      }).catch((err) => {
        console.log(err);
      });
    });


  });