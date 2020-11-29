const {getProps} = require('detox-getprops');

describe('Accessibility', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  const sleep = (duration) =>
    new Promise((resolve) => setTimeout(() => resolve(), duration));

  const checkButtonSize = async (prop) => {
    const button_height = prop.height > 48;
    const button_width = prop.width > 48;
    await expect(button_height).toHaveValue(true);
    await expect(button_width).toHaveValue(true);
  };

  it('Placeholder test', async () => {
    return true;
  });
});
