import { readdirSync,statSync } from "node:fs";
import { join } from "node:path";
import { expect,test } from "@playwright/test";
const bytes=folder=>readdirSync(folder,{withFileTypes:true}).reduce((total,entry)=>total+(entry.isDirectory()?bytes(join(folder,entry.name)):statSync(join(folder,entry.name)).size),0);
test("the full published site stays below the Pages size limit",()=>{
 expect(bytes("site"),"retain headroom below GitHub Pages' 1 GB site limit").toBeLessThan(900_000_000);
});
