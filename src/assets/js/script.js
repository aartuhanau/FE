const ID = "id";

const CLASSES = {
  ACTIONS: "product-list-item__actions",
  ACTION: "product-list-item__action",
  ACTION_ACTIVE: "product-list-item__action--active",
  ACTION_HIDDEN: "product-list-item__action--hidden",
  ACTION_COMPARE: "product-list-item__action--compare",
  ACTION_FAVORITE: "product-list-item__action--favorite",
  MENU_COMPARE: "product-grid__menu-item--compare",
  MENU_ALL: "product-grid__menu-item--all",
  MENU_FAVORITES: "product-grid__menu-item--favorites",
  MENU_HIDE: "product-grid__menu-item--show-hidden",
  MENU_ITEM: "product-grid__menu-item",
  MENU_ITEM_ACTIVE: "product-grid__menu-item--active",
  MENU_SELECTOR: "product-grid__menu-item-selector",
  LIST_ITEM_HIDDEN: "product-list-item--hide",
  LIST_ITEM_TRANSPARENT: "product-list-item--transparent",
  LIST_ITEM: "product-list-item",
};

const HIDDEN_SET = new Set(
  JSON.parse(localStorage.getItem(CLASSES.ACTION_HIDDEN) ?? "[]"),
);
const FAVORITES_SET = new Set(
  JSON.parse(localStorage.getItem(CLASSES.ACTION_FAVORITE) ?? "[]"),
);
const COMPARE_SET = new Set(
  JSON.parse(localStorage.getItem(CLASSES.ACTION_COMPARE) ?? "[]"),
);

const LIST_ITEM_TO_SET = new Map([
  [CLASSES.ACTION_COMPARE, COMPARE_SET],
  [CLASSES.ACTION_FAVORITE, FAVORITES_SET],
  [CLASSES.ACTION_HIDDEN, HIDDEN_SET],
]);

const SET_TO_LIST_ITEM_TAG = new Map([
  [COMPARE_SET, CLASSES.ACTION_COMPARE],
  [FAVORITES_SET, CLASSES.ACTION_FAVORITE],
  [HIDDEN_SET, CLASSES.ACTION_HIDDEN],
]);

const SELECTOR_MENU_ITEMS = document.querySelectorAll(`.${CLASSES.MENU_ITEM}`);
const SELECTOR_LIST_ITEMS = document.querySelectorAll(`.${CLASSES.LIST_ITEM}`);
const SELECTOR_ALL_ACTIONS = document.querySelectorAll(`.${CLASSES.ACTIONS}`);

let isHiddenListItemVisible = document.getElementById("hidden").checked;
let activateMenuItem = CLASSES.MENU_ALL;

window.addEventListener("DOMContentLoaded", () => {
  initializeActionButtons();
  initializeMenu();
  initializeListItems();
});

function initializeActionButtons() {
  SELECTOR_ALL_ACTIONS.forEach((element) => {
    element.addEventListener("click", handleActionButtonClick);
  });
}

function handleActionButtonClick(event) {
  const action = event.target.closest(`.${CLASSES.ACTION}`);
  const listItem = event.target.closest(`.${CLASSES.LIST_ITEM}`);
  let currentActionName = getActionName(action);
  action.classList.toggle(CLASSES.ACTION_ACTIVE);
  let isActive = action.classList.contains(CLASSES.ACTION_ACTIVE);

  updateSetValues(listItem, currentActionName, isActive);

  changeCurrentItemVisibility(listItem, currentActionName, isActive);
}

function updateSetValues(listItem, currentActionName, isActive) {
  if (isActive) {
    LIST_ITEM_TO_SET.get(currentActionName).add(listItem.getAttribute(ID));
  } else {
    LIST_ITEM_TO_SET.get(currentActionName).delete(listItem.getAttribute(ID));
  }
  saveSets();
}

function getActionName(action) {
  return [...LIST_ITEM_TO_SET.keys()].find((key) =>
    action.classList.contains(key),
  );
}

function changeCurrentItemVisibility(listItem, actionName, isActive) {
  if (isActive) {
    if (actionName === CLASSES.ACTION_HIDDEN) {
      listItem.classList.add(CLASSES.LIST_ITEM_TRANSPARENT);
      if (!isHiddenListItemVisible) {
        listItem.classList.add(CLASSES.LIST_ITEM_HIDDEN);
      }
    }
  } else {
    if (
      (actionName === CLASSES.ACTION_COMPARE &&
        activateMenuItem === CLASSES.MENU_COMPARE) ||
      (actionName === CLASSES.ACTION_FAVORITE &&
        activateMenuItem === CLASSES.MENU_FAVORITES)
    ) {
      listItem.classList.add(CLASSES.LIST_ITEM_HIDDEN);
    }
    if (actionName === CLASSES.ACTION_HIDDEN) {
      listItem.classList.remove(CLASSES.LIST_ITEM_TRANSPARENT);
    }
  }
}

function saveSets() {
  localStorage.setItem(
    CLASSES.LIST_ITEM_HIDDEN,
    JSON.stringify([...HIDDEN_SET]),
  );
  localStorage.setItem(
    CLASSES.ACTION_FAVORITE,
    JSON.stringify([...FAVORITES_SET]),
  );
  localStorage.setItem(
    CLASSES.ACTION_COMPARE,
    JSON.stringify([...COMPARE_SET]),
  );
}

function initializeMenu() {
  document
    .querySelector(`.${CLASSES.MENU_FAVORITES}`)
    .addEventListener("click", handlers[CLASSES.MENU_FAVORITES]);
  document
    .querySelector(`.${CLASSES.MENU_COMPARE}`)
    .addEventListener("click", handlers[CLASSES.MENU_COMPARE]);
  document
    .querySelector(`.${CLASSES.MENU_ALL}`)
    .addEventListener("click", handlers[CLASSES.MENU_ALL]);
  document
    .querySelector(`.${CLASSES.MENU_HIDE}`)
    .addEventListener("click", handlers[CLASSES.MENU_HIDE]);
}

const handlers = {
  [CLASSES.MENU_FAVORITES]: () =>
    handleMenuItemClick(
      CLASSES.MENU_FAVORITES,
      (el) => !FAVORITES_SET.has(el.getAttribute(ID)),
    ),
  [CLASSES.MENU_COMPARE]: () =>
    handleMenuItemClick(
      CLASSES.MENU_COMPARE,
      (el) => !COMPARE_SET.has(el.getAttribute(ID)),
    ),
  [CLASSES.MENU_ALL]: () => handleMenuItemClick(CLASSES.MENU_ALL, () => false),
  [CLASSES.MENU_HIDE]: handleChooser,
};

function handleChooser() {
  isHiddenListItemVisible = !isHiddenListItemVisible;
  handlers[activateMenuItem]();
}

function handleMenuItemClick(activeMenuItemClassName, predicate) {
  activateMenuItem = activeMenuItemClassName;
  (function activateMenuItem(activeMenuItemClassName) {
    SELECTOR_MENU_ITEMS.forEach((menuItem) => {
      menuItem.classList.remove(CLASSES.MENU_ITEM_ACTIVE);
      if (menuItem.classList.contains(activeMenuItemClassName)) {
        menuItem.classList.add(CLASSES.MENU_ITEM_ACTIVE);
      }
    });
  })(activeMenuItemClassName);

  changeListItemsVisibility(predicate);

  function changeListItemsVisibility(predicate) {
    SELECTOR_LIST_ITEMS.forEach((element) => {
      changeListItemVisibility(predicate, element);
    });
  }
}

function initializeListItems() {
  SELECTOR_LIST_ITEMS.forEach((listItem) => updateListItem(listItem));
}

function updateListItem(listItem) {
  let id = listItem.getAttribute(ID);
  SET_TO_LIST_ITEM_TAG.forEach((value, key) => {
    if (key.has(id)) {
      listItem.querySelector(`.${value}`).classList.add(CLASSES.ACTION_ACTIVE);
      if (value === CLASSES.ACTION_HIDDEN) {
        listItem.classList.add(CLASSES.LIST_ITEM_TRANSPARENT);
      }
    }
  });
  changeListItemVisibility(() => false, listItem);
}

function changeListItemVisibility(predicate, element) {
  if (
    predicate(element) ||
    (!isHiddenListItemVisible && HIDDEN_SET.has(element.getAttribute(ID)))
  ) {
    element.classList.add(CLASSES.LIST_ITEM_HIDDEN);
  } else {
    element.classList.remove(CLASSES.LIST_ITEM_HIDDEN);
  }
}
