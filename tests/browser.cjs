const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/CARE MBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const project=path.resolve(__dirname,'..');
const previews=path.join(project,'assets','previews');
const server=http.createServer((req,res)=>{const file={'/demo.html':'demo.html','/fishing.js':'fishing.js'}[req.url];if(!file){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'text/html');res.end(fs.readFileSync(path.join(project,file)));});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1365,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/demo.html`,{waitUntil:'networkidle'});
  const fish=page.locator('#page-fishing-root .swimmer'), normal=page.locator('.swimmer:not(.shark)');assert.equal(await fish.count(),4);
  await page.locator('.pause').click();const before=await fish.first().boundingBox();await page.waitForTimeout(150);assert.deepEqual(await fish.first().boundingBox(),before);
  await page.evaluate(()=>scrollTo(0,400));await page.waitForTimeout(150);assert.deepEqual(await fish.first().boundingBox(),before,'Scrolling must not displace fish');await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(previews,'preview.png')});
  await normal.first().press('Enter');await page.waitForTimeout(600);assert.ok(await page.locator('.thread.inner').getAttribute('d'));
  await page.screenshot({path:path.join(previews,'catch-preview.png')});
  await page.waitForFunction(()=>document.querySelector('#page-fishing-root').shadowRoot.querySelector('.count').textContent==='1');
  assert.equal(await fish.count(),3);assert.equal(await page.locator('.thread.inner').getAttribute('d'),'');
  await page.locator('.bucket').click();assert.equal(await page.locator('.entry').count(),1);assert.match(await page.locator('.entry').innerText(),/127\.0\.0\.1/);
  await page.waitForTimeout(300);const pail=await page.locator('.ledger').boundingBox();assert.ok(Math.abs(pail.x+pail.width/2-1365/2)<2);assert.equal(await page.locator('.bucket-scene').count(),0);await page.screenshot({path:path.join(previews,'bucket-preview.png')});
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.count').innerText(),'1');
  await page.locator('.pause').click();
  await page.locator('main a').evaluate(el=>el.addEventListener('click',e=>{e.preventDefault();el.dataset.clicked='yes';}));
  await page.locator('main a').click();assert.equal(await page.locator('main a').getAttribute('data-clicked'),'yes');
  await page.locator('.pause').click();await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);await page.evaluate(()=>scrollTo(0,450));await page.waitForTimeout(150);
  assert.ok(await fish.count()>=4 && await fish.count()<=7);
  await page.locator('.pause').click();await normal.first().press('Enter');await fish.nth(1).press('Enter');assert.equal(await page.locator('.caught').count(),1);
  await page.locator('.close').click();await page.waitForTimeout(200);assert.equal(await page.locator('#page-fishing-root').count(),0);
  await page.addScriptTag({path:path.join(project,'fishing.js')});assert.equal(await fish.count(),4);
  await page.addScriptTag({path:path.join(project,'fishing.js')});assert.equal(await page.locator('#page-fishing-root').count(),0);
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.addScriptTag({path:path.join(project,'fishing.js')});
  await page.locator('.pause').click();await normal.first().press('Enter');await page.waitForFunction(()=>document.querySelector('#page-fishing-root').shadowRoot.querySelector('.count').textContent==='2');
  await page.locator('.bucket').click();assert.ok((await page.locator('.ledger').boundingBox()).x>=0);await page.screenshot({path:path.join(previews,'mobile-preview.png')});
  await page.locator('.close').click();
  await page.evaluate(()=>{Math.random=()=>.64;});
  await page.addScriptTag({path:path.join(project,'fishing.js')});await page.locator('.pause').click();
  const shark=page.locator('.shark').last();assert.ok(await shark.count());
  async function dragGear(selector,x,y){const r=await page.locator(selector).boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(x+r.width/2,y+r.height/2,{steps:8});await page.mouse.up();}
  await dragGear('.rod',25,150);await dragGear('.bucket',260,360);
  const movedRod=await page.locator('.rod').boundingBox(),movedBucket=await page.locator('.bucket').boundingBox();assert.ok(Math.abs(movedRod.x-25)<2);assert.ok(Math.abs(movedBucket.y-360)<2);
  await shark.click();await page.waitForTimeout(180);assert.equal(await page.locator('.count').innerText(),'2');assert.equal(await shark.locator('.effort').innerText(),'● ○ ○');
  await shark.click();await page.waitForTimeout(180);assert.equal(await page.locator('.count').innerText(),'2');assert.equal(await shark.locator('.effort').innerText(),'● ● ○');
  await shark.click();await page.waitForFunction(()=>document.querySelector('#page-fishing-root').shadowRoot.querySelector('.count').textContent==='3');
  await page.locator('.bucket').click();assert.match(await page.locator('.entry').first().innerText(),/Misty reef shark/);
  assert.equal(await page.locator('.entry .rarity').count(),3);
  await page.locator('.index-tab').click();assert.equal(await page.locator('.specimen').count(),4);
  await page.locator('.bucket-tab').click();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.reload({waitUntil:'networkidle'});await page.locator('.pause').click();await page.locator('.bucket').click();
  await page.locator('.release').click();await page.waitForTimeout(3100);
  assert.equal(await page.locator('.release-bucket').count(),1);assert.ok(await page.locator('.released-fish').count()>0);
  const headings=await page.locator('.released-fish').evaluateAll(els=>els.map(el=>Number(el.dataset.heading)));
  assert.ok(headings.every(angle=>angle>=0&&angle<Math.PI*2));assert.ok(new Set(headings).size>1,'Released creatures choose independent headings');
  await page.screenshot({path:path.join(previews,'release-preview.png')});
  await page.waitForFunction(()=>document.querySelector('#page-fishing-root').shadowRoot.querySelector('.count').textContent==='0');
  await page.waitForTimeout(5000);assert.equal(await page.locator('.release-bucket').count(),0);assert.equal(await page.locator('.released-fish').count(),0);
  await page.locator('.bucket').click();assert.equal(await page.locator('.entry').count(),0);
  await page.locator('.index-tab').click();assert.match(await page.locator('.summary').innerText(),/3 varieties discovered/);
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.count').innerText(),'0');
  assert.ok(Math.abs((await page.locator('.rod').boundingBox()).x-25)<2,'Rod position persists');assert.ok(Math.abs((await page.locator('.bucket').boundingBox()).y-360)<2,'Bucket position persists');
  await page.locator('.bucket').click();await page.locator('.index-tab').click();assert.match(await page.locator('.summary').innerText(),/3 varieties discovered/);
  await page.screenshot({path:path.join(previews,'index-preview.png')});
  assert.ok(await page.locator('.locked').count()>0);assert.match(await page.locator('.chance').first().innerText(),/1 in/);
  await page.locator('.book-nav button').last().click();assert.match(await page.locator('.folio').first().innerText(),/05/);
  await page.locator('.book-nav button').last().click();await page.locator('.book-nav button').last().click();await page.locator('.book-nav button').last().click();
  assert.match(await page.locator('.chance').last().innerText(),/10,000/);
  await page.screenshot({path:path.join(previews,'rare-book-preview.png')});
  await page.locator('.close').click();await page.setViewportSize({width:1365,height:900});await page.evaluate(()=>scrollTo(0,0));
  const weights=[1400,1100,1000,1000,900,700,600,500,450,350,300,50,250,200,150,80,40,20,9,1,300,200,160,100,70,40,20,10];
  for(const kind of [12,13,14,15,17,19,20,21,22,23,24,25,26,27]){
    const roll=(weights.slice(0,kind).reduce((a,b)=>a+b,0)+weights[kind]/2)/10000;
    await page.evaluate(value=>{Math.random=()=>value;},roll);await page.addScriptTag({path:path.join(project,'fishing.js')});
    const animal=page.locator(`.swimmer[data-species="${kind}"]`).first();assert.equal(await animal.count(),1);
    const start=await animal.evaluate(el=>({pose:el.style.transform,shape:el.firstElementChild.style.transform}));await page.waitForTimeout(750);
    const end=await animal.evaluate(el=>({pose:el.style.transform,shape:el.firstElementChild.style.transform}));assert.notEqual(end.pose,start.pose,`Species ${kind} moves`);
    if(kind===13||kind===14){const shapes=new Set([start.shape,end.shape]);for(let sample=0;sample<12;sample++){await page.waitForTimeout(180);shapes.add(await animal.evaluate(el=>el.firstElementChild.style.transform));}assert.ok(shapes.size>1,`Species ${kind} pulses over a full cycle`);}
    if(kind===15){const box=await animal.boundingBox();assert.ok(box.y>760,'Crab stays at the bottom');}
    await page.locator('.pause').click();const frozen=await animal.getAttribute('style');await page.waitForTimeout(100);assert.equal(await animal.getAttribute('style'),frozen);
    await page.locator('.close').click();
  }
  await page.evaluate(()=>{Math.random=()=>.05;});await page.addScriptTag({path:path.join(project,'fishing.js')});await page.locator('.pause').click();
  for(let caught=1;caught<=3;caught++){
    await page.locator('.swimmer:not(.caught)').first().press('Enter');
    if(caught===1){
      await page.waitForFunction(()=>{const r=document.querySelector('#page-fishing-root').shadowRoot;return r.querySelector('[data-phase="flying"]')&&r.querySelector('.thread.inner').getAttribute('d')==='';});
      assert.equal(await page.locator('.hook').getAttribute('visibility'),'hidden');
      assert.equal(await page.locator('.count').innerText(),'0','Creature is unhooked before it lands');
      await page.screenshot({path:path.join(project,'free-flight-preview.png')});
    }
    await page.waitForFunction(n=>document.querySelector('#page-fishing-root').shadowRoot.querySelector('.count').textContent===String(n),caught);
    const visible=await page.locator('.swimmer:not(.caught)').evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect();return r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;}).length);
    assert.ok(visible>=2,'At least two free creatures remain on screen');
  }
  assert.equal(await page.locator('.swimmer:not(.caught)').count(),2,'Replacement spawned immediately after third catch');
  const arrival=page.locator('[data-arrival="edge"]').first();assert.equal(await arrival.count(),1);
  const entryStart=await arrival.boundingBox();assert.ok(entryStart.x<0||entryStart.x+entryStart.width>1365,'Replacement starts at an edge');
  const arrivalHandle=await arrival.elementHandle();await page.locator('.pause').click();await page.waitForTimeout(600);const entryEnd=await arrivalHandle.boundingBox();assert.ok(Math.abs(entryEnd.x-entryStart.x)>20,'Replacement swims into view');
  assert.deepEqual(errors,[]);
  console.log('PASS: cast/reel, unhooked flight before landing, minimum two visible creatures, persistence, scroll, pause, mobile, shark, release cleanup, permanent book, movable gear, and 14 species movement checks; no browser errors.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});







