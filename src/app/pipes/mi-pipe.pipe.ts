import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | miPipe:exponent
 * Example:
 *   {{ 2 | miPipe:10 }}
 *   formats to: 1024
*/
@Pipe({
  name: 'miPipe',
  standalone: true
})
export class MiPipe implements PipeTransform {

  transform(value: number, exponent = 1): number {
    return Math.pow(value, exponent);
  }

}
