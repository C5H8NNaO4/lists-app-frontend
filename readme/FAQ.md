# FAQ

Here are answers to questions you might have, as well as frequently asked questions.  

> Why Lists and not Google Keep?

Google Keep is an amazing tool if you want to keep short to large text notes. While you can add lists with a checkbox into notes, it's not centered around Lists. Lists is like Google Keep in reverse, with features and UI centered around lists and notes that you can add to individual items.

> My Lists are empty when I log in.
  
Each logged in user obviously has their own data. If you have created lists while you have been logged out and want to move your data to your google account, you can do the following:

**This will delete all your data in the logged in account**

* Logout
* Export -> JSON
* Login
* Import -> Choose File -> JSON

This **replaces** the data when logged in- with your google account. It's not possible to merge two unrelated databases. You can only replace the whole data. 

> How can I use the same data in multiple places?

Login with your google account and you will have access to the same data on multiple devices.



> How can I create custom scopes for managing state, and are there any best practices for doing so?
  
You can pass any string as scope. There is currently no way to define special scopes that have there value replaced during runtime. You can however compute a string dynamically.

> Can you provide more examples of using atomic states once the feature is implemented?

Atomic states will be defined using an equation in the form x=n+1 which allows React Server to infer the correct operation. This feature will be implemented after release. The docs will be updated.

> How do you handle server-side rendering and SEO optimization with React Server?

There is currently no implementation for server side rendering. You can render React components to html, but there is currently no http server serving rendered components. There's also no optimization to pass serverside state to SSR react components.

> Are there any performance considerations or limitations when using React Server, especially when dealing with a large number of users and components?

The architecture has only been tested in small to medium projects where it performed well. So there's currently no known limit to performance.

> How do you handle error boundaries and fallback UIs when a component fails to render or encounters an error?

If a component fails to render during a client side request, the error will be passed to the client and can be handled in the frontend. 

> Is there any built-in support for handling component caching, and if so, how can it be configured?

Any stateful server can cache components by using an in memory Store.

> How can I implement real-time functionality or web sockets with React Server?

Every state / component is automatically transported in real-time using  Graph Ql subscriptions. You don't need to worry about it.
