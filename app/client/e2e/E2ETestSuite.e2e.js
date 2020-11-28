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
    await expect(bike).toExist();
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

  const fillOutTaskForm = async (description, threshold) => {
    await element(by.id('TitleTextInput')).typeText(description);
    await element(by.id('AddTaskScreen')).scrollTo('bottom');
    if (threshold)
      await element(by.id('ThresholdTextInput')).typeText(threshold);
    await element(by.id('AddTaskScreen')).scrollTo('bottom');
    await element(by.id('RepeatBtn')).tap(); // Make task repeating
    await element(by.id('SaveTaskBtn')).tap();
  };

  const clearFormText = async () => {
    await element(by.id('TitleTextInput')).clearText();
    await element(by.id('AddTaskScreen')).scrollTo('bottom');
    await element(by.id('ThresholdTextInput')).clearText();
  };

  // NOTE: App should be in a test state where it has no data?? -No

  // NOTE: make sure AddTaskScreen TaskType dropdown defaults to a value
  it('Component should be added and then removed', async () => {
    await sleep(1000);
    await veryifyBottomNavigator();
    await goToBikesTab();
    await goToBikeAtIndex(0);

    // Add component
    const componentType = 'Chain';
    const componentName = 'CH9000';
    // await sleep(10000); // FAIL HERE
    // Note: Can remove the following 4 lines to pass the test for M9
    await element(by.id('AddComponentBtn')).tap();
    await element(by.id('ComponentTypeAutoComplete')).typeText(componentType);
    await element(by.id('ComponentNameTextInput')).typeText(componentName);
    await sleep(1000);
    await element(by.id('SaveComponentBtn')).tap();
    await sleep(5000);

    // Verify new component exists in the list
    await expect(
      element(
        by
          .text(componentType + ': ' + componentName)
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
          .text(componentType + ': ' + componentName)
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
    await element(by.id('AddTaskBtn')).tap();

    // Verify add task screen appeared as expected
    await expect(element(by.id('AddTaskScreen'))).toBeVisible();
    await expect(element(by.id('FixedBikeText'))).toBeVisible();
    await expect(element(by.id('FixedComponentText'))).toBeVisible();
    await expect(element(by.id('TitleTextInput'))).toBeVisible();
    await expect(element(by.id('CancelTaskBtn'))).toBeVisible();
    await expect(element(by.id('SaveTaskBtn'))).toBeVisible();
    await expect(element(by.id('RepeatBtn'))).toBeVisible();

    /* Try invalid threshold input */
    // Randomize title so we get unique titles each time we run tests
    let title =
      'Oil Chain' + Math.floor(Math.random() * Math.floor(1000)).toString();
    let threshold = null;
    await fillOutTaskForm(title, threshold);

    // Verify error message
    await expect(element(by.text('Please enter a threshold.'))).toExist();
    await element(by.id('ErrorPopupOkBtn')).tap();

    clearFormText();

    /* Valid task form input */
    threshold = '100';
    await fillOutTaskForm(title, threshold);

    // Verify the task appears in the list
    await expect(
      element(by.text(title).withAncestor(by.id('TasksList'))),
    ).toExist();
  });

  it('Task should be marked as completed and reflected in maintenance record screen', async () => {
    const taskTitle = 'Replace Brake Pads';
    // Verify we start off on the schedule screen
    await expect(element(by.id('ScheduleList'))).toBeVisible();
    // Verify the expected a hard-coded maintenance task is present
    await expect(element(by.text(taskTitle))).toExist();

    // Complete the task
    await element(by.id('EditBtn')).tap();
    await completeListItemAtIndex(0);
    await element(by.id('EditBtn')).tap();

    // Verify the task is deleted from the schedule
    await expect(
      element(by.text(taskTitle).withAncestor(by.id('ScheduleList'))),
    ).not.toExist();

    // Navigate to maintenance history
    await goToHistoryTab();

    // Verify an item exists with same description and date
    await expect(
      element(by.text(taskTitle).withAncestor(by.id('HistoryList'))),
    ).toExist();
  });
});
