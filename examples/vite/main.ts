import "@johnmorrisdotca/hata/element/define";

const flag = document.querySelector("hata-flag")!;
flag.addEventListener("hata-load", (event) => console.log((event as CustomEvent<{ code: string }>).detail.code));
