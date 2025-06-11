We're building a modular open source system to help kids learn.

Please look at /docs/README.md
This will give a good overview of the system architecture!

A few notes, based on seeing your prior runs:

If you run `grep -R`, so it over src. If you accidentally include node_modules, you'll cap out your line limit.

The normal tests run in a sandbox, which you don't have. To run tests, you'll need:

   npm run test-automation
