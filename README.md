# Book Inventory API

A Book Inventory API built using Express and PostgreSQL that covers all CRUD operations. Testing was done with Postman.

## Book Inventory Schema

```sql
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL
);
```

## CRUD Operations with Postman
### Creating a Book
![POST Request](./images/post.png)

### Reading All Books
![GET Request](./images/getAll.png)

### Reading a Single Book
![GET by Id Request](./images/getById.png)

### Updating a Book
![PATCH Request](./images/patch.png)

### Deleting a Book
![DELETE Request](./images/delete.png)