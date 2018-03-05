var rsvpService = require('./rsvp.service');

describe('RSVP Service', () => {

  it('should return a list of rsvp', (done) => {
    rsvpService.intitations({user_id: '5a96fae1b7c1a81c14bc47d7'}).then((rsvps) => {
      expect(rsvps).toBeDefined();
      done();
    })
    .catch(console.log);
  });

  it('should return an invitation including the event and user who created the evetn', (done) => {
    rsvpService.intitations({user_id: '5a96fae1b7c1a81c14bc47d7'}).then((rsvps) => {
      expect(rsvps[0].event).toBeDefined();
      expect(rsvps[0].user).toBeDefined();
      done();
    })
    .catch(err => {
      console.log(err);
      expect(err).toBeUndefined ();   
      done();   
    });
  });

  });