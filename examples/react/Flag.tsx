import "@johnmorrisdotca/hata/element/define";

export function Flag({ code = "JP-13" }: { code?: string }) {
  return <hata-flag code={code} label="Tokyo" />;
}
