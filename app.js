//! Requiring modules and packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require("./db/connect");

//! Defining app to use the methods in express
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static("static"));

//! Declaring the mongoose schema for database
const itemsSchema = new mongoose.Schema({
  name: String,
});

//! Declaring the model for the schema
const Item = mongoose.model("Item", itemsSchema);

//! Declaring the documents
const item1 = new Item({
  name: "Buy Food",
});

const item2 = new Item({
  name: "Purchase Milk",
});

const item3 = new Item({
  name: "Ready for a party",
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted the items");
        }
        res.redirect("/");
      });
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems,
      });
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne(
      {
        name: listName,
      },
      (err, foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    );
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId, (err) => {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne(
    {
      name: customListName,
    },
    (err, foundList) => {
      if (!err) {
        if (!foundList) {
          //* Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems,
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //* Show an existing list
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items,
          });
        }
      }
    }
  );
});

app.post("/work", (req, res) => {
  console.log(req.body);

  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(80, () => {
  console.log("Server running on port 80");
});
