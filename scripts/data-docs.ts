import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const FENCE = /( \* ```ts(?: no-run)?\n)([\s\S]*?)(\n \* ```)/g;
const PREFIX = /^ \* ?/;
const LEGACY_ELEMENT = /\belement\b/g;
const LEGACY_IMAGE = /\bimage\b/g;
const LEGACY_FORM = /\bform\b/g;

export function documentExamples(source: string, file: string): string {
  const flagFile = /[/\\]flags[/\\]/.test(file);
  let flagImport = "";
  const result = source.replace(FENCE, (_all: string, _begin: string, content: string, end: string) => {
    let code = content.split("\n").map((line) => line.replace(PREFIX, "")).join("\n");
    const browser = /\b(document|navigator|element|image|form)\b/.test(code.replace(/from "[^"]+"/g,""));
    if (code.includes("element.innerHTML")) code = code.replace(LEGACY_ELEMENT,"host");
    if (code.includes("image.src")) code = code.replace(LEGACY_IMAGE,"previewImage");
    if (code.includes("form.country")) code = code.replace(LEGACY_FORM,"formValue");
    const parsed = ts.createSourceFile("example.ts",code,ts.ScriptTarget.Latest,true);
    const changes: {start:number;end:number;value:string}[] = [];
    const declarations = new Set<string>();
    for (const statement of parsed.statements) {
      if (ts.isVariableStatement(statement)) for(const declaration of statement.declarationList.declarations) if(ts.isIdentifier(declaration.name)) declarations.add(declaration.name.text);
      if (!ts.isExpressionStatement(statement)) continue;
      const expression = statement.expression;
      if (ts.isCallExpression(expression) && expression.expression.getText(parsed)==="console.log") continue;
      if (ts.isBinaryExpression(expression) || ts.isPostfixUnaryExpression(expression)) continue;
      changes.push({start:expression.getStart(parsed),end:expression.end,value:`console.log(${expression.getText(parsed)})`});
    }
    for(const change of changes.sort((left,right)=>right.start-left.start)) code=code.slice(0,change.start)+change.value+code.slice(change.end);
    const initial: string[] = [];
    if(code.includes("host.innerHTML")&&!declarations.has("host"))initial.push('const host=document.createElement("div");');
    if(code.includes("previewImage.src")&&!declarations.has("previewImage"))initial.push('const previewImage=document.createElement("img");');
    if(code.includes("formValue.country")&&!declarations.has("formValue"))initial.push('const formValue={country:"JP"};');
    if(initial.length){const afterImports=parsed.statements.filter(ts.isImportDeclaration).at(-1)?.end??0;code=code.slice(0,afterImports)+"\n\n"+initial.join("\n")+"\n"+code.slice(afterImports).trimStart();}
    if(!code.includes("console.log")){
      if(code.includes("host.innerHTML"))code+='\nconsole.log(host.querySelector("svg")?.getAttribute("viewBox"));';
      else {const variable=[...declarations].at(-1);if(variable)code+='\nconsole.log('+variable+');';}
    }
    if(flagFile){const imported=parsed.statements.find(ts.isImportDeclaration);if(imported&&ts.isStringLiteral(imported.moduleSpecifier))flagImport=imported.moduleSpecifier.text;}
    return " * ```ts"+(browser?" no-run":"")+"\n"+code.split("\n").map(line=>` *${line?" "+line:""}`).join("\n")+end;
  });
  if(!flagFile || !flagImport || result.includes("console.log(svg.startsWith"))return result;
  const extra='\n *\n * @example\n * ```ts\n * import { svg } from "'+flagImport+'";\n * console.log(svg.startsWith("<svg"),svg.length);\n * ```\n ';
  const parsed=ts.createSourceFile(file,result,ts.ScriptTarget.Latest,true);
  const declaration=parsed.statements.find((statement): statement is ts.VariableStatement => ts.isVariableStatement(statement)&&statement.declarationList.declarations.some(item=>ts.isIdentifier(item.name)&&item.name.text==="svg"));
  const comment=declaration ? ts.getJSDocCommentsAndTags(declaration).find(ts.isJSDoc) : undefined;
  if(!comment)throw new Error(`No generated flag doc in ${file}`);
  return result.slice(0,comment.end-2)+extra+result.slice(comment.end-2);
}

export function writeDocumentedFile(file:string,source:string):void {
  writeFileSync(file,file.endsWith(".ts")?documentExamples(source,file):source);
}

export function refreshGeneratedExamples():void {
  let changed=0;
  for(const folder of ["src/flags","src/data"]){for(const name of readdirSync(folder,{recursive:true})){
    if(typeof name!=="string"||!name.endsWith(".ts"))continue;
    const file=join(folder,name),before=readFileSync(file,"utf8"),after=documentExamples(before,file);
    if(before!==after){writeFileSync(file,after);changed++;}
  }}
  console.log(`Refreshed examples in ${changed} generated files; SVGs, data and metadata retained.`);
}
