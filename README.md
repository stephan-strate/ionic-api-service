# RESTful API Provider for Ionic 3.x

When I was first using Ionic, I spent a lot of time and nerves figuring out how to properly load data from a RESTful API. I build this Ionic 3.x provider to easily load data, cache it, reload it and show error messages, when data could not be loaded.

For simple as well as complex applications you can use this provider.

## Example

```typescript
import { ApiProvider } from "../providers/api.service";
    
export const ENDPOINTS = {
    POSTS: { endpoint: "/posts", lifetime: 24 },
    USERS: { endpoint: "/users", lifetime: 24 }
};
    
export class Example {
    
    constructor (private api: ApiProvider) { }
    
    ionViewDidLoad () {
        // synchronous request of two endpoints
        this.api.get([ENDPOINTS.POSTS, ENDPOINTS.USERS]).then(response => {
            
            // access data via your endpoint
            console.log(response[ENDPOINTS.USERS.endpoint]);
        });
    }
}
```

## Documentation

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
    console.log(response[ENDPOINTS.POSTS.endpoint]);
});

this.api.get(ENDPOINTS.USERS).then(response => {
    // access data
    console.log(response[ENDPOINTS.USERS.endpoint]);
});
```

#### Synchronous Requests
When you need both requests at the same time, you can use the synchronous fetched requests. Note: When one request fails, no data will be returned and you will be thrown into the `catch` block.

```typescript
// start one request with multiple endpoints
this.api.get([ENDPOINTS.POSTS, ENDPOINTS.USERS]).then(response => {
    // access data
    console.log(response[ENDPOINTS.POSTS.endpoint]);
    console.log(response[ENDPOINTS.USERS.endpoint]);
});
```