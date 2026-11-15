import { ComponentHarness } from '@angular/cdk/testing';

export class V2AccesibilidadHarness extends ComponentHarness {
  static hostSelector = 'app-v2-accesibilidad';

  private readonly nameInput = this.locatorFor('#nombre');
  private readonly saveButton = this.locatorFor('button[type="submit"]');
  private readonly alert = this.locatorForOptional('[role="alert"]');

  async enterName(value: string): Promise<void> {
    const input = await this.nameInput();
    await input.clear();
    await input.sendKeys(value);
  }

  async save(): Promise<void> { await (await this.saveButton()).click(); }
  async getValidationMessage(): Promise<string | null> {
    const alert = await this.alert();
    return alert ? alert.text() : null;
  }
}
