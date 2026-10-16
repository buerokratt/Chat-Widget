import AuthenticationService from './authentication-service';
import http from './http-service';

jest.mock('../services/http-service');

describe('AuthenticationService', () => {
  it('should get current user info using cookie credentials', async () => {
    const info = { firstName: 'Test', lastName: 'User', personalCode: '11111', jwtExpirationTimestamp: '2026-10-15' };
    (http.get as jest.Mock).mockResolvedValue(info);
    await expect(AuthenticationService.customJwtUserinfo()).resolves.toEqual(info);
    expect(http.get).toHaveBeenCalledWith('/auth/jwt/userinfo');
    expect(http.post).not.toHaveBeenCalled();
  });
});
