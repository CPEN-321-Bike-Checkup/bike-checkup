describe('Bike Stack', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  const sleep = (duration) =>
    new Promise((resolve) => setTimeout(() => resolve(), duration));

  const veryifyBottomNavigator = async () => {
    await expect(element(by.id('BottomTabNavigator')));
    await expect(element(by.id('ScheduleTab'))).toBeVisible();
    await expect(element(by.id('HistoryTab'))).toBeVisible();
    await expect(element(by.id('BikesTab'))).toBeVisible();
    await expect(element(by.id('ActivitiesTab'))).toBeVisible();
  };

  const goToBikesTab = async () => {
    let bikesTab = await element(by.id('BikesTab'));
    await expect(bikesTab).toBeVisible();
    await bikesTab.tap();

    // Verify bikes screen
    await expect(element(by.id('BikesList'))).toBeVisible();
  };

  const goToHistoryTab = async () => {
    let historyTab = await element(by.id('HistoryTab'));
    await expect(historyTab).toBeVisible();
    await historyTab.tap();

    // Verify bikes screen
    await expect(element(by.id('HistoryList'))).toBeVisible();
  };

  const goToBikeAtIndex = async (index) => {
    let bike = await element(by.id('BikeListItem' + index));
    await expect(bike).toBeVisible();
    await bike.tap();

    // Verify components screen
    await expect(element(by.id('ComponentsList'))).toBeVisible();
  };

  const goToComponentAtIndex = async (index) => {
    let component = await element(by.id('ComponentListItem' + index));
    await expect(component).toExist();
    await component.tap();

    // Verify tasks screen
    await expect(element(by.id('TasksList'))).toBeVisible();
  };

  const removeListItemAtIndex = async (index) => {
    let rmvBtn = await element(
      by.id('ComponentListItem' + index + 'RemoveBtn'),
    );
    await expect(rmvBtn).toBeVisible();
    await rmvBtn.tap();
  };

  const completeListItemAtIndex = async (index) => {
    let completeBtn = await element(
      by.id('ScheduleListItem' + index + 'CompleteBtn'),
    );
    await expect(completeBtn).toBeVisible();
    await completeBtn.tap();
  };

  const fillOutTaskForm = async (description, scheduleType, threshold) => {
    await element(by.id('TaskDescription')).typeText(description);
    if (scheduleType) {
      await element(by.id(scheduleType + 'Btn')).tap();
    }
    await element(by.id('TaskDescription')).typeText(threshold);
    await element(by.id('SaveTaskBtn')).tap();
  };

  // NOTE: App should be in a test state where it has no data?? -No

  it('Component should be added and then removed', async () => {
    await veryifyBottomNavigator();
    await goToBikesTab();
    await goToBikeAtIndex(0);

    // Add component
    const componentName = 'Chain';
    const modelName = 'CN-9000';
    await sleep(10000); // FAIL HERE
    // Note: Can remove the following 4 lines to pass the test for M9
    await element(by.id('AddComponentBtn')).tap();
    await element(by.id('ComponentName')).typeText(componentName);
    await element(by.id('ModelName')).typeText(modelName);
    await element(by.id('SaveBtn')).tap();

    // Verify new component exists in the list
    await expect(
      element(
        by
          .text(componentName + ' - ' + modelName)
          .withAncestor(by.id('ComponentsList')),
      ),
    ).toExist();

    // Remove the component (the component will be the only item in the list)
    await element(by.id('EditBtn')).tap();
    await removeListItemAtIndex(0);

    // Verify component was removed
    await expect(
      element(
        by
          .text(componentName + ' - ' + modelName)
          .withAncestor(by.id('ComponentsList')),
      ),
    ).not.toExist();
  });

  it('New task should be added', async () => {
    await veryifyBottomNavigator();
    await goToBikesTab();
    await goToBikeAtIndex(0);
    await goToComponentAtIndex(3); // TODO: Figure out why the items are rendered twice

    // Click add task
    await element(by.id('AddTaskBtn')).tap();

    // Verify add task screen appeared with the expected components
    await expect(element(by.id('AddTaskScreen'))).toBeVisible();
    await sleep(10000); // FAIL HERE
    await expect(element(by.id('TaskDescription'))).toBeVisible();
    await expect(element(by.id('DistanceBtn'))).toBeVisible();
    await expect(element(by.id('TimeBtn'))).toBeVisible();
    await expect(element(by.id('TaskDescription'))).toBeVisible();
    await expect(element(by.id('SaveTaskBtn'))).toBeVisible();

    // NOTE: Fails here in M9

    /* Try invalid task form inputs */
    // Fail to select schedule type
    let description = 'Oil chain';
    let scheduleType = null;
    let threshold = 64;
    await fillOutTaskForm(description, scheduleType, threshold);

    // Verify error message
    await expect(
      element(by.text('Please select a schedule type')),
    ).toExist();
    await element(by.id('OkBtn')).tap();

    // Negative threshold
    description = 'Oil chain';
    scheduleType = 'Distance';
    threshold = -23;
    await fillOutTaskForm(description, scheduleType, threshold);

    // Verify error message
    await expect(
      element(by.text('Threshold cannot be negative')),
    ).toExist();
    await element(by.id('OkBtn')).tap();

    /* Valid task form input */
    description = 'Oil chain';
    scheduleType = 'Distance';
    threshold = 100;
    await fillOutTaskForm(description, scheduleType, threshold);

    // Verify the task appears in the list
    await expect(
      element(by.text(taskDescription).withAncestor(by.id('TasksList'))),
    ).toExist();
  });

  it('Task should be marked as completed and reflected in maintenance record screen', async () => {
    const taskDescription = 'Replace casette';
    // Verify we start off on the schedule screen
    await expect(element(by.id('ScheduleList'))).toBeVisible();
    // Verify the expected a hard-coded maintenance task is present
    await expect(element(by.text(taskDescription))).toExist();

    // Complete the task
    await element(by.id('EditBtn')).tap();
    await completeListItemAtIndex(0);

    await sleep(10000); // FAIL HERE
    // Verify the task is deleted from the schedule
    await expect(
      element(by.text(taskDescription).withAncestor(by.id('ScheduleList'))),
    ).not.toExist();

    // Navigate to maintenance history
    await goToHistoryTab();

    // Verify an item exists with same description and date
    await expect(
      element(by.text(taskDescription).withAncestor(by.id('HistoryList'))),
    ).toExist();
  });
});
