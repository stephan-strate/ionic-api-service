# RESTful API Provider for Ionic 3.x

When I was first using Ionic, I spent a lot of time and nerves figuring out how to properly load data from a RESTful API. I build this Ionic 3.x provider to easily load data, cache it, reload it and show error messages, when data could not be loaded.

For simple as well as complex applications you can use this provider.

## Usage

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

## Methods
| Method | Parameters | Description |
| --- | --- | --- |
| `get` | { array | object } endpoints to request, { array | string } parameters (optional) | Synchronously request one or multiple endpoints at once. You can extend the request with a string. |