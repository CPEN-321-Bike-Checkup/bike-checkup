describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Placeholder Test', async () => {
    return true;
  });

  // it('Should open to Strava login screen', async () => {
  //   await expect(element(by.id('BottomTabNavigator')));
  // });

  // it('Should open to Strava login screen 2', async () => {
  //   let scheduleScreen = element(by.id('ScheduleScreen'))
  //   await expect(scheduleScreen).toBeVisible();
  //   await scheduleScreen.tap()
  // });

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});
