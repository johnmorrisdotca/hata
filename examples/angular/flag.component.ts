import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from "@angular/core";
import "@johnmorrisdotca/hata/element/define";

@Component({
  selector: "app-flag",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<hata-flag [attr.code]="code" label="Tokyo"></hata-flag>`,
})
export class FlagComponent {
  @Input() code = "JP-13";
}
