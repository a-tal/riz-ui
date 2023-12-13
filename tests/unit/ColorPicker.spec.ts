import { shallowMount } from '@vue/test-utils';

import ColorPicker from '@/components/ColorPicker.vue';

describe('ColorPicker.vue', () => {
  it('renders props.title when passed', () => {
    const title = 'new message';
    const wrapper = shallowMount(ColorPicker, {
      props: { title },
    });
    expect(wrapper.text()).toMatch(title);
  });
});
