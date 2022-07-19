/* eslint-disable no-octal */
const shop = [
    { itemId: 10000, itemName: "Carrot", itemDescription: "Just a carrot.", itemCost: 100, isAvailableToBuy: true, itemCategory: "foods" },
    { itemId: 10001, itemName: "Disguise", itemDescription: "Hide yourself from others for a week!", itemCost: 10000, isAvailableToBuy: true, itemCategory: "tools" },
    { itemId: 10002, itemName: "Cat", itemDescription: "What a cute kitty!", itemCost: 3000, isAvailableToBuy: true, itemCategory: "cats" },
    { itemId: 10003, itemName: "Drug search dog", itemDescription: "Strong doggie.", itemCost: 3000, isAvailableToBuy: true, itemCategory: "dogs" },
    { itemId: 10004, itemName: "Pomeranian", itemDescription: "FLUFFY.", itemCost: 3250, isAvailableToBuy: true, itemCategory: "dogs" },
    { itemId: 10005, itemName: "Illegal item!", itemDescription: "This item is not available to buy!", itemCost: 100000, isAvailableToBuy: false, itemCategory: "others" },
    { itemId: 10006, itemName: "Carrot on a stick", itemDescription: "Hoan your pig controlling skills.", itemCost: 1000, isAvailableToBuy: true, itemCategory: "others" },

    // testing items, you probably shouldn't touch these.
    { itemId: 11111, itemName: "test-01", itemDescription: "You shouldn't have this item.", itemCost: 0, isAvailableToBuy: false, itemCategory: "developer" },
    { itemId: 11112, itemName: "test-02", itemDescription: "You shouldn't have this item.", itemCost: 0, isAvailableToBuy: false, itemCategory: "developer" },
    { itemId: 11113, itemName: "test-03", itemDescription: "You shouldn't have this item.", itemCost: 0, isAvailableToBuy: false, itemCategory: "developer" },
    { itemId: 11114, itemName: "test-04", itemDescription: "You shouldn't have this item.", itemCost: 0, isAvailableToBuy: false, itemCategory: "developer" },
    { itemId: 11115, itemName: "test-05", itemDescription: "You shouldn't have this item.", itemCost: 0, isAvailableToBuy: false, itemCategory: "developer" }
];

module.exports = {
    shop,
};