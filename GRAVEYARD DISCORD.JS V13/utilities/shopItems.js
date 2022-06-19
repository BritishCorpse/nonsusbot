/* eslint-disable no-octal */
const shop = [
    { itemId: 10000, itemName: "Carrot", itemDescription: "Just a carrot.", itemCost: 100, isAvailableToBuy: true, itemCategory: "foods" },
    { itemId: 10001, itemName: "Disguise", itemDescription: "Hide yourself from others for a week!", itemCost: 10000, isAvailableToBuy: true, itemCategory: "tools" },
    { itemId: 10002, itemName: "Cat", itemDescription: "What a cute kitty!", itemCost: 3000, isAvailableToBuy: true, itemCategory: "cats" },
    { itemId: 10003, itemName: "Dog", itemDescription: "Strong doggie.", itemCost: 3000, isAvailableToBuy: true, itemCategory: "dogs" },
    { itemid: 10004, itemName: "Illegal item!", itemDescription: "This item is not available to buy!", itemCost: 100000, isAvailableToBuy: false, itemCategory: "others" }
];

module.exports = {
    shop,
};