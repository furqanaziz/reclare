import createContext from '../../src/ctx/createContext';
import { ON_EVENT } from '../../src/config/constants';

describe('declarationLifecycle', () => {
  test('all situations should receive the same state', () => {
    const ctx = createContext({
      initialState: { count: 1 },
      [ON_EVENT]: [
        {
          on: 'decrement',
          situation: ({ state }) => state.count > 0,
          reducer: ({ state }) => ({ ...state, count: state.count - 1 })
        },
        {
          on: 'decrement',
          situation: ({ state }) => state.count <= 0,
          reaction: () => {
            throw new Error('counter at zero');
          }
        }
      ]
    });
    // First declaration will be invoked first. It shouldn't decrement
    // the counter before the second situation is evaluated.
    expect(() => ctx.broadcast('decrement')).not.toThrow();
  });

  test('reducers should run before reactions', () => {
    let order = '';
    const ctx = createContext({
      [ON_EVENT]: [
        {
          on: 'increment',
          reducer: ({ state }) => {
            order += 'a';
            return { ...state, count: state.count + 1 };
          },
          reaction: () => {
            order += 'b';
          }
        }
      ]
    });
    ctx.broadcast('increment');
    expect(order).toBe('ab');
  });
});
