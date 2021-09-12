Technical Questions and **Answers**


# How long did you spend on the coding test?

#### I spent 48 hours on the coding test


# What would you add to your solution if you had more time? If you did not spend much time on the coding test, then use this as an opportunity to explain what you would add.

### If I had more time, I would have include the following:

#### Ability to get real-time changes on the charts as the data changes.

#### Include a trend charts that keeps track of positive and negative needs.

#### Add a feature that will enable visulization of trending financial news.


# What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you have used it.

#### One of the latest feature added to Javascript is Async Await(it is an extension of promises which enables us write promise based-code synchronuosly as seen in the snippet below).

```javascript
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

# How would you track down a performance issue in production? Have you ever had to do this?

#### For this question, my answer will duel mainly on React(that is monitoring the performance of react application in production). Before deploying my app to production, I will ensure that I have setup Profiler in my application with a render function that will help track activity. because the application will always re-render i will allow the render function to batch the activity and send them every 5 to 10 seconds. my render function will look like the snippet below.

```javascript

// sendProfileQueue every 5 to 10 seconds
setInterval(sendProfileQueue, 5000)

function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions, // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
}
```
#### After that, I will use my profiler function to stratigically wrap my *App Component* . This will help monitor activities in production. But i need to visually see this data, so I am going to use a monitoring tool like *Grafana or AppDynamics* . With this we can be able to monitor spikes in production environment.


# How would you improve the Just marketaux that you just used?

### The marketaux data can be improved in the following ways:

#### Firstly, the financial news itself don't have actual date of creation so I am goint to include that(that is date of creation will be included when all news are fetched without passing query params).

#### Secondly, it will be great if the country names are fully spelt for better readabily because not everyone knows all the contry code. This will help for better stats and usability.

#### Thirdly, I will also want to improve on the stats of the data. That is providing stats like top news with respect to industries and countries. Because this aspect of the API is *PAID*, it should be documented with the audience in mind like ensuring easy understanding of ducumentation and also good examples on different ways to use it.

