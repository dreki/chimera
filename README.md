# chimera

Two-way bindings for Backbone.

Chimera will update your views when your models change.

It wil also update your models when your views change.

## Installation
Install through `npm` and include as a `require` or AMD module:

https://www.npmjs.com/package/backbone-chimera

## Usage

#### Your Model
```js
var MyModel = Backbone.Model.extend({
  defaults: {
    firstName: null,
    firstNameForTextInputEl: null,
    lastName: null
  }
  comments: undefined,
  initialize: function () {
    this.comments = new Backbone.Collection();
  }
});
```
#### Your View
```js
var MyView = Backbone.View.extend({
  el: document.body,
  modelMapping: {
    'firstName': '.js-first-name',
    'firstNameForTextInputEl': ['.js-text-input'],
    'comments': ['.js-comment'],
    'lastName': ['.js-lastname-1', '.js-lastname-2']
  },
  initialize: function () {
    _.extend(MyView.prototype, Chimera);
    this.initializeChimera();
  }
});
```
### Your page
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My great app</title>
</head>
<body>
  <div class="js-first-name"></div>
  <input class="js-text-input"/>

  <h4>comments</h4>
  <ul>
    <li>
      <input class="js-comment"/>
    </li>
    <li>
      <input class="js-comment"/>
    </li>
    <li>
      <input class="js-comment"/>
    </li>
  </ul>

  <h4>last name so nice you'll see it twice</h4>
  <span class="js-lastname-1"></span>
  <span class="js-lastname-2"></span>
</body>
</html>
```

## Discussion
Given the above examples, here's what happens:

- Changes to **firstName** on the model will be automatically displayed in **div.js-first-name**
- Changes to **.js-text-input's** value automatically update the model field **firstNameForTextInputEl**
- Changes to **firstNameForTextInputEl** will update **.js-text-input's** value
- Changes to any of the **.js-comment** inputs will update the corresponding model in the **comments** collection (i.e. the second **.js-comment's** value will be stored in **comments.at(1)**)
- For each **.js-comment** that exists in the view but not in the **comments** collection, a model at that index in **comments** will be created (i.e. in our case, there would be 3 items in the collection)
- Changes to any model in **comments** will update the corresponding element (or input value) in the view
- Changes to **lastName** will propagate to both **.js-lastname-1** and **.js-lastname-2**

## Feed me
Feel free to open pull requests and I'll merge them.

## bf4lyf
This one goes out to the geniuses I work with every day at BuzzFeed.