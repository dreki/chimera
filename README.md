# chimera

Two-way bindings for Backbone.

Chimera will update your views when your models change.

It wil also update your models when your views change.

# Usage

#### Your Model
```
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
```
var MyView = Backbone.View.extend({
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
  <span class="js-lastname-1 js-lastname-2"></span>
</body>
</html>
```