import "@angular/compiler";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { FlagComponent } from "./flag.component";

void bootstrapApplication(FlagComponent, { providers: [provideZonelessChangeDetection()] });
