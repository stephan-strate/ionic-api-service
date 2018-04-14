## Not maintained at the moment

**2018-04-14** -  Project currently not maintained.
Due the changes of the Angular HttpClient, some of the functions I used will be deprecated.

# RESTful API Provider for Ionic 3.x

When I was first using Ionic, I spent a lot of time and nerves figuring out how to properly load data from a RESTful API. I build this Ionic 3.x provider to easily load data, cache it, reload it and show error messages, when data could not be loaded.

For simple as well as complex applications you can use this provider.

## Example

```typescript
import { ApiProvider, ApiEndpoint } from "../providers/api.service";
    
const ENDPOINTS = {
    POSTS: ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/posts"),
    USERS: ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/users")
};
    
export class Example {
    
    constructor (private api: ApiProvider) { }
    
    ionViewDidLoad () {
        // synchronous request of two endpoints
        this.api.get([ENDPOINTS.POSTS, ENDPOINTS.USERS]).then(response => {
            
            // access data via your endpoint
            console.log(ENDPOINTS.POSTS.unwrap(response));
        });
    }
}
```

## Documentation

### Configuration
You can define your request with an url. The url can be extended later on, when you want to modify one endpoint in different ways.

```typescript
const ENDPOINTS = {
    POSTS: ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/posts")
};
```

`lifetime` describes the cache time in hours. Use `0` or disable cache to do not use cache, 24 hours is default value. You can set it like here:

```
ENDPOINTS.POSTS.setLifetime(48);
```

### Methods

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `get(endpoint, params)` | `endpoint`, `params` | Synchronously request one or multiple endpoints at once. You can extend the request with a string. |
| `enableCache()`, `disableCache()` | - | Enables/disables the cache of your api requests. Lifetime defines how long data will be fetched from cache. _(default: enabled)_ |
| `enableDebug()`, `disableDebug()` | - | Enables `console.log()` statements, that helps to debug your application. _(default: disabled)_ |

### Usage

#### Handle Errors
You will be thrown into the `catch` block, when the error message dismissed.

```typescript
this.api.get(ENDPOINTS.POSTS).then(response => {
    // use data
}).catch(error => {
    // handle reject
});
```

#### Asynchronous Requests
Requests that do not need each other can be fetched asynchronously.

```typescript
// start multiple api requests
this.api.get(ENDPOINTS.POSTS).then(response => {
    // access data
    console.log(ENDPOINTS.POSTS.unwrap(response));
});

this.api.get(ENDPOINTS.USERS).then(response => {
    // access data
    console.log(ENDPOINTS.USERS.unwrap(response));
});
```

#### Synchronous Requests
When you need both requests at the same time, you can use the synchronous fetched requests. Note: When one request fails, no data will be returned and you will be thrown into the `catch` block.

```typescript
// start one request with multiple endpoints
this.api.get([ENDPOINTS.POSTS, ENDPOINTS.USERS]).then(response => {
    // access data
    console.log(ENDPOINTS.POSTS.unwrap(response));
    console.log(ENDPOINTS.USERS.unwrap(response));
});
```