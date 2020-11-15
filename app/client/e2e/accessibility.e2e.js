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

  it('Bottom navigator buttons should be at least 48x48', async () => {
    await expect(element(by.id('BottomTabNavigator')));

    await expect(element(by.id('ScheduleTab'))).toBeVisible;
    const schedule_prop = await getProps(element(by.id('ScheduleTab')));
    checkButtonSize(schedule_prop);

    await expect(element(by.id('HistoryTab'))).toBeVisible;
    const history_prop = await getProps(element(by.id('HistoryTab')));
    checkButtonSize(history_prop);

    await expect(element(by.id('BikesTab'))).toBeVisible;
    const bikes_prop = await getProps(element(by.id('BikesTab')));
    checkButtonSize(bikes_prop);

    await expect(element(by.id('ActivitiesTab'))).toBeVisible;
    const activities_prop = await getProps(element(by.id('ActivitiesTab')));
    checkButtonSize(activities_prop);

    await expect(element(by.id('MaintenanceTab'))).toBeVisible;
    const maintenance_prop = await getProps(element(by.id('MaintenanceTab')));
    checkButtonSize(maintenance_prop);
  });
});
