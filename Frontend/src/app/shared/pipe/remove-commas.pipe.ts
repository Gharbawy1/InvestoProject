import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeCommas' })
export class RemoveCommasPipe implements PipeTransform {
  transform(value: string): number {
    return parseFloat(value.replace(/,/g, ''));
  }
}