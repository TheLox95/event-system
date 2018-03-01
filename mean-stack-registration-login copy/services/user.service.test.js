var userService = require('./user.service');

describe('User Service', () => {
    it('return a promise', () => {
      expect(userService.getByUsername('leo')).toBeDefined();
    });

    it('should resolve', function (done) {
      userService.getByUsername('leo').then(function (user) {
        expect(user).toBeDefined();
        expect(user.username).toBe('leo');
        done();
      });
    });
  });