import { Directive, HostListener, Optional } from '@angular/core';
import { FormControlDirective, FormControlName } from '@angular/forms';

@Directive({
  selector: 'textarea[appTrimOnBlur], input[appTrimOnBlur]',
})
export class TrimOnBlurDirective {
  constructor(
    @Optional() private formControlDir: FormControlDirective,
    @Optional() private formControlName: FormControlName
  ) {}

  @HostListener('blur')
  onBlur(): void {
    const control =
      this.formControlDir?.control || this.formControlName?.control;
    if (!control) {
      return;
    }

    const value = control.value;
    if (value == null) {
      return;
    }

    const trimmed = value.trim();
    control.patchValue(trimmed);
  }
}
