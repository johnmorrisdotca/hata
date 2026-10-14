import { expect,test } from "@playwright/test";
import { noSidewaysScroll,serve } from "./demo.mjs";
test("API anchors keep native examples, entry points and provenance",async({page})=>{
 await serve(page);const index="https://hata.test/api.html";await page.goto(index);
 for(const entry of ["@johnmorrisdotca/hata","@johnmorrisdotca/hata/load","@johnmorrisdotca/hata/manifest","@johnmorrisdotca/hata/flags/jp"]){
  await expect(page.locator("main").getByRole("heading",{name:entry,exact:true})).toHaveCount(1);
 }
 for(const [anchor,text] of [["main-frame","round"],["load-flag","JP-13"],["manifest-manifest","country-flag-icons"]]){
  await page.locator(`#${anchor} h3 a`).click();await expect(page.locator("main")).toContainText(text);await noSidewaysScroll(page);await page.goto(index);
 }
 await page.goto("https://hata.test/docs/api/flags-jp/default.html");
 await expect(page.locator("main .docs-signature").first()).toContainText('import value from "@johnmorrisdotca/hata/flags/jp";');
 await expect(page.locator("main .docs-signature").nth(1)).toContainText("const svg: string");
 const menu=page.locator("details.docs-menu");
 if(!(await menu.evaluate(element=>element.open))) await menu.locator(":scope > summary").click();
 const navigation=page.locator(".docs-side");
 await expect(navigation).toContainText("JP flag SVG");
 await expect(navigation.locator('a[href$="flags-ad/index.html"]')).toHaveCount(0);
 await expect(navigation.getByRole("link",{name:"Entry points",exact:true})).toHaveAttribute("href","../../index.html#reference");
 await page.goto("https://hata.test/docs/index.html");await expect(page.locator("main")).toContainText("npm install @johnmorrisdotca/hata");
 await expect(page.locator("footer")).toContainText("Hata");
});
