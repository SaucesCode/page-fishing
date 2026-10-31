const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/CARE MBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('node:path'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{localStorage.setItem('pageFishingCatches',JSON.stringify(Array.from({length:16},(_,i)=>({id:String(i),name:['Mist Silk Guppy','Apricot Striped Angelfish','Apricot Dappled Sea turtle','Orchid Dappled Angelfish'][i%4],kind:i%4,palette:i%8,pattern:i%3,size:17+i,rarity:i%3?'Common':'Uncommon',site:'a-very-long-source-website.example.com',date:new Date().toISOString()}))));});
for(const [width,height] of [[932,833],[390,844],[390,450]]){
await page.setViewportSize({width,height});await page.goto(pathToFileURL(path.resolve(__dirname,'../demo.html')).href);await page.evaluate(()=>{document.body.style.background='#151917';document.body.style.color='#eee';});
await page.locator('.bucket').click();await page.waitForTimeout(100);
await page.locator('.rewards-tab').click();assert.equal(await page.locator('.reward-buttons button:disabled').count(),8,'Four species do not unlock higher rewards');await page.locator('.bucket-tab').click();
const bounds=await page.locator('.ledger').boundingBox(),entries=await page.locator('.entries').boundingBox(),release=await page.locator('.release').boundingBox();
assert.ok(bounds.y>=0&&bounds.y+bounds.height<=height);assert.ok(entries.y>=bounds.y&&entries.y+entries.height<release.y);assert.ok(release.y+release.height<bounds.y+bounds.height);
assert.equal(await page.locator('.entry').count(),16);
for(const entry of await page.locator('.entry').all()){const box=await entry.boundingBox();assert.ok(box.x>=entries.x-1&&box.x+box.width<=entries.x+entries.width+1,'Card contained horizontally');}
assert.ok(await page.locator('.entries').evaluate(el=>el.scrollHeight>el.clientHeight));
await page.screenshot({path:path.resolve(__dirname,`../bucket-layout-${width}-${height}.png`)});
await page.locator('.entries').evaluate(el=>el.scrollTop=el.scrollHeight);assert.ok(await page.locator('.release').isVisible());
await page.locator('.index-tab').click();assert.equal(await page.locator('.specimen').count(),4);await page.locator('.close-book').click();
}
await page.evaluate(()=>localStorage.setItem('pageFishingCatches',JSON.stringify(Array.from({length:20},(_,i)=>({id:String(i),kind:i,name:'Species '+i,palette:1,pattern:0,size:20,site:'test',released:'yes'})))));
await page.addScriptTag({path:path.resolve(__dirname,'../fishing.js')});await page.addScriptTag({path:path.resolve(__dirname,'../fishing.js')});await page.locator('.bucket').click();await page.locator('.rewards-tab').click();
assert.equal(await page.locator('.reward-buttons button:disabled').count(),2,'Released discoveries still unlock up to 20 species milestones');await page.locator('.reward-buttons button[data-reward="bucket"]').click();assert.equal(await page.locator('#page-fishing-root').getAttribute('data-reed'),'true');
await page.locator('.close-book').click();await page.addScriptTag({path:path.resolve(__dirname,'../fishing.js')});await page.addScriptTag({path:path.resolve(__dirname,'../fishing.js')});await page.waitForTimeout(100);assert.equal(await page.locator('#page-fishing-root').getAttribute('data-reed'),'true','Selected reward persists after reopening');
assert.deepEqual(errors,[]);console.log('PASS: filled bucket containment, scrolling, book switching, locked/unlocked rewards, released discoveries, and style persistence.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
