Sort expression must reference both parameters
==============================================
A sort function takes an expression that takes two parameters.
To be a valid expression, both of them should be used in the expression body. 

In the example below, x.assignee > y.assignee references both "x" and "y"; and is therefore valid.
Also note that "x" and "y" should reference the same field; which was "assignee" in this case.

```javascript
db.todos.sort((x, y) => x.assignee > y.assignee)
```
