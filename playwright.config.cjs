const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests/e2e',
  timeout:30_000,
  expect:{timeout:7_000},
  fullyParallel:false,
  workers:1,
  retries:0,
  outputDir:'test-results/playwright',
  reporter:[['list'],['html',{outputFolder:'playwright-report',open:'never'}]],
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:{command:'node tests/e2e/server.cjs',url:'http://127.0.0.1:4173/',reuseExistingServer:false,timeout:15_000},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome'],launchOptions:{args:['--disable-skia-runtime-opts']}}}]
});
