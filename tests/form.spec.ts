import { expect, test } from "@playwright/test";

test("create profile form", async ({ page }) => {
  await page.goto("http://localhost:3000/form");

  const formLocator = page.locator("form");

  const usernameContainer = formLocator.locator("div").filter({
    has: page.getByLabel("username"),
  });

  await expect(usernameContainer).toBeVisible();

  const usernameContainerMinCharErrorLocator = usernameContainer.getByText(
    "String must contain at least 2 character(s)"
  );

  await expect(usernameContainerMinCharErrorLocator).not.toBeVisible();

  const descriptionLocator = usernameContainer.getByText(
    "This is your public display name."
  );

  await expect(descriptionLocator).toBeVisible();

  const interestsContainer = formLocator
    .locator("div")
    .filter({
      has: page.getByRole("checkbox"),
    })
    .filter({
      has: page.getByText("Interests"),
    });

  await expect(interestsContainer).toBeVisible();

  // 1. 3 options are presented
  // 2. 3 options are what we want them to be
  // 3. Option must be selectable
  // 4. Multiple options can be selectable at the same time
  // 5. Option must be unselectable
  // 6. Clicking on the label should toggle the checkbox
  // 7. Clicking on the button should toggle the checkbox

  const LabelOptions = interestsContainer.locator("label").filter({
    hasNotText: "Interests",
  });

  await expect(LabelOptions).toHaveCount(3);

  const interestItems = ["Books", "Movies", "Music"];

  for (const interest of await LabelOptions.all()) {
    const interestText = await interest.textContent();

    expect(interestItems).toContain(interestText);
  }

  // const buttonOptions = interestsContainer.locator("button").filter({
  //   has: page.getByRole("checkbox"),
  // });

  const buttonOptions = interestsContainer
    .getByRole("checkbox")
    .and(page.locator("button"));

  await expect(buttonOptions).toHaveCount(3);

  const firstLabel = LabelOptions.first();

  await expect(firstLabel).toBeChecked();

  await firstLabel.uncheck();

  await expect(firstLabel).not.toBeChecked();

  await firstLabel.check();

  await expect(firstLabel).toBeChecked();

  const secondLabel = LabelOptions.nth(1);

  await expect(secondLabel).not.toBeChecked();

  await secondLabel.check();

  await expect(secondLabel).toBeChecked();
  await expect(firstLabel).toBeChecked();

  const lastLabel = LabelOptions.last();

  await expect(lastLabel).not.toBeChecked();

  const firstBtnOption = buttonOptions.first();

  await expect(firstBtnOption).toBeChecked();

  await firstBtnOption.click();

  await expect(firstBtnOption).not.toBeChecked();

  await firstBtnOption.click();

  await expect(firstBtnOption).toBeChecked();

  await secondLabel.uncheck();

  await expect(secondLabel).not.toBeChecked();

  for (const item of await buttonOptions.all()) {
    const isChecked = await item.isChecked();

    if (!isChecked) {
      await item.check();
    }

    await expect(item).toBeChecked();
  }

  const submitBtn = formLocator.getByRole("button", {
    name: "Submit",
  });

  await submitBtn.click();

  await expect(usernameContainerMinCharErrorLocator).toBeVisible();

  const usernameLabel = usernameContainer.getByLabel("Username");

  await expect(usernameLabel).toBeVisible();

  await usernameLabel.pressSequentially("One Piece");

  await expect(usernameLabel).toHaveValue("One Piece");

  await expect(usernameContainerMinCharErrorLocator).not.toBeVisible();

  //naitik-task from notify container
  const notifyContainer = formLocator
    .locator("div")
    .filter({ has: page.getByText("Notify me about...") });

  await expect(notifyContainer).toBeVisible();

  const notifyradiodiv = notifyContainer.getByRole("radiogroup");

  const notifyContainerRadioBtns = notifyradiodiv.getByRole("radio");
  // .and(page.locator("button"));
  await expect(notifyContainerRadioBtns).toHaveCount(3);

  const radio1 = notifyContainerRadioBtns.first();
  await expect(radio1).toBeVisible();

  // const radio2 = notifyContainerRadioBtns.getByText(
  //   "Direct messages and mentions"
  // );
  const radio2 = notifyContainerRadioBtns.nth(1);
  await expect(radio2).toBeVisible();

  const radio3 = notifyContainerRadioBtns.last();
  await expect(radio3).toBeVisible();

  //country container
  const countryContainer = formLocator
    .locator("div")
    .filter({ has: page.getByText("Country") });
  await expect(countryContainer).toBeVisible();

  const preOptions = ["India", "USA", "UK"];
  const countryContainerSelectOptions = countryContainer.locator("select");
  // .selectOption(["India", "USA", "UK"])

  const spanText = countryContainer.locator("span");

  for (const singleOption of preOptions) {
    await countryContainerSelectOptions.selectOption(singleOption);
    await expect(spanText).toHaveText(singleOption);
    console.log(await countryContainerSelectOptions.inputValue());
    await expect(countryContainerSelectOptions).toHaveValue(
      await countryContainerSelectOptions.inputValue()
    );
  }
  // await expect(spanText).toHaveText("USA");
});
