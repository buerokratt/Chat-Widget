import { rest } from 'msw';
import { server } from '../mocks/server';
import http from './http-service';

describe('HttpService', () => {
  it('allows empty successful responses used by void operations', async () => {
    server.use(rest.post(`${window._env_.RUUTER_API_URL}/empty`, (_req, res, ctx) => res(ctx.status(200))));
    await expect(http.post('/empty')).resolves.toMatchObject({ status: 200 });
  });
  it.each([null, false, '', 0])('preserves falsy response wrapper %p without inventing an error', async (value) => {
    server.use(rest.post(`${window._env_.RUUTER_API_URL}/void`, (_req, res, ctx) => res(ctx.json({ response: value }))));
    await expect(http.post('/void')).resolves.toMatchObject({ status: 200, data: { response: value } });
  });
  it('unwraps the complete Ruuter result object', async () => {
    const response = { some_conf: 'string response', enabled: false };
    server.use(rest.post(`${window._env_.RUUTER_API_URL}/ok`, (_req, res, ctx) => res(ctx.json({ response }))));
    await expect(http.post('/ok')).resolves.toEqual(response);
  });
  it('rejects HTTP failures', async () => {
    server.use(rest.post(`${window._env_.RUUTER_API_URL}/error`, (_req, res, ctx) => res(ctx.status(500))));
    await expect(http.post('/error')).rejects.toThrow('500');
  });
});
