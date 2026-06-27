const interviewQuestions = [
  // --- FRONTEND ---
  {
    id: "fe-1",
    category: "Frontend",
    difficulty: "Junior",
    question: "Explain the difference between 'let', 'const', and 'var' in JavaScript. How does hoisting affect them?",
    hint: "Think about block scope vs function scope, reassignment, and temporal dead zone.",
    keywords: ["scope", "hoist", "block", "reassign", "temporal dead zone", "var", "let", "const"],
    modelAnswer: "'var' is function-scoped and can be redeclared and reassigned, and is hoisted with an initial value of undefined. 'let' and 'const' are block-scoped. 'let' allows reassignment, while 'const' prevents reassignment (though properties of objects can still be modified). Both 'let' and 'const' are hoisted but not initialized, residing in the 'Temporal Dead Zone' (TDZ) until their declaration is evaluated, throwing a ReferenceError if accessed early."
  },
  {
    id: "fe-2",
    category: "Frontend",
    difficulty: "Mid-Level",
    question: "What is Event Delegation in JavaScript and how does it work? What are its benefits?",
    hint: "Recall event bubbling and capturing, and how a single parent listener handles multiple children.",
    keywords: ["bubbling", "event listener", "parent", "target", "propagation", "performance", "memory"],
    modelAnswer: "Event delegation is a design pattern where a single event listener is attached to a parent element to manage events bubbling up from its child elements. It leverages Event Bubbling: when an event fires on a child, it propagates up the DOM tree. By checking 'event.target', the parent can identify which child triggered the event. Benefits include reducing memory consumption (fewer event listeners) and automatically handling dynamically added child elements without binding new listeners."
  },
  {
    id: "fe-3",
    category: "Frontend",
    difficulty: "Senior",
    question: "Describe the critical rendering path of a web browser and how you would optimize it for faster initial page loads.",
    hint: "Walk through HTML parsing, CSSOM creation, Render Tree, Layout, Paint, and minimizing render-blocking resources.",
    keywords: ["dom", "cssom", "render tree", "layout", "paint", "composite", "render-blocking", "defer", "async", "preload"],
    modelAnswer: "The Critical Rendering Path (CRP) is the sequence of steps the browser takes to convert HTML, CSS, and JS into pixels on screen: 1. Parse HTML to build the DOM. 2. Parse CSS to build the CSSOM. 3. Combine them to create the Render Tree. 4. Run Layout (calculate geometry). 5. Paint (draw pixels). 6. Composite (layer layers). Optimizations include: minifying and compressing assets, utilizing async/defer for non-critical scripts, inline critical CSS, using preload/prefetch, optimizing images, and avoiding layout thrashing by grouping DOM writes."
  },
  {
    id: "fe-4",
    category: "Frontend",
    difficulty: "Staff/Lead",
    question: "How would you design a robust micro-frontend architecture for a large enterprise application? Discuss integration, routing, styling isolation, and state sharing.",
    hint: "Consider build-time vs run-time integration, module federation, Web Components, CSS-in-JS, and event buses.",
    keywords: ["module federation", "webpack", "web components", "iframe", "shadow dom", "routing", "isolation", "state", "shared dependencies"],
    modelAnswer: "A robust micro-frontend architecture is best achieved using run-time integration via Webpack Module Federation or custom orchestrators (like single-spa). 1. Routing: Managed by a shell application using custom events or browser routing sync. 2. Styling Isolation: Enforced using Shadow DOM, CSS Modules, or CSS-in-JS to prevent collisions. 3. State Sharing: Minimized to keep micro-frontends decoupled. Shared data (like authentication) is shared via lightweight custom event buses, a global store client, or URL parameters. 4. Dependencies: Shared centrally in configuration to avoid loading multiple React/Vue instances."
  },
  {
    id: "fe-5",
    category: "Frontend",
    difficulty: "Senior",
    question: "What are Core Web Vitals? Explain LCP, FID/INP, and CLS, and how you would improve them.",
    hint: "Focus on loading performance, interactivity/responsiveness, and visual stability.",
    keywords: ["lcp", "fid", "inp", "cls", "core web vitals", "performance", "interaction to next paint", "cumulative layout shift", "largest contentful paint"],
    modelAnswer: "Core Web Vitals are key user-experience metrics defined by Google: 1. Largest Contentful Paint (LCP) measures loading speed (target under 2.5s). Improve by optimizing critical path CSS, using CDNs, caching, and preloading hero images. 2. Interaction to Next Paint (INP) / First Input Delay (FID) measures responsiveness (INP target under 200ms). Improve by breaking up long tasks, deferring unneeded JS, and optimizing event handlers. 3. Cumulative Layout Shift (CLS) measures visual stability (target under 0.1). Improve by specifying size attributes on images/media, reserving space for ads, and avoiding inserting content above existing content dynamically."
  },
  {
    id: "fe-6",
    category: "Frontend",
    difficulty: "Mid-Level",
    question: "Compare CSS Flexbox vs CSS Grid. When would you use one over the other, and how do they differ structurally?",
    hint: "Think about one-dimensional vs two-dimensional layouts, content-first vs layout-first.",
    keywords: ["flexbox", "grid", "1d", "2d", "axis", "rows", "columns", "layout-first", "content-first"],
    modelAnswer: "CSS Flexbox is a 1D layout system (handles rows OR columns at a time), whereas CSS Grid is a 2D layout system (handles rows AND columns simultaneously). Flexbox is content-first: items size themselves and the container flows them. Grid is layout-first: you define columns/rows first and place items inside them. Use Flexbox for linear layouts (navigation bars, simple vertical lists). Use Grid for complex page configurations, cards matrices, or nested two-dimensional controls where alignment in both dimensions is critical."
  },

  // --- BACKEND ---
  {
    id: "be-1",
    category: "Backend",
    difficulty: "Junior",
    question: "What is the difference between SQL and NoSQL databases? When would you choose one over the other?",
    hint: "Compare schema rigidity, relations, ACID compliance, and scalability (vertical vs horizontal).",
    keywords: ["schema", "relational", "acid", "scale", "nosql", "sql", "document", "horizontal", "vertical"],
    modelAnswer: "SQL databases are relational, schema-based, table-structured, and strictly ACID compliant, making them ideal for complex queries and transactional integrity (e.g., banking). They scale vertically. NoSQL databases are non-relational, schema-less (supporting document, key-value, graph structures), and scale horizontally. Choose NoSQL for rapidly evolving schemas, unstructured data, high write throughput, and massive scale requirements (e.g., social feeds, real-time analytics)."
  },
  {
    id: "be-2",
    category: "Backend",
    difficulty: "Mid-Level",
    question: "Explain the concepts of REST and how it compares to GraphQL. What are the key trade-offs?",
    hint: "Discuss endpoint design, over-fetching vs under-fetching, caching, and schemas.",
    keywords: ["endpoint", "over-fetching", "under-fetching", "graphql", "rest", "schema", "query", "caching", "http methods"],
    modelAnswer: "REST is architectural style based on resource-oriented endpoints (e.g., GET /users) where the server defines the payload structure. GraphQL is a query language utilizing a single endpoint (POST /graphql) where the client requests specific fields. Trade-offs: GraphQL prevents over-fetching and under-fetching but makes server-side caching complex (since HTTP cache cannot easily cache POST queries). REST has built-in HTTP caching support but requires multiple round-trips for nested relations."
  },
  {
    id: "be-3",
    category: "Backend",
    difficulty: "Senior",
    question: "How would you handle database concurrency issues such as dirty reads, non-repeatable reads, and phantom reads? Discuss Isolation Levels.",
    hint: "Explain transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and locking strategies.",
    keywords: ["isolation level", "dirty read", "phantom read", "concurrency", "lock", "serializable", "repeatable read", "optimistic", "pessimistic"],
    modelAnswer: "Database concurrency anomalies are handled using Transaction Isolation Levels: 1. Read Uncommitted allows dirty reads. 2. Read Committed prevents dirty reads. 3. Repeatable Read prevents dirty and non-repeatable reads by holding locks. 4. Serializable prevents all, including phantom reads, by executing transactions sequentially or using range locks. Practically, we also use Optimistic Concurrency Control (version fields) for low contention, and Pessimistic Locking (SELECT ... FOR UPDATE) for high contention."
  },
  {
    id: "be-4",
    category: "Backend",
    difficulty: "Staff/Lead",
    question: "Design an event-driven microservices architecture. How do you guarantee message delivery (at-least-once vs exactly-once) and maintain eventual consistency?",
    hint: "Think about Outbox Pattern, idempotency keys, Kafka offset management, and Sagas.",
    keywords: ["outbox pattern", "idempotency", "saga", "kafka", "mq", "eventual consistency", "exactly-once", "idempotent", "dead letter queue"],
    modelAnswer: "To maintain consistency and guarantee delivery: 1. Transactional Outbox Pattern: Save domain events in the database in the same transaction as state updates, then publish them using a CDC tool (like Debezium) to Kafka. 2. At-Least-Once Delivery: Achieved by acknowledging message offsets only after successful processing. 3. Exactly-Once Processing: Handled client-side via Idempotent Consumers using unique idempotency keys in database constraints. 4. Eventual Consistency: Orchestrated using the Saga Pattern (orchestrated or choreographed) with compensating transactions to roll back states if steps fail."
  },
  {
    id: "be-5",
    category: "Backend",
    difficulty: "Mid-Level",
    question: "What are different Redis caching strategies? Explain Cache-Aside, Write-Through, Write-Behind, and Cache Stampede.",
    hint: "Compare read paths, write paths, database consistency, and high traffic query storms.",
    keywords: ["cache-aside", "write-through", "write-behind", "cache stampede", "redis", "ttl", "mutex", "consistency"],
    modelAnswer: "1. Cache-Aside (Lazy Loading): The application queries cache; on miss, it loads from DB and updates cache. Simple, but database updates can cause stale data. 2. Write-Through: The application writes to cache, which writes to DB. Ensures consistency but slower writes. 3. Write-Behind (Write-Back): Writes to cache, DB is updated asynchronously. High performance but risks data loss on cache failure. 4. Cache Stampede (Thundering Herd): Occurs when key expires under high traffic and multiple threads query DB at once. Mitigated using Mutex locks (XFetch) or early background recalculation before TTL expires."
  },
  {
    id: "be-6",
    category: "Senior",
    question: "Compare OAuth2 authorization code flow with JWT stateless authentication. How do you handle JWT revocation?",
    hint: "Think about state storage, token signatures, access tokens, refresh tokens, and blacklisting.",
    keywords: ["oauth2", "jwt", "stateless", "revocation", "refresh token", "access token", "blacklist", "signature", "token"],
    modelAnswer: "OAuth2 code flow is a delegative framework requiring authorization servers to exchange codes for tokens, often stateful. JWT is a self-contained token format signed by a server, enabling stateless verification without database lookups. JWT revocation is challenging due to statelessness. Solutions include: 1. Short expiry times (e.g., access token expires in 15 mins). 2. Stateful Refresh Tokens: Access token is stateless, but refresh tokens are tracked in Redis. To revoke access, delete the refresh token. 3. Blacklisting: Storing revoked, unexpired JTI (JWT ID) claims in a Redis blacklist with a TTL matching the token lifetime."
  },

  // --- SYSTEM DESIGN ---
  {
    id: "sd-1",
    category: "System Design",
    difficulty: "Junior",
    question: "What is a Load Balancer? Explain the difference between Layer 4 and Layer 7 load balancing.",
    hint: "Think about OSI layers, TCP vs HTTP, and what data the load balancer reads to route traffic.",
    keywords: ["load balancer", "layer 4", "layer 7", "tcp", "http", "routing", "ip", "ssl termination", "headers"],
    modelAnswer: "A load balancer distributes incoming network traffic across multiple servers to ensure reliability and performance. Layer 4 load balancing operates at the Transport layer (TCP/UDP), routing traffic based on IP addresses and ports without looking inside the message contents. Layer 7 operates at the Application layer (HTTP/HTTPS), parsing headers, cookies, and URL paths, allowing for smart routing, SSL termination, and rate-limiting based on specific request details."
  },
  {
    id: "sd-2",
    category: "System Design",
    difficulty: "Mid-Level",
    question: "Describe how a CDN works. How do cache invalidation, TTL, and edge networks play a role?",
    hint: "Explain geographically distributed servers, caching content close to users, and static vs dynamic assets.",
    keywords: ["cdn", "edge", "latency", "ttl", "cache invalidation", "origin server", "anycast", "static content"],
    modelAnswer: "A Content Delivery Network (CDN) is a network of geographically distributed edge servers (Points of Presence, or PoPs) that cache static assets close to users, reducing latency. When a user requests a file, Anycast DNS routes them to the nearest edge server. If the asset is cached and its Time-to-Live (TTL) has not expired, it is served instantly. Otherwise, the edge fetches it from the origin server and caches it. Cache invalidation forces edge servers to delete/refresh cached objects before TTL expiration (e.g., upon new deployments)."
  },
  {
    id: "sd-3",
    category: "System Design",
    difficulty: "Senior",
    question: "Design a scalable rate-limiting system for an API gateway. Discuss algorithms, storage, and distributed challenges.",
    hint: "Mention Token Bucket or Leaky Bucket, Redis, synchronization latency, and race conditions.",
    keywords: ["rate limit", "token bucket", "leaky bucket", "redis", "sliding window", "race condition", "lua script", "distributed"],
    modelAnswer: "A scalable rate limiter can be implemented in the API Gateway using Redis for distributed storage. Algorithms: Sliding Window Counter is ideal for precision, while Token Bucket is great for handling bursts. To prevent distributed race conditions (multiple instances reading/writing Redis simultaneously), we use Redis Lua Scripts to ensure atomicity. To scale Redis, we deploy a Redis Cluster sharded by API key/IP. For high performance, we can implement local in-memory pre-filtering (L1 cache) before checking the global Redis cluster (L2 cache)."
  },
  {
    id: "sd-4",
    category: "System Design",
    difficulty: "Staff/Lead",
    question: "Design a real-time collaborative editing tool (like Google Docs). Compare Operational Transformation (OT) and Conflict-free Replicated Data Types (CRDTs).",
    hint: "Talk about synchronization, latency, offline support, WebSockets, OT server-centric merging, and CRDT commutative operations.",
    keywords: ["crdt", "ot", "operational transformation", "websockets", "collaborative", "concurrency", "state synchronization", "yjs", "automerge"],
    modelAnswer: "Real-time collaborative editors require client-server state synchronization. 1. Operational Transformation (OT) is server-centric; clients emit operations (Insert/Delete) which are sent to a central server that transforms coordinates to resolve conflicts. It is complex to implement but keeps the client model small. 2. CRDTs are peer-to-peer ready, resolving conflicts deterministically without a central server by making operations commutative, associative, and idempotent. Modern applications use CRDTs (like Yjs or Automerge) because they handle offline edits and complex rich-text hierarchies more robustly, albeit with a larger memory footprint over time."
  },
  {
    id: "sd-5",
    category: "System Design",
    difficulty: "Senior",
    question: "Explain database Sharding. What are vertical partitioning, horizontal partitioning, sharding keys, and re-sharding challenges?",
    hint: "Think about splitting columns vs splitting rows, hash-based vs range-based sharding, and data migration.",
    keywords: ["sharding", "horizontal", "vertical", "sharding key", "hash-based", "range-based", "re-sharding", "consistent hashing"],
    modelAnswer: "Database sharding is horizontal partitioning: rows of a table are separated across different database servers. Vertical partitioning separates columns into different tables. A Sharding Key determines which shard a specific row is routed to. Range-based sharding maps ranges of keys (e.g., A-M to Shard 1), while Hash-based sharding uses hash functions (e.g., ID % N) to distribute rows evenly. Re-sharding challenges include moving millions of rows when adding new database shards. Consistent Hashing is used to minimize the amount of data moved during scaling."
  },
  {
    id: "sd-6",
    category: "System Design",
    difficulty: "Mid-Level",
    question: "Design a high-throughput message queue system. Discuss the difference between Point-to-Point and Publish-Subscribe patterns.",
    hint: "Think about queues, topics, consumer groups, message logs, and fan-out configurations.",
    keywords: ["message queue", "publish-subscribe", "point-to-point", "consumer group", "topic", "fan-out", "kafka", "rabbitmq"],
    modelAnswer: "1. Point-to-Point (Queue): Messages are sent to a single queue. Each message is processed by exactly one consumer. Good for load distribution (e.g., worker processes). 2. Publish-Subscribe (Pub/Sub): Messages are published to a Topic. Multiple subscribers receive the same message (Fan-Out). Modern distributed log systems (like Kafka) use consumer groups: a topic is split into partitions, allowing a group of consumers to scale processing while ensuring message order within a partition, combining both queueing and pub/sub benefits."
  },

  // --- DATA STRUCTURES & ALGORITHMS ---
  {
    id: "dsa-1",
    category: "Data Structures & Algorithms",
    difficulty: "Junior",
    question: "Explain what Big-O notation is. What are the time complexities of searching in an unsorted array vs a sorted array?",
    hint: "Recall binary search vs linear search.",
    keywords: ["big-o", "time complexity", "linear search", "binary search", "o(n)", "o(log n)", "sorted"],
    modelAnswer: "Big-O notation describes the upper bound of an algorithm's execution time or space requirement in terms of input size (N). Searching in an unsorted array requires checking each element, resulting in a Linear Search with O(N) time complexity. Searching in a sorted array allows using Binary Search, which repeatedly halves the search space, yielding O(log N) time complexity."
  },
  {
    id: "dsa-2",
    category: "Data Structures & Algorithms",
    difficulty: "Mid-Level",
    question: "What is the difference between Depth First Search (DFS) and Breadth First Search (BFS) in tree/graph traversal? When would you use which?",
    hint: "Compare queue vs stack, shortest path vs deep traversal, and memory usage.",
    keywords: ["dfs", "bfs", "queue", "stack", "shortest path", "recursion", "level order", "backtracking", "fifo", "lifo"],
    modelAnswer: "DFS traverses deep into branches before backtracking, implemented using a LIFO Stack (or recursion). BFS traverses level-by-level, checking neighbors first, implemented using a FIFO Queue. Use BFS for finding the shortest path on unweighted graphs (e.g., social connections) or when target nodes are close to the root. Use DFS for finding topological sort, cycle detection, or pathfinding where deep search is needed and memory is constrained (as BFS queue size can be O(W) where W is width)."
  },
  {
    id: "dsa-3",
    category: "Data Structures & Algorithms",
    difficulty: "Senior",
    question: "Explain Dynamic Programming. How does memoization (top-down) differ from tabulation (bottom-up)? Give an example.",
    hint: "Mention overlapping subproblems, optimal substructure, recursion vs iteration, and space/time tradeoffs.",
    keywords: ["dynamic programming", "memoization", "tabulation", "top-down", "bottom-up", "overlapping subproblems", "optimal substructure", "fibonacci", "recursion"],
    modelAnswer: "Dynamic Programming (DP) solves complex problems by breaking them down into overlapping subproblems with optimal substructures, solving each once and saving results. Memoization (Top-down) starts with the main problem and recursively solves subproblems, storing results in a map/cache (lazy evaluation). Tabulation (Bottom-up) builds an iterative table from base cases up to the main problem (eager evaluation). For Fibonacci, Memoization recursively calls F(n) checking cache, while Tabulation loops from 2 to N, updating an array or two variables."
  },
  {
    id: "dsa-4",
    category: "Data Structures & Algorithms",
    difficulty: "Mid-Level",
    question: "Explain the Sliding Window algorithm technique. In what situations is it useful? Give an example.",
    hint: "Think about arrays, contiguous subarrays, strings, O(N) linear time complexity vs O(N^2) nested loops.",
    keywords: ["sliding window", "contiguous", "subarray", "substring", "pointer", "linear time", "o(n)", "window"],
    modelAnswer: "The Sliding Window technique is used to perform operations on a contiguous sequence of elements (like subarrays or substrings) in O(N) linear time, avoiding nested loops. It maintains two pointers (left and right) representing the window bounds. When the condition is met, the right pointer expands; when violated, the left pointer contracts to shrink the window. It is useful for problems like 'Find the longest substring without repeating characters' or 'Maximum sum subarray of size K'."
  },
  {
    id: "dsa-5",
    category: "Data Structures & Algorithms",
    difficulty: "Senior",
    question: "How do you detect cycles in a directed graph and an undirected graph? Discuss algorithm choices.",
    hint: "Consider DFS recursion stacks, Union-Find (Disjoint Set), and Kahns topological sort algorithm.",
    keywords: ["cycle detection", "directed", "undirected", "dfs", "union-find", "disjoint set", "kahn", "topological sort", "back-edge"],
    modelAnswer: "1. Undirected Graph: Detected using DFS (checking if a visited neighbor is not the parent) or Union-Find (if adding an edge connects two elements already in the same subset, a cycle exists). 2. Directed Graph: DFS back-edge detection (using recursion states: unvisited, visiting, visited). If DFS visits a node marked as 'visiting', a back-edge exists. Alternatively, Kahn's Topological Sort Algorithm (BFS): if the sorted output has fewer nodes than the total graph, a cycle exists because nodes with in-degrees > 0 remain unprocessed."
  },

  // --- BEHAVIORAL ---
  {
    id: "beh-1",
    category: "Behavioral",
    difficulty: "Junior",
    question: "Describe a time you encountered a technical problem you couldn't solve immediately. What steps did you take?",
    hint: "Focus on problem breakdown, reading docs, testing isolation, and knowing when to ask for help.",
    keywords: ["star method", "isolate", "documentation", "ask for help", "debugging", "break down"],
    modelAnswer: "In line with the STAR method: I once faced a bug where a front-end form was double-submitting data. (Situation) First, I isolated the issue by reproducing it with console logs and DevTools to verify if it was a browser bug or JS handler. (Task/Action) I checked project documentation, then researched similar cases on StackOverflow, discovering a missing submit debouncer. Finally, after isolating it to double button clicks, I implemented a loading state. (Result) This resolved the database duplicate rows and taught me to always disable submit buttons on click."
  },
  {
    id: "beh-2",
    category: "Behavioral",
    difficulty: "Mid-Level",
    question: "How do you handle constructive criticism or code review feedback that you disagree with?",
    hint: "Discuss communication, objective evaluation, and maintaining project consistency over ego.",
    keywords: ["star method", "code review", "communication", "collaborate", "objective", "compromise", "guidelines"],
    modelAnswer: "I handle feedback by separating my ego from the code and evaluating the suggestion objectively. In a previous role, a senior developer requested I rewrite a utility function using recursion instead of an iterative loop. (Situation/Task) I disagreed because the recursion was harder to read and could cause stack overflows on large inputs. (Action) I scheduled a brief chat, explained my performance concerns with numbers, and listened to their point about keeping it concise. (Result) We compromised on a clean, functional array reducer, keeping the code safe and maintaining a strong relationship."
  },
  {
    id: "beh-3",
    category: "Behavioral",
    difficulty: "Senior",
    question: "Tell me about a time you had to deal with a conflict in your team. How did you handle it and what was the outcome?",
    hint: "Show empathy, focus on alignment on goals rather than personal differences, and building consensus.",
    keywords: ["star method", "conflict", "empathy", "communication", "mediation", "resolution", "consensus", "alignment"],
    modelAnswer: "During a major release, my backend lead and frontend lead conflicted on whether API validation should happen on client or server first, stalling the feature. (Situation) I pulled both into a meeting to discuss. (Task) I listened to both viewpoints: backend wanted strict separation, frontend wanted speed. (Action) I facilitated a consensus: we defined a shared JSON schema, running validation on the client for immediate UI feedback and on the server for security. (Result) The feature shipped on time, and we established a standard schema design pattern for all future APIs."
  },
  {
    id: "beh-4",
    category: "Behavioral",
    difficulty: "Senior",
    question: "How do you balance managing technical debt with meeting aggressive product feature deadlines?",
    hint: "Discuss debt categorization, tracking debt in backlog, negotiation with product manager, and allocating buffer time.",
    keywords: ["star method", "technical debt", "deadline", "backlog", "refactor", "negotiation", "metrics", "buffer"],
    modelAnswer: "I manage technical debt by categorizing and logging it like features. (Situation) In my last team, adding new payment methods grew code complexity, slowing release cycles. (Task) I needed to clear technical debt while keeping velocity. (Action) I created a debt backlog, calculated the 'interest' (wasted developer hours), and presented it to product management. I negotiated allocating 20% of every sprint buffer specifically to refactoring modules. (Result) We restructured the payment gateway into modules, lowering future task scopes and maintaining features on schedule."
  },
  {
    id: "beh-5",
    category: "Behavioral",
    difficulty: "Staff/Lead",
    question: "Describe a situation where a major system failure occurred in production. How did you lead the mitigation and prevent recurrence?",
    hint: "Focus on triage communication, finding root cause (5 Whys), writing blameless post-mortems, and runbooks.",
    keywords: ["star method", "outage", "post-mortem", "root-cause", "triage", "communication", "blameless", "runbook"],
    modelAnswer: "During a Friday peak, our database connection pool exhausted, causing a complete API outage. (Situation) As lead, I stepped in to triage. (Task) I set up a bridge call, assigned one engineer to check DB resource monitors and another to scale HTTP servers back to lower traffic. We discovered a missing timeout in an external HTTP call. (Action) We force-killed connection pools, deployed a hotfix with request timeouts and circuit breakers, and restored API service within 35 minutes. Later, I led a blameless post-mortem, wrote a runbook, and added automated circuit breaker tests. (Result) The system has since maintained 99.99% uptime."
  }
];

// Export for ES Module usage or browser script load
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interviewQuestions };
} else {
  window.interviewQuestions = interviewQuestions;
}
