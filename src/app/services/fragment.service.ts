import { Injectable } from '@angular/core';

@Injectable()
export class FragmentService {
  constructor() {}

  parseFragment(frag: string): { [param: string]: string } {
    const params = frag.split('&');
    const paramsMap = params.map(param => param.split('='));
    return paramsMap.reduce((prev, cur) => (!!cur[0] ? { [cur[0]]: cur[1], ...prev } : prev), {});
  }
}
