Isotropy AST Analyzer for DB
============================

First, we need to create a JS file while represents or emulates our database system on the client-side.
Here's how you do that.

```javascript
db.init({
  customers: [
    {      
      name: "Jenna Maroney",
      occupation: "Actor"
    },
    {
      name: "Liz Lemon",
      occupation: "Producer"
    }
  ]
})
```

Usage is easy. Start by importing the file you just created

```javascript
import db from "./my-db";

//Get all records in a collection
const customers = await db.customers("customers");

//Insert a record
const id = await db.collection("customers").insert({
  name: "Jack Donaghy",
  occupation: "Executive"
});

//Delete a record
const id = await db.collection("customers").delete(c => c.name === "Jack Donaghy")

//Insert a bunch of records
const ids = await db.collection("customers").insert(arrayOfCustomers);

//Query customers
const customers = await db.collection("customers").filter(c => c.occupation === "Actor")

//Sort a query
const customers = await db.collection("customers").filter(c => c.occupation === "Actor").sort("name")

//Sort a query, descending
const customers = await db.collection("customers").filter(c => c.occupation === "Actor").sortDescending("name")

//Slice a query
const customers = await db.collection("customers").filter(c => c.occupation === "Actor").slice(1, 10)

//Fetch only specific fields
const customers = await dbdb.collection("customers").filter(c => c.occupation === "Actor").map(c => ({ name: c.name }))

//Update
await db.collection("customers").update(c => c.name === "Kenneth Parcell", { occupation: "Page" })

//Count
const count = await dbdb.collection("customers").count();
```

