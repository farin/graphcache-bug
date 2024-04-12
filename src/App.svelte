<script>
  import { fetchExchange, createClient, gql } from "@urql/core";
  import { cacheExchange } from '@urql/exchange-graphcache';
  import { onMount } from "svelte";
  import * as q1 from './query1';
  import * as q2 from './query2';
  import * as q3 from './query3';

  import fetchMock from 'fetch-mock';

  const fetch1 = fetchMock.sandbox().mock({}, q1.response);
  const fetch2 = fetchMock.sandbox().mock({}, q2.response);
  const fetch3 = fetchMock.sandbox().mock({}, q3.response);

  let state1 = 'NONE';
  let state2 = 'NONE';
  let state3 ='NONE';

  function wrapper(fn, delay) {
    return function(...args) {
      const body = JSON.parse(args[1].body);
      console.log(`Called ${body.operationName} with delay ${delay}`);
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`Resolve ${body.operationName}`);
          fn(...args).then(resolve);
        }, delay);
      });
    }
  }

  const client = createClient({
    url: "https://not-used-bacause-mocked",
    exchanges: [
      // remove cacheExchange and bug doesn't appear
      cacheExchange(),
      fetchExchange
    ],
  });

  async function fetchUser() {
    let resolved = false;
    state1 = 'FETCHING'
    return new Promise((resolve) => {
      client.query(q1.query, {}, { fetch: wrapper(fetch1, 1) }).subscribe(res => {
        if (!resolved) {
          state1 = res.data ? 'OK' : 'ERROR';
          console.log("Q1", res);
          resolved = true;
          setTimeout(() => {
            resolve(res.data);
          }, 1);
        }
      });
    });
  }

  onMount(async () => {
    await fetchUser();

    /*
      Comment out block with Query 2 and query 3 will be resolved correctly
    */
    if (true) {
      setTimeout(() => {
        state2 = 'FETCHING'
        client.query(q2.query, {}, { fetch: wrapper(fetch2, 10) }).toPromise().then(res => {
          state2 = res.data ? 'OK' : 'ERROR';
          console.log("Q2", res, fetch2.calls().length);
        });
      }, 20);
    }

    setTimeout(() => {
      state3 = 'FETCHING'
      client.query(q3.query, {}, { fetch: wrapper(fetch3, 250) }).subscribe(res => {
        state3 = res.data ? 'OK' : 'ERROR';
        console.log("Q3", res, fetch3.calls().length);
      });
    }, 1);
  });
</script>

<main>
  <p>
    Subscription to Query 3 resolves with empty result although fetch contains data.<br>
    <br>
    If cache exchange is removed, the issue doesn't appear.<br>
    If query 2 is not executed, the issue doesn't appear.<br>
  </p>

  <div>Query 1: {state1}</div>
  <div>Query 2: {state2}</div>
  <div>Query 3: {state3}</div>
</main>

<style>
  main {
    margin: 40px;
    font-size: 20px
  }
</style>


