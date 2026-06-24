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
    difficulty: "Staff/Lead",
    question: "Describe a situation where you had to make a critical architectural decision under tight deadlines with incomplete information. How did you proceed?",
    hint: "Emphasize risk mitigation, fallback strategies, gathering crucial stakeholders, and documentation of decisions (ADRs).",
    keywords: ["star method", "architecture", "adr", "trade-off", "risk mitigation", "fallback", "decision", "deadline"],
    modelAnswer: "We had two weeks to integrate a real-time payment notification system. We didn't know the exact peak load patterns of our new client. (Situation) I had to choose between a fully serverless handler or extending our existing backend service. (Task) To mitigate risk, I gathered my leads, listed trade-offs, and chose the serverless route due to auto-scaling, but kept database writes decoupled via a message queue (SQS). (Action) I wrote a rapid ADR, implemented the system with strict monitoring, and established an alert fallback. (Result) The integration handled a 5x spike on launch day safely. The SQS queue allowed us to process messages at our own pace without overloading our main database."
  }
];

// Export for ES Module usage or browser script load
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interviewQuestions };
} else {
  window.interviewQuestions = interviewQuestions;
}
