import { assertSentryTransaction, TestEnv } from '../../../../../utils';

test('should auto-instrument `mysql` package when using query without callback', async () => {
  const env = await TestEnv.init(__dirname);
  const envelope = await env.getEnvelopeRequest({ envelopeType: 'transaction' });

  expect(envelope).toHaveLength(3);

  assertSentryTransaction(envelope[2], {
    transaction: 'Test Transaction',
    tags: {
      result_done: 'yes',
      result_done2: 'yes',
    },
    spans: [
      {
        description: 'SELECT 1 + 1 AS solution',
        op: 'db',
        data: {
          'db.system': 'mysql',
          'server.address': 'localhost',
          'server.port': 3306,
          'db.user': 'root',
        },
      },

      {
        description: 'SELECT NOW()',
        op: 'db',
        data: {
          'db.system': 'mysql',
          'server.address': 'localhost',
          'server.port': 3306,
          'db.user': 'root',
        },
      },
    ],
  });
});