const {getText} = require('detox-getprops');

describe('Bike Stack', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  const sleep = (duration) =>
    new Promise((resolve) => setTimeout(() => resolve(), duration));

  const veryifyBottomNavigator = async () => {
    await expect(element(by.id('BottomTabNavigator')));
    await expect(element(by.id('ScheduleTab'))).toBeVisible;
    const getPropCheck = await getText(element(by.id('ScheduleTab')));
    console.log(getPropCheck);
    await expect(element(by.id('HistoryTab'))).toBeVisible;
    await expect(element(by.id('BikesTab'))).toBeVisible;
    await expect(element(by.id('ActivitiesTab'))).toBeVisible;
    await expect(element(by.id('MaintenanceTab'))).toBeVisible;
  };

  const getBikesTab = async () => {
    return await element(by.id('BikesTab'));
  };

  const getBikeListItem = async (index) => {
    const bikesTab = await getBikesTab();
    await expect(bikesTab).toBeVisible();
    await bikesTab.tap();

    return await element(by.id('BikeListItem' + index));
  };

  it('Main screen should show schedule screen and bottom navigation bar', async () => {
    await expect(element(by.id('ScheduleView'))).toBeVisible;
    await veryifyBottomNavigator();
  });

  it('Should navigate to bike screen after tap', async () => {
    const bikesTab = await getBikesTab();
    await expect(bikesTab).toBeVisible();
    await bikesTab.tap();

    // Check bike screen has appeared
    await expect(element(by.id('BikesView'))).toBeVisible;
    await expect(element(by.id('BikesList'))).toBeVisible;
    await veryifyBottomNavigator();

    await sleep(5000); // Only needed for M7 demonstration
  });

  it("Should show bike's component screen after tap", async () => {
    const bikeListItem = await getBikeListItem(0);
    await expect(bikeListItem).toBeVisible();
    await bikeListItem.tap();

    // Check the component screen has appeared
    await expect(element(by.id('ComponentsView'))).toBeVisible;
    await expect(element(by.id('ComponentsList'))).toBeVisible;
    await veryifyBottomNavigator();

    await sleep(5000); // Only needed for M7 demonstration
  });
});
