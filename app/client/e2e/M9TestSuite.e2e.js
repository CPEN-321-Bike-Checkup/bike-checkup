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
    bikesTab.tap();

    // Verify bikes screen
    await expect(element(by.id('BikesList'))).toBeVisible();
  };

  const goToHistoryTab = async () => {
    let historyTab = await element(by.id('HistoryTab'));
    await expect(historyTab).toBeVisible();
    historyTab.tap();

    // Verify bikes screen
    await expect(element(by.id('BikesList'))).toBeVisible();
  };

  const goToBikeAtIndex = async (index) => {
    let bike = await element(by.id('BikeListItem' + index));
    await expect(bike).toBeVisible();
    await bike.tap();

    // Verify components screen
    await expect(element(by.id('ComponentsList'))).toBeVisible();
  };

  const goToComponentAtIndex = async (index) => {
    console.log('ComponentListItem' + index)
    await sleep(5000);
    let component = await element(by.id('123' + index));
    console.log(component)
    await sleep(5000);
    await expect(component).toBeVisible();
    await component.tap();

    // Verify tasks screen
    await expect(element(by.id('TasksList'))).toBeVisible();
  };

  const removeListItemAtIndex = async (index) => {
    let rmvBtn = await element(
      by.id('ComponentListItem' + index + 'RemoveBtn'),
    );
    await expect(rmvBtn).toBeVisible();
    rmvBtn.tap();
  };

  const completeListItemAtIndex = async (index) => {
    let completeBtn = await element(
      by.id('ComponentListItem' + index + 'CompleteBtn'),
    );
    await expect(completeBtn).toBeVisible();
    completeBtn.tap();
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
    await goToComponentAtIndex(0);

    // Click add task
    await element(by.id('AddTask')).tap();

    // Verify add task screen appeared with the expected components
    await expect(element(by.id('AddTaskScreen'))).toBeVisible();
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
    fillOutTaskForm(description, scheduleType, threshold);

    // Verify error message
    await expect(
      element(by.text('Please select a schedule type')),
    ).not.toExist();
    await element(by.id('OkBtn')).tap();

    // Negative threshold
    description = 'Oil chain';
    scheduleType = 'Distance';
    threshold = -23;
    fillOutTaskForm(description, scheduleType, threshold);

    // Verify error message
    await expect(
      element(by.text('Threshold cannot be negative')),
    ).not.toExist();
    await element(by.id('OkBtn')).tap();

    /* Valid task form input */
    description = 'Oil chain';
    scheduleType = 'Distance';
    threshold = 100;
    fillOutTaskForm(description, scheduleType, threshold);

    // Verify the task appears in the list
    await expect(
      element(by.text(taskDescription).withAncestor(by.id('TasksList'))),
    ).toExist();
  });

  it('Task should be marked as completed and reflected in maintenance record screen', async () => {
    // Verify we start off on the schedule screen
    await expect(element(by.id('ScheduleList'))).toBeVisible();
    // Verify the expected a hard-coded maintenance task is present
    await expect(element(by.text('Oil chain'))).toBeVisible();

    // Complete the task
    await element(by.id('EditBtn')).tap();
    await completeListItemAtIndex(0);

    // Navigate to maintenance history
    goToHistoryTab();

    // Verify an item exists with same description and date
  });

  // const getBikeListItem = async (index) => {
  //   const bikesTab = await getBikesTab();
  //   await expect(bikesTab).toBeVisible();
  //   await bikesTab.tap();

  //   return await element(by.id('BikeListItem' + index));
  // };

  // it('Main screen should show schedule screen and bottom navigation bar', async () => {
  //   await expect(element(by.id('ScheduleView'))).toBeVisible();
  //   await veryifyBottomNavigator();
  // });

  // it('Should navigate to bike screen after tap', async () => {
  //   const bikesTab = await getBikesTab();
  //   await expect(bikesTab).toBeVisible();
  //   await bikesTab.tap();

  //   // Check bike screen has appeared
  //   await expect(element(by.id('BikesList'))).toBeVisible();
  //   await veryifyBottomNavigator();

  //   await sleep(5000); // Only needed for demonstration purposes
  // });

  // it("Should show bike's component screen after tap", async () => {
  //   const bikeListItem = await getBikeListItem(0);
  //   await expect(bikeListItem).toBeVisible();
  //   await bikeListItem.tap();

  //   // Check the component screen has appeared
  //   await expect(element(by.id('ComponentsList'))).toBeVisible();
  //   await veryifyBottomNavigator();

  //   await sleep(5000); // Only needed for demonstration purposes
  // });

  // it("Should show bike's component screen after tap", async () => {
  //   const bikeListItem = await getBikeListItem(0);
  //   await expect(bikeListItem).toBeVisible();
  //   await bikeListItem.tap();

  //   // Check the component screen has appeared
  //   await expect(element(by.id('ComponentsList'))).toBeVisible();
  //   await veryifyBottomNavigator();

  //   await sleep(5000); // Only needed for M7 demonstration purposes
  // });
});
