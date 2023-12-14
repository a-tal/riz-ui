import { Scene, SceneMode } from '@/models';

describe('sceneName', () => {
  it('doesnt split Fireplace', () => {
    expect(new Scene(SceneMode.Fireplace).name).toMatch('Fireplace');
  });

  it('splits CamelCase correctly', () => {
    expect(new Scene(SceneMode.TrueColors).name).toMatch('True Colors');
  });
});
