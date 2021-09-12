Technical Questions and **Answers**


1. How long did you spend on the coding test?

2. What would you add to your solution if you had more time? If you did not spend much time on the coding test, then use this as an opportunity to explain what you would add.

3. What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you have used it.

## One of the latest feature added to Javascript is Async Await(it is an extension of promises which enables us write promise based-code synchronuosly as seen in the snippet below).

```
const getRequest = async (url, data, base = baseUrl) => {
  try {
    const r = await axios.get(`${base}/${url}`, data, setHeader());

    console.log(r, 'res');
    return r;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

```



4. How would you track down a performance issue in production? Have you ever had to do this?

5. How would you improve the Just marketaux that you just used?

