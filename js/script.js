const ID = "id";
const LIST_ITEM_TO_SET = {
  HIDDEN: "product-list-item__action--hidden",
  FAVORITES: "product-list-item__action--favorite",
  COMPARE: "product-list-item__action--compare",
};

const HIDDEN_SET = new Set(
  JSON.parse(localStorage.getItem(LIST_ITEM_TO_SET.HIDDEN) ?? "[]"),
);
const FAVORITES_SET = new Set(
  JSON.parse(localStorage.getItem(LIST_ITEM_TO_SET.FAVORITES) ?? "[]"),
);
const COMPARE_SET = new Set(
  JSON.parse(localStorage.getItem(LIST_ITEM_TO_SET.COMPARE) ?? "[]"),
);

const SET_TO_LIST_ITEM_TAG = new Map([
  [COMPARE_SET, "product-list-item__action--compare"],
  [FAVORITES_SET, "product-list-item__action--favorite"],
  [HIDDEN_SET, "product-list-item__action--hidden"],
]);

const CLASSES = {
  ACTION: "product-list-item__action",
  ACTION_ACTIVE: "product-list-item__action--active",
  ACTION_HIDDEN: "product-list-item__action--hidden",
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

const ACTION_SET = new Set([
  CLASSES.MENU_ALL,
  CLASSES.MENU_COMPARE,
  CLASSES.MENU_FAVORITES,
]);
let isHiddenListItemVisible = document.getElementById("hidden").checked;

window.addEventListener("DOMContentLoaded", (event) => {
  initializeActionButtons();
  initializeMenu();
  initializeListItems();
});

function initializeActionButtons() {
  document.querySelectorAll(`.${CLASSES.ACTION}`).forEach((element) => {
    element.removeEventListener("click", handleActionButtonClick);
    element.addEventListener("click", handleActionButtonClick);
  });
}

function handleActionButtonClick(event) {
  const action = event.currentTarget.closest(`.${CLASSES.ACTION}`);
  const listItem = event.currentTarget.closest(`.${CLASSES.LIST_ITEM}`);
  if (action.classList.contains(CLASSES.ACTION_ACTIVE)) {
    deactivateButton(listItem, action);
  } else {
    activeButton(listItem, action);
  }
  saveSets();
}

function activeButton(listItem, action) {
  action.classList.add(CLASSES.ACTION_ACTIVE);
  SET_TO_LIST_ITEM_TAG.forEach((value, key) => {
    if (action.classList.contains(value)) {
      key.add(listItem.getAttribute(ID));
    }
  });

  if (action.classList.contains(CLASSES.ACTION_HIDDEN)) {
    listItem.classList.add(CLASSES.LIST_ITEM_TRANSPARENT);
    if (!isHiddenListItemVisible) {
      listItem.classList.add(CLASSES.LIST_ITEM_HIDDEN);
    }
  }
}

function deactivateButton(listItem, action) {
  action.classList.remove(CLASSES.ACTION_ACTIVE);
  SET_TO_LIST_ITEM_TAG.forEach((value, key) => {
    if (action.classList.contains(value)) {
      key.delete(listItem.getAttribute(ID));
    }
  });
  if (action.classList.contains(CLASSES.ACTION_HIDDEN)) {
    listItem.classList.remove(CLASSES.LIST_ITEM_TRANSPARENT);
  }
}

function saveSets() {
  localStorage.setItem(
    LIST_ITEM_TO_SET.HIDDEN,
    JSON.stringify([...HIDDEN_SET]),
  );
  localStorage.setItem(
    LIST_ITEM_TO_SET.FAVORITES,
    JSON.stringify([...FAVORITES_SET]),
  );
  localStorage.setItem(
    LIST_ITEM_TO_SET.COMPARE,
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
  let element =
    document.querySelector(
      `.${CLASSES.MENU_ITEM_ACTIVE}.${CLASSES.MENU_ITEM}`,
    ) ?? document.querySelector(`.${CLASSES.MENU_ALL}`);

  let activeAction = [...element.classList].filter((className) =>
    ACTION_SET.has(className),
  );
  if (activeAction.length == 1) {
    handlers[activeAction[0]]();
  }
}

function handleMenuItemClick(selector, predicate) {
  activateMenuItem(document.querySelector(`.${selector}`));
  changeListItemsVisibility(predicate);
}

function activateMenuItem(actionElement) {
  if (actionElement != null) {
    document.querySelectorAll(`.${CLASSES.MENU_ITEM}`).forEach((actions) => {
      actions.classList.remove(CLASSES.MENU_ITEM_ACTIVE);
    });
    actionElement.classList.add(CLASSES.MENU_ITEM_ACTIVE);
  }
}

function changeListItemsVisibility(predicate) {
  document.querySelectorAll(`.${CLASSES.LIST_ITEM}`).forEach((element) => {
    changeListItemVisibility(predicate, element);
  });
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

function initializeListItems() {
  document
    .querySelectorAll(`.${CLASSES.LIST_ITEM}`)
    .forEach((listItem) => updateListItem(listItem));
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
